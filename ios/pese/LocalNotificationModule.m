#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <UserNotifications/UserNotifications.h>

static NSString *const kPeseReminderPrefix = @"pese.reminder.";
static NSString *const kStoredReminderIdentifiersKey = @"pese.storedReminderIdentifiers";

@interface LocalNotificationModule : NSObject <RCTBridgeModule>
@end

@implementation LocalNotificationModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_REMAP_METHOD(
  requestPermission,
  requestPermissionWithResolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  UNAuthorizationOptions options = UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;

  [center requestAuthorizationWithOptions:options
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (error != nil) {
      reject(@"permission_failed", @"Failed to request notification permission", error);
      return;
    }

    resolve(@(granted));
  }];
}

RCT_REMAP_METHOD(
  scheduleReminders,
  scheduleRemindersWithItems:(NSArray<NSDictionary *> *)items
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [self clearStoredRemindersForCenter:center completion:^{
    NSMutableArray<NSString *> *storedIdentifiers = [NSMutableArray array];
    __block NSInteger pendingCount = items.count;
    __block BOOL finished = NO;

    if (items.count == 0) {
      resolve(nil);
      return;
    }

    for (NSDictionary *item in items) {
      NSString *reminderId = item[@"id"];
      NSString *title = item[@"title"];
      NSString *body = item[@"body"];
      NSNumber *hour = item[@"hour"];
      NSNumber *minute = item[@"minute"];

      if (reminderId == nil || title == nil || body == nil || hour == nil || minute == nil) {
        reject(@"schedule_failed", @"Invalid reminder payload", nil);
        return;
      }

      NSString *identifier = [kPeseReminderPrefix stringByAppendingString:reminderId];
      [storedIdentifiers addObject:identifier];

      NSDateComponents *components = [[NSDateComponents alloc] init];
      components.hour = MAX(0, MIN(23, hour.integerValue));
      components.minute = MAX(0, MIN(59, minute.integerValue));

      UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
      content.title = title;
      content.body = body;
      content.sound = [UNNotificationSound defaultSound];

      UNCalendarNotificationTrigger *trigger =
        [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:components repeats:YES];

      UNNotificationRequest *request =
        [UNNotificationRequest requestWithIdentifier:identifier
                                             content:content
                                             trigger:trigger];

      [center addNotificationRequest:request
               withCompletionHandler:^(NSError * _Nullable error) {
        if (finished) {
          return;
        }

        if (error != nil) {
          finished = YES;
          reject(@"schedule_failed", @"Failed to schedule local notification", error);
          return;
        }

        pendingCount -= 1;
        if (pendingCount == 0) {
          finished = YES;
          [[NSUserDefaults standardUserDefaults] setObject:storedIdentifiers forKey:kStoredReminderIdentifiersKey];
          resolve(nil);
        }
      }];
    }
  }];
}

RCT_REMAP_METHOD(
  cancelAllReminders,
  cancelAllRemindersWithResolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [self clearStoredRemindersForCenter:center completion:^{
    resolve(nil);
  }];
}

- (void)clearStoredRemindersForCenter:(UNUserNotificationCenter *)center completion:(dispatch_block_t)completion
{
  NSArray<NSString *> *storedIdentifiers =
    [[NSUserDefaults standardUserDefaults] arrayForKey:kStoredReminderIdentifiersKey] ?: @[];

  [center removePendingNotificationRequestsWithIdentifiers:storedIdentifiers];
  [center removeDeliveredNotificationsWithIdentifiers:storedIdentifiers];
  [[NSUserDefaults standardUserDefaults] removeObjectForKey:kStoredReminderIdentifiersKey];
  completion();
}

@end
