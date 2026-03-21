package com.pese

import android.media.RingtoneManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

class LocalNotificationModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "LocalNotificationModule"

  @ReactMethod
  fun scheduleReminders(reminders: ReadableArray, promise: Promise) {
    try {
      val parsedReminders = List(reminders.size()) { index ->
        val item = reminders.getMap(index) ?: throw IllegalArgumentException("Invalid reminder")
        parseReminder(item)
      }

      LocalNotificationScheduler.scheduleAll(reactApplicationContext, parsedReminders)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("schedule_failed", error)
    }
  }

  @ReactMethod
  fun cancelAllReminders(promise: Promise) {
    try {
      LocalNotificationScheduler.cancelAll(reactApplicationContext)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("cancel_failed", error)
    }
  }

  @ReactMethod
  fun getAvailableSounds(promise: Promise) {
    try {
      val ringtoneManager = RingtoneManager(reactApplicationContext).apply {
        setType(RingtoneManager.TYPE_NOTIFICATION)
      }

      val sounds = Arguments.createArray()
      ringtoneManager.cursor.use { cursor ->
        while (cursor.moveToNext()) {
          val position = cursor.position
          val uri = ringtoneManager.getRingtoneUri(position) ?: continue
          val title =
            ringtoneManager.getRingtone(position)?.getTitle(reactApplicationContext)
              ?: reactApplicationContext.getString(R.string.app_name)

          val item = Arguments.createMap().apply {
            putString("id", uri.toString())
            putString("name", title)
          }

          sounds.pushMap(item)
        }
      }

      promise.resolve(sounds)
    } catch (error: Exception) {
      promise.reject("sounds_failed", error)
    }
  }

  private fun parseReminder(item: ReadableMap): ScheduledReminder {
    return ScheduledReminder(
      id = item.getString("id") ?: throw IllegalArgumentException("Reminder id is required"),
      title = item.getString("title") ?: reactApplicationContext.getString(R.string.app_name),
      body = item.getString("body") ?: "",
      hour = item.getInt("hour"),
      minute = item.getInt("minute"),
      sound = item.getString("sound") ?: "default"
    )
  }
}
