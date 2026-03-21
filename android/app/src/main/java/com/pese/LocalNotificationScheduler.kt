package com.pese

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar

private const val DEFAULT_SOUND = "default"
private const val SILENT_SOUND = "silent"

data class ScheduledReminder(
  val id: String,
  val title: String,
  val body: String,
  val hour: Int,
  val minute: Int,
  val sound: String = DEFAULT_SOUND
)

object LocalNotificationScheduler {
  private const val CHANNEL_PREFIX = "pese_daily_reminders"
  private const val CHANNEL_NAME = "Daily reminders"
  private const val CHANNEL_DESCRIPTION = "Local reminders to log health data"
  private const val PREFS_NAME = "pese_local_notifications"
  private const val PREF_REMINDERS = "reminders"
  const val EXTRA_ID = "extra_id"
  const val EXTRA_TITLE = "extra_title"
  const val EXTRA_BODY = "extra_body"
  const val EXTRA_HOUR = "extra_hour"
  const val EXTRA_MINUTE = "extra_minute"

  fun scheduleAll(context: Context, reminders: List<ScheduledReminder>) {
    cancelAll(context, clearStored = false)
    saveReminders(context, reminders)
    reminders.map { it.sound }.distinct().forEach { createNotificationChannel(context, it) }
    reminders.forEach { scheduleReminder(context, it) }
  }

  fun cancelAll(context: Context, clearStored: Boolean = true) {
    val storedReminders = loadReminders(context)
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    storedReminders.forEach { reminder ->
      val pendingIntent = createPendingIntent(context, reminder)
      alarmManager.cancel(pendingIntent)
      pendingIntent.cancel()
      NotificationManagerCompat.from(context).cancel(notificationIdFor(reminder.id))
    }

    if (clearStored) {
      saveReminders(context, emptyList())
    }
  }

  fun rescheduleFromPreferences(context: Context) {
    loadReminders(context).map { it.sound }.distinct().forEach { createNotificationChannel(context, it) }
    loadReminders(context).forEach { scheduleReminder(context, it) }
  }

  fun handleTriggeredReminder(context: Context, reminder: ScheduledReminder) {
    showNotification(context, reminder)
    scheduleReminder(context, reminder)
  }

