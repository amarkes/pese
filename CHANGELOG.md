# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.




## [0.10.2] - 2026-03-20 17:44
- - feat: add notification warning for unavailable local notification module in settings

## [0.10.1] - 2026-03-20 17:09

- feat: update release script to improve CHANGELOG entry process with summary and bullet items

## [0.10.0] - 2026-03-20 17:06
feat: implement local notification system for reminders

- Added LocalNotificationService to handle scheduling and validation of reminders.
- Integrated notification permissions for Android and iOS.
- Updated AppSettings to include new reminder settings for weight, glucose, and water intake.
- Enhanced useSettings hook to manage new settings and validate them before saving.
- Created LocalNotificationModule for native notification handling on both Android and iOS.
- Implemented LocalNotificationScheduler to manage reminder scheduling and notifications.
- Updated SettingsScreen to include UI for managing reminder settings.
- Added LocalNotificationBootReceiver to reschedule notifications on device boot.

## [0.9.0] - 2026-03-20 13:14
### feat: add dashboard screen with weight, glucose, and water tracking

- Implemented DashboardScreen to display user health metrics including weight, glucose levels, and water consumption.
- Added QuickActionsSection, SummarySection, and TrendSection components for better organization of data.
- Integrated data fetching from WeightStorage, GlucoseStorage, WaterStorage, and SettingsStorage.
- Introduced loading states and error handling for data fetching.

### feat: create glucose input components for measurement entry

- Developed GlucoseInput component for user to input glucose values.
- Added ObservationsInput for additional notes related to glucose measurements.
- Created MeasurementTypeSelector to allow users to specify the type of glucose measurement.
- Implemented DateTimePickerRow for selecting measurement time.

### feat: add glucose alert and orientation display

- Created GlucoseAlertBox to provide feedback on glucose levels with visual indicators.
- Implemented OrientationsModal to show glucose ranges based on user settings.
- Added SaveButton for saving glucose records with conditional styling based on input validity.

### style: enhance UI with consistent theming and responsive design

- Updated styles across components to ensure consistency in dark and light modes.
- Improved layout and spacing for better user experience on various screen sizes.

## [0.8.0] - 2026-03-19 20:55
- feat: Add PDF and CSV export functionality for health reports, including a new date range modal and updated navigation.

## [0.7.0] - 2026-03-19 20:08
- feat: Implement new reports screen with data summary, period selection, data inclusion, and export actions, along with corresponding translations.

## [0.6.0] - 2026-03-19 19:27
- Refactor glucose, water, and weight registration screens, implement new settings management, and update translations.

## [0.5.0] - 2026-03-19 18:19
- water page

## [0.4.0] - 2026-03-19 18:03
- glucose page add with storage

## [0.3.2] - 2026-03-19 23:39
- add npm audit in script release

## [0.3.1] - 2026-03-19 23:35
- fix release script lint

## [0.3.0] - 2026-03-19 23:30
- add history page, replace inter font with outfit, update dependencies

## [0.2.0] - 2026-03-18 20:32
- add page add weight

## [0.1.0] - 2026-03-18 20:08
- settings and darkmod 

## [0.0.7] - 2026-03-18 19:51
- remove vendor for directory

## [0.0.6] - 2026-03-18 19:45
- fix hour by ia

## [0.0.5] - 2026-03-18
- fix hour in changelog

## [0.0.4] - 2026-03-18
- fix hour in changelog

## [0.0.3] - 2026-03-18
- addd hour in change log

## [0.0.2] - 2026-03-18
- add script release for auto push in directory
