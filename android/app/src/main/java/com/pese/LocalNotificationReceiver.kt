package com.pese

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class LocalNotificationReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val reminder = ScheduledReminder(
      id = intent.getStringExtra(LocalNotificationScheduler.EXTRA_ID) ?: return,
      title = intent.getStringExtra(LocalNotificationScheduler.EXTRA_TITLE)
        ?: context.getString(R.string.app_name),
      body = intent.getStringExtra(LocalNotificationScheduler.EXTRA_BODY) ?: "",
      hour = intent.getIntExtra(LocalNotificationScheduler.EXTRA_HOUR, 8),
      minute = intent.getIntExtra(LocalNotificationScheduler.EXTRA_MINUTE, 0)
    )

    LocalNotificationScheduler.handleTriggeredReminder(context, reminder)
  }
}