  private fun scheduleReminder(context: Context, reminder: ScheduledReminder) {
    val safeReminder = reminder.copy(
      hour = reminder.hour.coerceIn(0, 23),
      minute = reminder.minute.coerceIn(0, 59)
    )

    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val pendingIntent = createPendingIntent(context, safeReminder)
    alarmManager.cancel(pendingIntent)

    val triggerAt = nextTriggerAt(safeReminder.hour, safeReminder.minute)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
    } else {
      alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
    }
  }

  private fun createPendingIntent(context: Context, reminder: ScheduledReminder): PendingIntent {
    val intent = Intent(context, LocalNotificationReceiver::class.java).apply {
      putExtra(EXTRA_ID, reminder.id)
      putExtra(EXTRA_TITLE, reminder.title)
      putExtra(EXTRA_BODY, reminder.body)
      putExtra(EXTRA_HOUR, reminder.hour)
      putExtra(EXTRA_MINUTE, reminder.minute)
    }

    return PendingIntent.getBroadcast(
      context,
      requestCodeFor(reminder.id),
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
  }

  private fun nextTriggerAt(hour: Int, minute: Int): Long {
    val now = Calendar.getInstance()
    val trigger = Calendar.getInstance().apply {
      set(Calendar.HOUR_OF_DAY, hour)
      set(Calendar.MINUTE, minute)
      set(Calendar.SECOND, 0)
      set(Calendar.MILLISECOND, 0)
      if (!after(now)) {
        add(Calendar.DAY_OF_YEAR, 1)
      }
    }

    return trigger.timeInMillis
  }

  private fun showNotification(context: Context, reminder: ScheduledReminder) {
    createNotificationChannel(context, reminder.sound)
    val channelId = channelIdFor(reminder.sound)

    val launchIntent =
      Intent(Intent.ACTION_VIEW, Uri.parse(deepLinkFor(reminder.id)), context, MainActivity::class.java).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
      }

    val contentIntent = PendingIntent.getActivity(
      context,
      requestCodeFor("open-${reminder.id}"),
      launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    val notificationBuilder = NotificationCompat.Builder(context, channelId)
      .setSmallIcon(R.drawable.ic_notification)
      .setContentTitle(reminder.title)
      .setContentText(reminder.body)
      .setStyle(NotificationCompat.BigTextStyle().bigText(reminder.body))
      .setPriority(NotificationCompat.PRIORITY_DEFAULT)
      .setColor(0xFF2563EB.toInt())
      .setAutoCancel(true)
      .setContentIntent(contentIntent)

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      applyLegacySound(notificationBuilder, reminder.sound)
    }

    val notification = notificationBuilder.build()

    NotificationManagerCompat
      .from(context)
      .notify(notificationIdFor(reminder.id), notification)
  }

  private fun saveReminders(context: Context, reminders: List<ScheduledReminder>) {
    val json = JSONArray().apply {
      reminders.forEach { reminder ->
        put(
          JSONObject().apply {
            put("id", reminder.id)
            put("title", reminder.title)
            put("body", reminder.body)
            put("hour", reminder.hour)
            put("minute", reminder.minute)
            put("sound", reminder.sound)
          }
        )
      }
    }

    context
      .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      .edit()
      .putString(PREF_REMINDERS, json.toString())
      .apply()
  }

  private fun loadReminders(context: Context): List<ScheduledReminder> {
    val rawValue = context
      .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      .getString(PREF_REMINDERS, null)
      ?: return emptyList()

    return try {
      val jsonArray = JSONArray(rawValue)
      List(jsonArray.length()) { index ->
        val item = jsonArray.getJSONObject(index)
        ScheduledReminder(
          id = item.getString("id"),
          title = item.getString("title"),
          body = item.getString("body"),
          hour = item.getInt("hour"),
          minute = item.getInt("minute"),
          sound = item.optString("sound", DEFAULT_SOUND)
        )
      }
    } catch (error: Exception) {
      emptyList()
    }
  }

  private fun requestCodeFor(id: String) = id.hashCode()

  private fun notificationIdFor(id: String) = id.hashCode()

  private fun channelIdFor(sound: String) = "${CHANNEL_PREFIX}_${sound.hashCode()}"

  private fun soundUriFor(sound: String): Uri? =
    when (sound) {
      SILENT_SOUND -> null
      DEFAULT_SOUND -> RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
      else -> Uri.parse(sound)
    }

  private fun deepLinkFor(reminderId: String): String =
    when {
      reminderId == "weight-daily" -> "pese://register/weight"
      reminderId.startsWith("glucose-") -> "pese://register/glucose"
      reminderId.startsWith("water-") -> "pese://register/water"
      else -> "pese://"
    }

  private fun applyLegacySound(
    builder: NotificationCompat.Builder,
    sound: String
  ) {
    val soundUri = soundUriFor(sound)
    if (soundUri != null) {
      builder.setSound(soundUri)
    } else {
      builder.setSilent(true)
    }
  }

  private fun createNotificationChannel(context: Context, sound: String) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val notificationManager =
      context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    val channel = NotificationChannel(
      channelIdFor(sound),
      CHANNEL_NAME,
      NotificationManager.IMPORTANCE_DEFAULT
    ).apply {
      description = CHANNEL_DESCRIPTION

      val soundUri = soundUriFor(sound)
      if (soundUri != null) {
        val audioAttributes = AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_NOTIFICATION)
          .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .build()
        setSound(soundUri, audioAttributes)
      } else {
        setSound(null, null)
        enableVibration(false)
      }
    }

    notificationManager.createNotificationChannel(channel)
  }
}
