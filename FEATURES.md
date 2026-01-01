# FamilyCal Features Reference

**Last Updated:** December 25, 2024

This document serves as a comprehensive reference for all features, configurations, and constraints in the FamilyCal rebuild with **Supabase Calendar as the default**. EventKit support for allowing additional calendars and for syncing with supabase calendars. 

**IMPORTANT**: This document describes the architecture.

---

## Table of Contents

1. [Core Features](#core-features)
2. [Authentication & User Management](#authentication--user-management)
3. [Family Management](#family-management)
4. [Calendar Integration](#calendar-integration)
5. [Event Management](#event-management)
6. [Invitation System](#invitation-system)
7. [Notifications](#notifications)
8. [Checklists](#checklists)
9. [Attachments](#attachments)
10. [UI/UX Features](#uiux-features)
11. [Pro Features & Subscriptions](#pro-features--subscriptions)
12. [Widget System](#widget-system)
13. [Settings & Preferences](#settings--preferences)
14. [Data Sync & Storage](#data-sync--storage)
15. [Critical Configurations](#critical-configurations)

---

## Core Features

### App Architecture
- **Web/iOS/Android App**: React Native with Expo (Managed Workflow)
- **Widget Extension**: Native Widget extension via Expo Config Plugins (iOS WidgetKit / Android Widgets)
- **Notification Services**: Expo Notifications (Local & Push)
- **Data Persistence**: WatermelonDB or SQLite + Supabase PostgreSQL
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)

### Core Service Modules
All core services should be implemented as singletons or context providers:

1. **SupabaseAuthService**
   - Authentication state management
   - Login/logout/signup operations
   - Token management and refresh
   - Session persistence (SecureStore)
   - Guest mode support

2. **SupabaseDataService**
   - CRUD operations for family data
   - Event synchronization
   - Family member management
   - Calendar data operations
   - Smart sync with change detection

3. **SupabaseClient**
   - Low-level Supabase Client instance (supabase-js)
   - Automatic token refresh handling

4. **AppSettingsService**
   - User preferences sync to Supabase
   - Local caching via AsyncStorage/MMKV
   - Widget preferences sync to App Groups (via Native Modules)
   - Pro feature enforcement

5. **CalendarService**
   - Web/iOS/Android Calendar integration (expo-calendar)
   - External calendar syncing
   - Calendar CRUD operations
   - Event fetching and filtering
   - Travel time management
   - Soft-delete event filtering

6. **NotificationService**
   - Push notification permissions (expo-notifications)
   - Event notifications with alarms
   - Morning brief notifications
   - Calendar change monitoring
   - Notification history tracking

7. **ChecklistManager**
   - Checklist CRUD operations
   - Device-independent event identification
   - Item notifications
   - Supabase sync

---

## Authentication & User Management

### Supported Auth Methods
1. **Email/Password**
   - Sign up with email confirmation
   - Password reset via email
   - Session persistence

2. **Google OAuth**
   - Google Sign-In integration
   - ID token exchange with Supabase
   - Automatic account creation

3. **Guest Mode**
   - Local-only data storage
   - No cloud sync
   - Settings stay local
   - Cannot access Pro features requiring sync

### Session Management
- **Access Tokens**: Stored in `SecureStore` and memory
- **Refresh Tokens**: Automatically handled by Supabase Client
- **Session Validation**: Checked on app launch
- **Token Refresh**: Automatic retry on failure
- **Logout Behavior**: Clears session for authenticated users, preserves local data for guests

### Auth Providers
Tracked in `SupabaseAuthManager.authProvider`:
- `.emailPassword`
- `.google`
- `.guest`
- `.unknown`

---

## Family Management

### Family Structure
- **Family**: Top-level organization (one per account owner)
- **Family Members**: People in the family
- **Family Calendar**: One default Supabase calendar per family
- **Event Attendees**: Events assigned to members via attendee relationships
- **Shared Calendars**: Additional calendars for family members with EventKit/Google Calendar or additional Supabase calendars

### Family Setup Flow

#### New Users (No Family)
**MUST complete full family setup wizard**:
1. Create family (family name, assign calendar color)
2. Add family members (name, color for each)
3. Auto-create family calendar (`family_calendars` with `is_default = true`)
4. Set `families.calendar_system = 'supabase'`
5. Link current user to a family member (optional)


#### Invited Users
**Auto-linked to existing family**:
- Accept invitation via token
- Linked to family member record (`family_members.linked_user_id`)
- Inherit existing family's `calendar_system` setting
- Skip family creation, go directly to main app

### Family Constraints
#### Free Tier
- Max 2 family members
- Max 1 shared calendar (future feature)

#### Pro Tier
- Unlimited family members
- Unlimited shared calendars (future feature)

### Family Member Properties
- Name (required)
- Color (for UI display in attendee-based events)
- Email (optional, for invitations)
- Linked User ID (Supabase auth user linked to this member)
- Sort Order (for UI display)
- Is Invited (pending invitation flag)
- Avatar Initials (for profile display)
- Wake/Bed Times (for scheduling, optional)

### Calendar System
- **Supabase Calendar**: Events stored centrally in database
- **Attendee-Based**: Events show for members based on `event_attendees` table
- **Cross-Platform**: Same data accessible on iOS, Android, Web
- **No Device Dependencies**: Calendar IDs not needed, events use Supabase UUIDs

---

## Calendar Integration

### Supabase Calendar System (Default)

**Architecture**: One family calendar per family with attendee-based event assignment

#### Core Concepts
1. **Family Calendar**: Auto-created when family is created (`family_calendars` table, `is_default = true`)
2. **Events**: Stored in `calendar_events` table, linked to family
3. **Attendees**: Events assigned to members via `event_attendees` table
4. **Color Logic**:
   - **Everyone Events** (all family members): User-selected color (stored in `family_calendars.color`)
   - **Specific Member Events**: First attendee's member color
   - **No Attendees**: Gray fallback (#808080)

#### Event Assignment
- **"Everyone" Events**: All family members are attendees → Shows in family calendar color (customizable)
- **"Specific Members" Events**: Selected members are attendees → Shows in first attendee's member color
- **Auto-Add**: When new member joins, they're automatically added to all "Everyone" events

#### Event Operations
- **Create**: Insert into `calendar_events`, add attendees to `event_attendees`
- **Update**: Modify event record, update attendees if changed
- **Delete**: Soft delete (`is_deleted = true`)
- **Recurrence**: iCalendar RRULE format stored in `recurrence_rule`
- **Filtering**: Query events by member via `event_attendees.member_id`

#### Synchronization
- **Manual Refresh**: Pull-to-refresh in calendar views
- **Auto Refresh**: Timer-based (configurable interval, default 5 min)
- **Real-Time Sync**: Supabase Realtime (optional, future feature)
- **Offline Support**: Local cache with sync on reconnect
- **Widget Updates**: Reloads timelines on data changes

#### Event Fetching
- **Time Window**: Configurable past (default 90 days) and future (default 180 days)
- **Soft Delete Filtering**: Automatically filters `is_deleted = true` events
- **Async Operations**: All Supabase queries run asynchronously
- **Caching**: Events cached locally for offline access

---

## Event Management

### Event Properties
- Title
- Start Date/Time
- End Date/Time
- Location
- Notes/Description
- Meeting Link (URL)
- All-Day flag
- Recurrence Rule
- Alert/Reminder
- Travel Time
- Show As (Busy/Free)
- Attachments (Pro only)
- Checklists
- Drivers (Pro only)

### Alert Options (`AlertOption` enum)
- `none`: No alert
- `atTime`: At event time
- `fifteenMinsBefore`: 15 minutes before
- `oneHourBefore`: 1 hour before
- `oneDayBefore`: 1 day before
- `custom`: Custom time (not fully implemented)

### Show As Options (`ShowAsOption` enum)
- `busy`: Shows as busy (default)
- `free`: Shows as free time

### Default Home Screen (`DefaultHomeScreen` enum)
- `.family`: Family view (default)
- `.calendarMonth`: Calendar month view
- `.calendarDay`: Calendar day view

### Event Display Modes
#### Upcoming Events Density
- `detailed`: Full event details
- Compact variations: `option1`, `option2`, etc.

#### Calendar Events Density
- `detailed`: Full calendar cell details
- Compact variations

#### Calendar Cell Layout
- `dots`: Event dots (default)
- `option1`, `option2`, `option3`, `option4`: Various compact layouts

### Recurrence Handling
- Supports daily, weekly, monthly, yearly frequencies, and custom recurrence rules
- Displays future occurrences in event detail
- Prevents timeline overflow by detecting next different event
- Edit options: This event, All future events

---

## Invitation System

### Overview
FamilyCal supports **two types of invitations** to join families:

1. **Email Invitations**: Sent to specific email, can only be accepted by that email (legacy)
2. **Shareable Invitations**: Universal links shareable via WhatsApp, QR codes, or direct links (v2 feature)

### Shareable Invitations

**Key Feature**: Create invitation links that can be shared with anyone

#### Invitation Creation
- Family owner taps "Invite" button in Family View
- System calls `create_shareable_invitation(member_id)` RPC
- Returns: `{ id, token, expires_at }`
- Auto-expires after 7 days
- Tracked in `invitations` table with `invitation_type = 'shareable'`

#### Sharing Methods
1. **WhatsApp**: Pre-filled message with invitation link
2. **QR Code**: Scannable QR code encoding the invitation URL
3. **Copy Link**: Universal web link (https://familycal.app/join?token=XXX)
4. **Share Sheet**: iOS/Android native share dialog

#### Deep Linking
- **Deep Link**: `familycal://join?invite_token=XXX` (opens app if installed)
- **Web Link**: `https://familycal.app/join?token=XXX` (fallback to App Store/web app)
- **Universal Links**: Automatic app detection and opening

#### Acceptance Flow
1. Recipient clicks invitation link
2. If app installed: Opens app with token
3. If not installed: Web landing page → Download app or sign up on web
4. After authentication: Calls `accept_family_invitation(token)` RPC
5. Links user account to family member record
6. Updates `profiles.family_id` and `family_members.linked_user_id`
7. User gains access to family calendar

#### Security
- Tokens are cryptographically secure (32-character random strings)
- 7-day expiration enforced
- One-time use (marked as accepted after first use)
- RLS policies ensure only family owners can create invitations

### Email Invitations (Legacy)

**Traditional Method**: Email-based invitations

- `invitee_email` field populated in `invitations` table
- Can only be accepted by user with matching email
- `invitation_type = 'email'`
- More secure but less convenient than shareable invitations
- Edge Function can send email automatically (not yet implemented)

### Invitation Management

#### Tracking
- All invitations stored in `invitations` table
- Status: `pending`, `accepted`, `expired`, `revoked`
- Family owners can view pending invitations
- Can revoke unused invitations

#### Auto-Linking
- When invitation is accepted, user is automatically linked to the family member slot
- User inherits member's color, name (can edit later)
- Immediately gains access to all family events

---

## Notifications

### Notification Types
1. **Event Notifications**
   - Triggered by event alarms
   - Shows event details, attendees, location
   - Supports custom actions (Get Directions)
   - Rich content with checklist progress

2. **Morning Brief**
   - Daily summary of today's events
   - Scheduled at configurable time (default 8:00 AM)
   - Image attachment with event timeline
   - Grouped by family member
   - Optional weekday-only mode

3. **Checklist Reminders**
   - Due date notifications
   - 24-hour advance warnings
   - Auto-cancelled when completed

### Notification Permissions
- Requested on first use
- Auto-enables morning brief when granted
- Falls back gracefully if denied

### Notification Settings
- Enable/disable globally
- Morning brief on/off
- Morning brief time (hour/minute)
- Weekday-only option
- Notification sound selection
- Family member filtering
- Calendar filtering

### Notification Syncing
- **Auto-Sync**: On app active, calendar changes
- **Event Filtering**: Only shows events with alarms
- **Deduplication**: Prevents duplicate notifications for same occurrence
- **Calendar Monitoring**: Listens to Device Calendar changes via `expo-calendar` listeners (if available) or background fetch

---

## Checklists

### Checklist Structure
- **Checklist**: Container for checklist items, linked to event
- **ChecklistItem**: Individual task with title, due date, completion status

### Device-Independent Identifiers
- Uses stable hash of event title + start date (day only)
- Ensures checklist syncs across devices with different calendar IDs
- Backward compatible with old format (title + date + calendarID)

### Checklist Features
- Create/edit/delete items
- Mark items complete/incomplete
- Reorder items via drag-and-drop
- Due date tracking
- Notifications for due items
- Progress tracking (X/Y completed)
- Sync to Supabase

### Checklist Notifications
- Due date notification (exact time)
- 24-hour advance warning
- Auto-cancel when item completed
- Skips notifications if due date matches event date

### Sync Behavior
- Targeted sync on item changes (create, update, delete)
- Full sync on demand
- Soft delete support
- Cascade delete when parent checklist deleted

---

## Attachments

**Pro Feature Only**

### Storage Limits
- **Free**: 0 MB (feature disabled)
- **Pro**: 250 MB total quota

### Supported Operations
- Upload from device files
- Download to temp location
- Preview with QuickLook
- Share via system share sheet
- Delete with quota reclaim

### File Handling
- Files stored in Supabase S3 bucket
- Temp files created for preview/download (FileSystem.cacheDirectory)
- Document Picker for file selection
- Automatic quota tracking

### Attachment Properties
- ID (UUID)
- Event Identifier
- File Name
- File Size (bytes)
- Storage Path (S3 bucket key)
- Upload Date
- Uploader ID

### Storage Quota UI
- Progress bar with color coding:
  - Green: < 70%
  - Orange: 70-90%
  - Red: ≥ 90%
- Real-time usage display
- Warning when quota exceeded

---

## UI/UX Features

### Bottom Tab Bar (New in v9.1)
Three-mode switcher:
1. **Family View**: List of family members with upcoming events
2. **Month View**: Calendar grid view
3. **Day View**: Timeline view for single day

Navigation buttons:
- View Switcher (tap to cycle, long press for picker)
- Search
- Add Event
- Checklists
- Settings

### Theme System
- **Default Theme**: Light/Dark adaptive
- **Theme Properties**:
  - Accent color
  - Background colors
  - Text colors (primary, secondary)
  - Card styling
  - Floating controls appearance

### View Modes
- **Family View**: Shows members with their next events, and upcoming events for the family members with configurable number shown
- **Calendar Month View**: Grid-based month calendar, with full-screen mode or compact mode
- **Calendar Day View**: Timeline with hourly slots, with full-screen mode or compact mode
- **Daily Events View**: List view for single day, with full-screen mode or compact mode

### Calendar Display Modes
- **Month Mode**: Monthly grid with event indicators
- **Day Mode**: Timeline with time blocks
- **Expanded Month**: Full-screen calendar grid

### Interactive Features
- Pull-to-refresh on all data views
- Swipe actions on event rows
- Long-press menus
- Drag-to-reorder family members
- Pinch-to-zoom calendar (planned)

### Accessibility
- VoiceOver labels on all interactive elements
- Dynamic Type support
- High contrast mode compatibility
- Semantic colors throughout

---

## Pro Features & Subscriptions

### Feature Comparison

| Feature | Free | Pro |
|---------|------|-----|
| Family Members | 2 | Unlimited |
| Spotlight Events per Person | 5 | 15 |
| Shared Calendars | 1 | Unlimited |
| Storage | 0 MB | 250 MB |
| Attachments | ✗ | ✓ |
| Themes | Default only | Multiple themes |
| Widgets | ✗ | ✓ |
| Saved Places | ✗ | ✓ |
| Drivers | ✗ | ✓ |
| Remove Ads | ✗ | ✓ |

### Subscription Plans (Planned)
- **Monthly**: £2.99/month
- **Annual**: £14.99/year (Save 57%)
- **Free Trial**: 3 days

### Pro Enforcement
- Checked via `AppSettingsManager.isProUser`
- Currently enabled via Settings > Test Only (development)
- Future: In-app purchase integration
- Constraints enforced:
  - `maxFamilyMembersAllowed`
  - `maxSharedCalendarsAllowed`
  - `currentSpotlightLimit`
  - `attachmentStorageLimit`

### Ad System (Free Tier)
- Google Mobile Ads SDK integration
- Banner ads in specific views
- Removed for Pro users
- Ad placement configured per-view

---

## Widget System

### Widget Features (Pro Only)
- Shows next N upcoming events (configurable 1-5)
- Family member color coding
- Time and location display (toggleable)
- Attendees display (toggleable)
- Tap to open event in app
- Auto-refresh on timeline schedule

### Widget Configuration
Configured via `AppSettingsManager`:
- `widgetShowEventsCount`: Number of events (1-5)
- `widgetShowOwnCalendarsOnly`: Filter to linked member's calendar (deprecated)
- `widgetShowTime`: Show event start time
- `widgetShowLocation`: Show location
- `widgetShowAttendees`: Show family member names

### Widget Data Access
- Shares data via App Groups (requires Native Config Plugin)
- Reads settings from Shared UserDefaults
- Synced on every settings change
- Timeline reloads triggered via Native Module calls

### Widget Types
Currently: `NextEventWidget` (single widget)
Shows timeline of upcoming events across all family members

---

## Settings & Preferences

### General Settings
- **Auto Refresh Interval**: 1-60 minutes (default: 5 min)
- **Default Maps App**: Apple Maps, Google Maps, Waze
- **Default Home Screen**: Family, Month, or Day view
- **Events Window**: Past days (default 90), Future days (default 180)
- **Default Alert**: None, At time, 15 min, 1 hour, 1 day before

### Display Settings
- **Events Per Person**: 1-10 (default: 3)
- **Spotlight Events Per Person**: 5 (free) / 15 (pro)
- **Next Event Columns**: 1, 2, or 3 columns
- **Density Modes**: Detailed or compact variants
- **Expanded Month View**: On/off (default: off)
- **Calendar Cell Layout**: Dots, option1-4

### Notification Settings
- **Notifications Enabled**: On/off
- **Morning Brief Enabled**: On/off
- **Morning Brief Time**: Hour and minute
- **Morning Brief Weekdays Only**: On/off
- **Notification Sound**: Default, none, or custom
- **Notification History**: On/off (default: on)
- **Selected Members**: Filter notifications by member
- **Selected Calendars**: Filter notifications by calendar

### Widget Settings (Pro Only)
- **Show Events Count**: 1-5 events
- **Show Time**: On/off
- **Show Location**: On/off
- **Show Attendees**: On/off

### Account Settings
- **Linked Family Member**: Link account to specific member
- **Family Member Order**: Custom sort order
- **Family Name**: Display name for family
- **Family ID**: Supabase family UUID

### Settings Storage
- **Local**: UserDefaults + AppGroup for widgets
- **Cloud**: Supabase `user_settings` table (JSON)
- **Core Data**: Some view-specific settings
- **Sync**: Auto-sync to cloud every 1 second (debounced)

---

## Data Sync & Storage

**IMPORTANT**: Only the **calendar system**  has 1 version. All other features (invitations, checklists, attachments, notifications, settings) are part of the standard system and work the same regardless of calendar version.

### Data Flow
1. **Source of Truth**: Supabase PostgreSQL database
2. **Local Cache**: Local Database (WatermelonDB / SQLite) for offline access
3. **Shared Storage**: App Group UserDefaults for widget communication

### Local Models (Schema)
- `FamilyMember`: Family member profiles
- `FamilyEvent`: Family calendar events
- `DeviceCalendar`: External device calendar integrations
- `SavedAddress`: Saved locations (Pro)
- `Driver`: Driver assignments (Pro)
- `Checklist`: Event checklist containers
- `ChecklistItem`: Individual checklist tasks
- `SharedCalendar`: Shared family calendars
- `AppSettings`: View-specific settings cache

### Sync Strategy
- **Smart Sync**: Only fetches if data changed
- **Change Detection**: Tracks `modified_at` timestamps
- **Conflict Resolution**: Last-write-wins from server
- **Offline Support**: Reads from local database
- **Background Fetch**: expo-background-fetch for periodic updates
- **Manual Refresh**: Pull-to-refresh in views

### Supabase Tables

#### Core Family Tables (Standard)
- `families` - Top-level family organization (includes `calendar_system` field: 'eventkit' or 'supabase')
- `family_members` - Individual members within families
- `profiles` - Extended user profile data

#### Calendar Tables (Supabase Calendar - Default for New Families)
- `family_calendars` - Calendar containers with customizable colors (includes `color` field for "Everyone" events)
- `calendar_events` - All events in Supabase calendar system
- `event_attendees` - Links events to family members (attendee-based assignment)
- `shared_calendar_members` - Links shared calendars to members (future Phase 4)

#### Calendar Tables (EventKit - Legacy/Backward Compatibility Only)
- `family_member_calendars` - Links members to device EventKit calendars (v1 only, preserved for migration)
- `shared_calendars` - EventKit shared calendar tracking (deprecated, v1 only)

#### Content Tables (Standard - Work with Both Calendar Systems)
- `checklists` - Event checklist containers
- `checklist_items` - Individual checklist tasks
- `notes` - Family-wide notes
- `event_attachments` - File attachments for events (Pro feature)
- `saved_addresses` - Saved locations (Pro feature)
- `drivers` - Driver contacts (Pro feature)

#### User & Settings Tables (Standard)
- `user_settings` - User preferences (synced across devices)
- `invitations` - Email and shareable invitations (standard feature)
- `feedback` - User feedback submissions

---

## Critical Configurations

### DO NOT CHANGE

#### 1. Service Pattern
Core services should be accessible globally or via context:
```typescript
SupabaseAuthService
SupabaseDataService
AppSettingsService
CalendarService
NotificationService
ChecklistService
```

#### 2. Storage Keys
These keys are persisted in AsyncStorage/SecureStore and must remain stable:
- `"hasCompletedOnboarding"`
- `"hasCompletedFamilySetup"`
- `"com.famcal.familyId"`
- `"com.famcal.pro.enabled"`
- All settings keys in `AppSettingsService`

#### 3. Local Database Schema
Table/Collection names and relationships must remain stable:
- Model names (e.g., `FamilyMember`, `FamilyEvent`)
- Field names matching Supabase where possible

#### 4. Supabase Column Names
Database columns referenced in code must match schema:
- `family_members.id`, `family_members.name`, etc.
- `checklists.event_identifier`
- `attachments.storage_path`

#### 5. Event Identifier Stability
Checklist matching logic requires stable identifiers:
- Format: SHA256 hash of `title + date (YYYY-MM-DD UTC)`
- Old format supported for backward compat

#### 6. Pro Feature Checks
Always check `AppSettingsManager.shared.isProUser` before:
- Showing attachments UI
- Allowing > 2 family members
- Allowing > 1 shared calendar
- Enabling themes
- Enabling widgets
- Showing saved places/drivers

#### 7. Token Refresh Flow
NEVER modify the automatic token refresh in Supabase Client:
- Auto-retry on 401
- Refresh token usage
- Session preservation

#### 8. Notification Identifiers
Unique notification IDs prevent duplicates:
- Format: `{eventIdentifier}_{ISO8601StartDate}`
- Morning brief: `"morningBrief"`
- Checklist items: `{itemID}_due`, `{itemID}_24hrbefore`

---

## Migration & Versioning

### Breaking Changes to Avoid
1. Changing app group identifier
2. Renaming Core Data entities used in migrations
3. Modifying stable event identifier generation
4. Changing Supabase table/column names
5. Removing settings keys (mark deprecated instead)
6. Changing authentication flow (breaks existing sessions)

### Safe Changes
1. Adding new settings (with defaults)
2. Adding new Core Data attributes (optional)
3. Adding new Supabase columns (nullable)
4. Adding new managers/utilities
5. UI changes that don't affect data model
6. Adding new enum cases (with fallback)

---

## Testing Checklist

Before deploying changes, verify:

- [ ] Guest mode still works (local data only)
- [ ] Authenticated users can sync
- [ ] Family setup flow completes
- [ ] Calendar check validates correctly
- [ ] Events create/edit/delete properly
- [ ] Notifications schedule and fire
- [ ] Checklists sync across devices
- [ ] Attachments upload/download (Pro)
- [ ] Widgets display data correctly
- [ ] Pro enforcement works (2 members, 1 shared calendar for free)
- [ ] Settings persist across app restarts
- [ ] Token refresh handles 401 errors
- [ ] Logout clears session properly
- [ ] Onboarding shows for new users only

---

## Common Gotchas

### Calendar IDs Change Across Devices
- Calendar IDs from EventKit are device-specific
- Use calendar **names** for matching, not IDs
- Checklist event identifiers exclude calendar ID for this reason

### Widget Data Staleness
- Widgets may show stale data if timeline not refreshed
- Invoke Native Module to reload timelines after data changes
- Widget refreshes on background fetch schedule

### Database Context
- Ensure database writes are batched where possible (especially with WatermelonDB)
- Handle async operations correctly to avoid UI jank

### Async/Await
- Use standard JS `async/await`
- Use React Query / TanStack Query for data fetching and caching state

### Pro Feature Enforcement
- Check `isProUser` in BOTH UI and data layers
- Enforce limits on save, not just on display
- Show upgrade prompts before blocking action

### Session Validation
- Validate session on app launch (not every resume)
- Only refresh token when needed (401 response)
- Don't clear session on failed refresh (offline case)

---

## Development Notes

### When Adding New Features
1. Check if it should be Pro-only
2. Add setting to `AppSettingsManager` if configurable
3. Sync setting to Supabase if needed across devices
4. Update widget if feature affects displayed data
5. Add to this FEATURES.md document

### When Modifying Existing Features
1. Check this document for constraints
2. Ensure backward compatibility
3. Test with existing user data
4. Update migration path if needed
5. Update this document

### When Fixing Bugs
1. Verify fix doesn't break related features
2. Check cascade effects on sync/storage
3. Test in both authenticated and guest modes
4. Test with free and Pro tiers
5. Verify widget still works

---

**END OF FEATURES.md**
