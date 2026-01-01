# FamCal User Flows & Screen Specifications
### Complete View Hierarchy and User Journeys

**Part of**: FamCal Rebuild Guide
**Date:** December 24, 2024

---

## Table of Contents

1. [Application Entry Points](#application-entry-points)
2. [Onboarding & Setup Flows](#onboarding--setup-flows)
3. [Authentication Flows](#authentication-flows)
4. [Main Application Views](#main-application-views)
5. [Event Management Flows](#event-management-flows)
6. [Family Management Flows](#family-management-flows)
7. [Settings & Configuration](#settings--configuration)
8. [Invitation Flows](#invitation-flows)
9. [Navigation Patterns](#navigation-patterns)
10. [Error States & Edge Cases](#error-states--edge-cases)

---

## Application Entry Points

### App Launch Sequence

```
App Launch
    ↓
Check Authentication State
    ↓
┌────────────────┬─────────────────┐
│                │                 │
Authenticated   Guest Mode    Not Authenticated
│                │                 │
↓                ↓                 ↓
Check Family    Use Local      Onboarding
Setup Status    Data Only      Screen
│                │                 │
↓                ↓                 ↓
┌──────┬──────┐  Main App        Login/Signup
│      │      │    (Limited)         │
Setup  Main   │                      ↓
Not    App    │              Create Account
Done   Ready  │                      │
│      │      │                      ↓
↓      ↓      ↓              Family Setup Flow
Family Main  Calendar               │
Setup  Tab   Check                  ↓
Flow   View  Gate                Main App
```

### Initial View Decision Tree

**Pseudocode:**
```javascript
function determineInitialView() {
  // 1. Check authentication
  if (!isAuthenticated && !isGuestMode) {
    return 'OnboardingScreen'
  }

  // 2. Check family setup (authenticated users)
  if (isAuthenticated && !hasCompletedFamilySetup) {
    return 'FamilySetupFlow'
  }

  // 3. Check calendar permissions (Expo Calendar compatibility)
  if (needsCalendarCheck && !allMembersHaveCalendars) {
    return 'CalendarCheckGate'
  }

  // 4. Load main app with default home screen
  const defaultScreen = settings.defaultHomeScreenRawValue // 'family', 'calendarMonth', 'calendarDay'
  return 'MainTabView(' + defaultScreen + ')'
}
```

---

## Onboarding & Setup Flows

### 1. Onboarding Screen (First Launch)

**Purpose**: Welcome new users and guide them to sign up or continue as guest

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│         [App Logo/Icon]             │
│                                     │
│           FamCal                    │
│     Family Calendar Made Easy       │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Sign Up with Google        │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Sign Up with Email         │   │
│   └─────────────────────────────┘   │
│                                     │
│   Already have an account?          │
│         [Log In]                    │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Continue as Guest          │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**User Actions:**
**User Actions:**
1. **Sign Up with Google**: OAuth flow → Family Setup
2. **Sign Up with Email**: Email signup form → Email confirmation → Family Setup
3. **Log In**: Login screen → Check family setup status
4. **Continue as Guest**: Enter app with local-only data (limited features)

**State Management:**
- `hasSeenOnboarding`: AsyncStorage/SecureStore flag (set to true after first view)
- Only show on first launch or after logout

---

### 2. Family Setup Flow (5-Step Wizard)

**Purpose**: Guide new users through creating their family calendar

**Step 1: Family Name**

```
┌─────────────────────────────────────┐
│  Step 1 of 4: Name Your Family      │
│                                     │
│  What's your family name?           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Smith Family              │   │
│  └─────────────────────────────┘   │
│                                     │
│  This will be used to identify      │
│  your family calendar.              │
│                                     │
│              [Next →]               │
└─────────────────────────────────────┘
```

**Validation:**
- Family name required (minimum 1 character)
- Default placeholder: "My Family"

**Data Captured:**
- `familyName`: String

---

**Step 2: Add Family Members**

```
┌─────────────────────────────────────┐
│  Step 2 of 4: Add Family Members    │
│                                     │
│  Who's in your family?              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔵 John Smith        [Edit] │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🔴 Jane Smith        [Edit] │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🟢 Emma Smith        [Edit] │   │
│  └─────────────────────────────┘   │
│                                     │
│        [+ Add Member]               │
│                                     │
│  Free: Up to 2 members              │
│  Pro: Unlimited members             │
│                                     │
│  [← Back]          [Next →]         │
└─────────────────────────────────────┘
```

**Add/Edit Member Dialog:**
```
┌─────────────────────────────────────┐
│  Add Family Member                  │
│                                     │
│  Name                               │
│  ┌─────────────────────────────┐   │
│  │ John                        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Color                              │
│  🔵 🔴 🟢 🟡 🟣 🟠 ⚪ ⚫              │
│                                     │
│  [Cancel]            [Save]         │
└─────────────────────────────────────┘
```

**Validation:**
- Minimum 1 member required
- Maximum 2 for free tier, unlimited for Pro
- Each member needs: name, color
- Auto-generate initials from name (e.g., "John Smith" → "JS")

**Data Captured:**
- `familyMembers`: Array of `{id, name, color, avatarInitials}`

---

**Step 3: Shared Calendars**

**Note**: In Supabase calendar approach, this step is replaced with:

```
┌─────────────────────────────────────┐
│  Step 3 of 4: Family Calendar Setup │
│                                     │
│  We'll create a Family Calendar for │
│  you in Supabase.                   │
│                                     │
│  [Illustration: Calendar with       │
│   family member icons]              │
│                                     │
│  ✓ Events for everyone              │
│  ✓ Events for specific members      │
│  ✓ Syncs across all devices         │
│                                     │
│  Your family calendar will be ready │
│  in seconds!                        │
│                                     │
│  [← Back]          [Next →]         │
└─────────────────────────────────────┘
```

**Backend Action:**
- Database trigger auto-creates `family_calendars` record with:
  - `calendar_type = 'family'`
  - `is_default = true`
  - `name = familyName + ' Calendar'`
  - `color = '#FF6B6B'` (coral red)

---

**Step 4: Select Your Member**

```
┌─────────────────────────────────────┐
│  Step 4 of 4: Which one are you?    │
│                                     │
│  Link your account to a member:     │
│                                     │
│  ○ 🔵 John Smith                    │
│  ● 🔴 Jane Smith                    │
│  ○ 🟢 Emma Smith                    │
│                                     │
│  This links your user account to    │
│  this family member.                │
│                                     │
│  [← Back]          [Complete]       │
└─────────────────────────────────────┘
```

**Validation:**
- Must select exactly one member
- Selected member will have `linked_user_id` set to authenticated user's ID

**Data Captured:**
- `selectedMemberId`: UUID

---

**Step 5: Setup Complete**

```
┌─────────────────────────────────────┐
│  [Checkmark Animation]              │
│                                     │
│  All Set!                           │
│                                     │
│  Your Smith Family calendar is      │
│  ready with 3 members.              │
│                                     │
│  [Illustration: Family members      │
│   around calendar]                  │
│                                     │
│  Tap below to start adding events!  │
│                                     │
│        [Get Started]                │
└─────────────────────────────────────┘
```

**Actions on Complete:**
1. Create family in Supabase (`POST /rest/v1/families`)
2. Create family members (`POST /rest/v1/family_members` for each)
3. Family calendar auto-created by database trigger
4. Link selected member to user (`UPDATE family_members SET linked_user_id`)
5. Update user profile (`UPDATE profiles SET family_id`)
6. Save settings locally (AsyncStorage):
   - `familyId`
   - `familyName`
   - `hasCompletedFamilySetup = true`
   - `linkedFamilyMemberId`
7. Navigate to Main App

---

## Authentication Flows

### Sign Up with Email

```
Sign Up Screen
    ↓
Enter Email + Password
    ↓
[Sign Up Button]
    ↓
Supabase: auth.signUp()
    ↓
Email Confirmation Required
    ↓
[Check Email Screen]
    ↓
User Clicks Confirm Link
    ↓
Redirect to App
    ↓
Family Setup Flow
```

**Sign Up Screen:**
```
┌─────────────────────────────────────┐
│  Create Your Account                │
│                                     │
│  Email                              │
│  ┌─────────────────────────────┐   │
│  │ you@example.com             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Password                           │
│  ┌─────────────────────────────┐   │
│  │ •••••••••••                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  Password must be 8+ characters     │
│                                     │
│  [Sign Up]                          │
│                                     │
│  Already have an account? [Log In]  │
└─────────────────────────────────────┘
```

**Email Confirmation Screen:**
```
┌─────────────────────────────────────┐
│  Check Your Email                   │
│                                     │
│  [Email Icon]                       │
│                                     │
│  We sent a confirmation link to:    │
│  you@example.com                    │
│                                     │
│  Click the link in your email to    │
│  verify your account.               │
│                                     │
│  Didn't receive it?                 │
│  [Resend Email]                     │
│                                     │
│  [Back to Login]                    │
└─────────────────────────────────────┘
```

---

### Sign Up with Google (OAuth)

```
[Sign Up with Google Button]
    ↓
Google OAuth Screen (Browser)
    ↓
Select Google Account
    ↓
Grant Permissions
    ↓
Redirect to App with ID Token
    ↓
Exchange ID Token with Supabase
    ↓
Authenticated
    ↓
Family Setup Flow (if new user)
```

**Implementation:**
- Use Google Sign-In SDK (iOS/Android) or Web OAuth
- Exchange Google ID token for Supabase session
- Check if user has family: if not, start Family Setup

---

### Login Flow

```
Login Screen
    ↓
Enter Email + Password
    ↓
[Log In Button]
    ↓
Supabase: auth.signInWithPassword()
    ↓
┌─────────────┬──────────────┐
│             │              │
Success      Error
│             │
↓             ↓
Check        Show Error
Family       Message
Setup
│
↓
┌────────┬──────────┐
│        │          │
Setup    Main App
Done     (No Setup)
│        │
↓        ↓
Family   Main Tab
Setup    View
```

**Login Screen:**
```
┌─────────────────────────────────────┐
│  Welcome Back                       │
│                                     │
│  Email                              │
│  ┌─────────────────────────────┐   │
│  │ you@example.com             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Password                           │
│  ┌─────────────────────────────┐   │
│  │ •••••••••••                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Forgot Password?]                 │
│                                     │
│  [Log In]                           │
│                                     │
│  Don't have an account? [Sign Up]   │
└─────────────────────────────────────┘
```

---

### Password Reset Flow

```
Forgot Password Link
    ↓
Enter Email
    ↓
[Send Reset Link]
    ↓
Supabase: auth.resetPasswordForEmail()
    ↓
[Check Email Screen]
    ↓
User Clicks Reset Link
    ↓
[New Password Screen]
    ↓
Enter New Password
    ↓
[Reset Password]
    ↓
Password Updated
    ↓
Login Screen
```

---

### Guest Mode

**What is Guest Mode?**
- Local-only data storage (no cloud sync) via WatermelonDB/SQLite
- Cannot access Pro features
- Cannot invite others
- Data persists on device
- Can upgrade to authenticated account later

**Guest Mode Limitations:**
- No cross-device sync
- No shareable invitations
- No attachment storage (Pro feature)
- No widget support (requires sync)
- Settings stay local (AsyncStorage)

**Upgrade from Guest:**
```
[Create Account Button in Settings]
    ↓
Sign Up Flow
    ↓
Authenticated
    ↓
Prompt: "Sync local data to cloud?"
    ↓
[Yes] → Migrate local family to Supabase
[No] → Keep separate (lose local data)
```

---

## Main Application Views

### Main Tab View (Bottom Navigation)

**Three Primary Views** (accessible via bottom bar):

1. **Family View** (person.3.fill icon)
2. **Month View** (calendar icon)
3. **Day View** (calendar.day.timeline.left icon)

**Additional Actions** (bottom bar buttons):
- **Search** (magnifyingglass): Search all events
- **Add Event** (plus.circle.fill): Create new event
- **Checklists** (checkmark.circle.fill): View all checklists
- **Settings** (gearshape.fill): App settings

**View Switcher Behavior:**
- **Tap**: Cycle through Family → Month → Day
- **Long Press**: Show view picker popup

```
┌──────────────────────────────────────────┐
│  [Main Content Area]                     │
│  (Family/Month/Day View)                 │
│                                          │
│                                          │
│                                          │
│                                          │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ [Family] [Search] [+] [Lists] [Settings] │
│   ▲▼                                     │
└──────────────────────────────────────────┘
```

**View Picker Popup** (on long press):
```
┌──────────────────────────────┐
│  [Family]  [Month]  [Day]    │
│    Icon      Icon    Icon    │
│   Active    Normal  Normal   │
└──────────────────────────────┘
```

---

### 1. Family View

**Purpose**: See all family members and their upcoming events

**Layout:**
```
┌─────────────────────────────────────┐ 
│ Next Events                         │
│  |-------|   |-------|              │
|  |  MEM1 |   |  MEM2 |              │
|  |       |   |       │
|  |       |   |       |             │
|  |-------|   |-------|             │
|                                     │
|                                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔵 John Smith               │   │
│  │   9:00 AM  Team Meeting     │   │
│  │   2:00 PM  Dentist Appt     │   │
│  │   5:30 PM  Soccer Practice  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔴 Jane Smith               │   │
│  │   10:00 AM Client Call      │   │
│  │   3:00 PM  Pick up kids     │   │
│  │   No more events today      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🟢 Emma Smith               │   │
│  │   8:00 AM  School           │   │
│  │   3:30 PM  Dance Class      │   │
│  │   5:30 PM  Soccer Practice  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Pull to Refresh]                  │
└─────────────────────────────────────┘
```

**Features:**
1. **Member Cards**:
   - Member color indicator
   - Member name
   - Next N events (configured: `eventsPerPerson` setting, default 3)
   - Tap member → View member's full calendar

2. **Event Cards within Member**:
   - Time (if not all-day)
   - Event title
   - Location icon (if has location)
   - Tap event → Event Detail View

3. **Color Coding**:
   - **Coral Red (#FF6B6B)**: "Everyone" events (all family members attending)
   - **Member Color**: Events for specific member(s)

4. **Reordering**:
   - Long press + drag to reorder family members (DraggableFlatList)
   - Order saved to `familyMemberOrder` setting

5. **Pull-to-Refresh**: Reload events from calendar (RefreshControl)

---

### 2. Month View (Calendar Grid)

**Purpose**: Month-at-a-glance calendar with event indicators

**Layout:**
```
┌─────────────────────────────────────┐
│  December 2024        [Today]       │
│  [< Prev]                  [Next >] │
│                                     │
│  Sun Mon Tue Wed Thu Fri Sat        │
│   1   2   3   4   5   6   7         │
│  ●●  ●   ●●●  ●   ●●  ●   -         │
│                                     │
│   8   9  10  11  12  13  14         │
│   ●   ●●  ●   ●●  ●   ●●  -         │
│                                     │
│  15  16  17  18  19  20  21         │
│   ●   ●   ●●  ●   ●●  ●●  -         │
│                                     │
│  22  23 [24] 25  26  27  28         │
│   ●   ●● ●●●  ●   ●   ●●  -         │
│                                     │
│  29  30  31                         │
│   ●   ●   ●                         │
│                                     │
│  ─────────────────────────────────  │
│  Today's Events:                    │
│  9:00 AM  Team Meeting              │
│  2:00 PM  Dentist                   │
│  5:30 PM  Soccer Practice           │
└─────────────────────────────────────┘
```

**Features:**
1. **Calendar Grid**:
   - Current month displayed
   - Selected date highlighted
   - Today marked with border
   - Dots indicate events on each day
   - Tap date → Select date, update bottom panel

2. **Event Indicators**:
   - **Dot Mode** (default): Colored dots for events
   - **Compact Modes**: Mini event previews in cells (options 1-4)
   - Dot colors match event colors (coral for everyone, member color for specific)

3. **Bottom Panel**:
   - Shows events for selected date
   - Scrollable event list
   - Tap event → Event Detail

4. **Navigation**:
   - Swipe left/right: Previous/next month
   - [< Prev] / [Next >] buttons
   - [Today] button: Jump to current month + today

5. **Density Settings**:
   - `calendarEventsDensityMode`: "detailed" or compact options
   - `calendarCellLayoutMode`: "dots", "option1", "option2", "option3", "option4"

---

### 3. Day View (Timeline)

**Purpose**: Hourly timeline view of a single day

**Layout:**
```
┌─────────────────────────────────────┐
│  Tuesday, December 24, 2024         │
│  [< Yesterday]        [Tomorrow >]  │
│  [Today]                            │
│                                     │
│  12 AM ┌───────────────────────┐   │
│   1 AM │                       │   │
│   2 AM │                       │   │
│   3 AM │                       │   │
│   4 AM │                       │   │
│   5 AM │                       │   │
│   6 AM │                       │   │
│   7 AM │                       │   │
│   8 AM │ ┌───────────────────┐ │   │
│        │ │ School (Emma)     │ │   │
│   9 AM │ │ 8:00 AM - 3:00 PM │ │   │
│        │ │                   │ │   │
│  10 AM │ ├───────────────────┤ │   │
│        │ │ Team Meeting      │ │   │
│  11 AM │ │ 9:00 AM - 10:00 AM│ │   │
│        │ └───────────────────┘ │   │
│  12 PM │                       │   │
│   1 PM │                       │   │
│   2 PM │ ┌───────────────────┐ │   │
│        │ │ Dentist           │ │   │
│   3 PM │ │ 2:00 PM - 3:00 PM │ │   │
│        │ └───────────────────┘ │   │
│   4 PM │                       │   │
│   5 PM │ ┌───────────────────┐ │   │
│        │ │ Soccer Practice   │ │   │
│   6 PM │ │ 5:30 PM - 7:00 PM │ │   │
│        │ └───────────────────┘ │   │
│   7 PM │                       │   │
│   8 PM │                       │   │
│   9 PM │                       │   │
│  10 PM │                       │   │
│  11 PM └───────────────────────┘   │
└─────────────────────────────────────┘
```

**Features:**
1. **Timeline**:
   - 24-hour scrollable timeline
   - Events displayed as blocks at their times
   - Current time indicator (red line)
   - Scroll to current time on load

2. **Event Blocks**:
   - Height proportional to duration
   - Background color = event color (coral or member color)
   - Title + time displayed
   - Attendees shown (if `widgetShowAttendees` setting enabled)
   - Tap event → Event Detail

3. **All-Day Events**:
   - Displayed in header bar above timeline
   - Full-width horizontal bar

4. **Navigation**:
   - Swipe left/right: Previous/next day
   - [< Yesterday] / [Tomorrow >] buttons
   - [Today] button: Jump to today

5. **Tap Empty Space**:
   - Tap timeline between events → "Add Event" at that time

---

## Event Management Flows

### Creating an Event

```
[+ Add Event Button]
    ↓
Add Event View
    ↓
Fill Event Details
    ↓
Select Attendees (Everyone or Specific Members)
    ↓
[Save Button]
    ↓
Create Event in Supabase
    ↓
Create Attendee Records
    ↓
Refresh Calendar
    ↓
Return to Previous View
```

**Add Event Screen:**
```
┌─────────────────────────────────────┐
│  New Event                 [Cancel] │
│                                     │
│  Title *                            │
│  ┌─────────────────────────────┐   │
│  │ Team Meeting                │   │
│  └─────────────────────────────┘   │
│                                     │
│  Attendees * (Who's going?)         │
│  ○ Everyone                         │
│  ● Select Members                   │
│    ☑ 🔵 John                        │
│    ☑ 🔴 Jane                        │
│    ☐ 🟢 Emma                        │
│                                     │
│  All-Day Event          [Toggle]    │
│                                     │
│  Starts                             │
│  Tue, Dec 24, 2024  9:00 AM         │
│                                     │
│  Ends                               │
│  Tue, Dec 24, 2024  10:00 AM        │
│                                     │
│  Location                           │
│  ┌─────────────────────────────┐   │
│  │ [Search Locations...]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  Meeting Link                       │
│  ┌─────────────────────────────┐   │
│  │ https://zoom.us/j/12345     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Notes                              │
│  ┌─────────────────────────────┐   │
│  │ Quarterly planning meeting  │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Repeat           [Never ▼]         │
│  Alert            [15 min before ▼] │
│  Travel Time      [None ▼]          │
│                                     │
│  Checklist        [+ Add Items]     │
│  Attachments      [+ Add Files]     │
│  (Pro)                              │
│                                     │
│              [Save Event]           │
└─────────────────────────────────────┘
```

**Required Fields:**
- Title
- Attendees (either "Everyone" or at least one member selected)
- Start Date/Time
- End Date/Time (auto-set to 1 hour after start)

**Optional Fields:**
- Location (with location search/autocomplete)
- Meeting Link (auto-detect Zoom, Teams, Meet links)
- Notes
- Recurrence (None, Daily, Weekly, Monthly, Yearly, Custom)
- Alert (None, At time, 15 min, 1 hour, 1 day before)
- Travel Time (minutes before event)
- Checklist items
- Attachments (Pro only)

**Attendee Selection Logic:**
1. **"Everyone" selected**:
   - Create `event_attendees` records for ALL family members
   - Event displays in coral red (#FF6B6B)

2. **"Select Members" selected**:
   - Create `event_attendees` records for checked members only
   - Event displays in first selected member's color

**Save Process:**
```sql
-- 1. Create event
INSERT INTO calendar_events (
  family_id, title, start_date, end_date, location, notes,
  meeting_link, is_all_day, recurrence_rule, alert_minutes,
  travel_time_minutes, created_by
) VALUES (...);

-- 2. Create attendees
INSERT INTO event_attendees (event_id, member_id, calendar_id, status)
VALUES
  (new_event_id, member1_id, family_calendar_id, 'accepted'),
  (new_event_id, member2_id, family_calendar_id, 'accepted'),
  ...;

-- 3. (Optional) Create checklist if items added
INSERT INTO checklists (event_identifier, event_title) VALUES (...);
INSERT INTO checklist_items (checklist_id, title, ...) VALUES (...);
```

---

### Editing an Event

**Entry Points:**
1. Tap event in any view → Event Detail → [Edit] button
2. Long press event → Quick Actions → Edit

**Edit Event Screen:**
- Same layout as Add Event
- Pre-filled with existing event data
- Attendee changes: Add/remove attendees → Update `event_attendees` table
- [Save] button updates event via `UPDATE calendar_events`

**Edit Options for Recurring Events:**
```
┌─────────────────────────────────────┐
│  Edit Recurring Event               │
│                                     │
│  This is a recurring event.         │
│  What would you like to edit?       │
│                                     │
│  ○ This Event Only                  │
│    Changes apply to Dec 24          │
│                                     │
│  ● All Future Events                │
│    Changes apply to Dec 24 onwards  │
│                                     │
│  [Cancel]            [Continue]     │
└─────────────────────────────────────┘
```

---

### Deleting an Event

**Entry Points:**
1. Event Detail → [Delete] button
2. Long press event → Quick Actions → Delete
3. Swipe event row → Delete action

**Delete Confirmation:**
```
┌─────────────────────────────────────┐
│  Delete Event                       │
│                                     │
│  Are you sure you want to delete:   │
│  "Team Meeting"?                    │
│                                     │
│  This action cannot be undone.      │
│                                     │
│  [Cancel]            [Delete]       │
└─────────────────────────────────────┘
```

**Delete Process:**
```sql
-- Soft delete (set is_deleted flag)
UPDATE calendar_events
SET is_deleted = true
WHERE id = event_id;

-- Also soft delete associated checklist
UPDATE checklists
SET deleted_at = now(),
    deletion_reason = 'event_deleted'
WHERE event_identifier = event_hash;
```

**Recurring Event Deletion:**
```
┌─────────────────────────────────────┐
│  Delete Recurring Event             │
│                                     │
│  This is a recurring event.         │
│  What would you like to delete?     │
│                                     │
│  ○ This Event Only                  │
│    Deletes Dec 24 occurrence        │
│                                     │
│  ● All Future Events                │
│    Deletes Dec 24 onwards           │
│                                     │
│  [Cancel]            [Delete]       │
└─────────────────────────────────────┘
```

---

### Event Detail View

**Purpose**: Show full event details with all information and actions

**Layout:**
```
┌─────────────────────────────────────┐
│  [< Back]   Team Meeting   [Edit]  │
│                                     │
│  ─────────────────────────────────  │
│  📅  Tuesday, December 24           │
│       9:00 AM - 10:00 AM            │
│                                     │
│  👥  Attendees                      │
│      🔵 John Smith                  │
│      🔴 Jane Smith                  │
│                                     │
│  📍  Location                       │
│      123 Main St, Anytown           │
│      [Get Directions →]             │
│                                     │
│  🔗  Meeting Link                   │
│      zoom.us/j/123456789            │
│      [Join Meeting →]               │
│                                     │
│  📝  Notes                          │
│      Quarterly planning meeting     │
│      to discuss Q1 goals.           │
│                                     │
│  🔔  Alert                          │
│      15 minutes before              │
│                                     │
│  🔁  Repeat                         │
│      Weekly on Tuesday              │
│      [View Next 5 Occurrences →]    │
│                                     │
│  ✅  Checklist  (2/5 complete)      │
│      ☑ Review Q4 results            │
│      ☑ Prepare agenda               │
│      ☐ Send pre-read materials      │
│      ☐ Book conference room         │
│      ☐ Order catering               │
│      [+ Add Item]                   │
│                                     │
│  📎  Attachments (Pro)              │
│      📄 Agenda.pdf                  │
│      📄 Q4_Report.pdf               │
│      [+ Add File]                   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Created by John on Dec 20, 2024    │
│  Last edited Dec 23, 2024           │
│                                     │
│  [Delete Event]                     │
└─────────────────────────────────────┘
```

**Interactive Elements:**
1. **[Edit] Button**: Open Edit Event screen
2. **Get Directions**: Open maps app with location
3. **Join Meeting**: Open meeting link in browser/app
4. **Checklist Items**: Tap to toggle complete/incomplete
5. **[+ Add Item]**: Add new checklist item
6. **Attachment Tap**: Preview file with QuickLook
7. **[+ Add File]**: Upload attachment (Pro only)
8. **[Delete Event]**: Delete confirmation dialog

**Next Occurrences (for recurring events):**
```
┌─────────────────────────────────────┐
│  Next Occurrences                   │
│                                     │
│  ● Tue, Dec 24, 2024  9:00 AM       │
│  ● Tue, Dec 31, 2024  9:00 AM       │
│  ● Tue, Jan 7, 2025   9:00 AM       │
│  ● Tue, Jan 14, 2025  9:00 AM       │
│  ● Tue, Jan 21, 2025  9:00 AM       │
│                                     │
│  [Close]                            │
└─────────────────────────────────────┘
```

---


---

## Family Management Flows

### Managing Family Members

**Entry**: Settings → Family Settings → Members

**Member List Screen:**
```
┌─────────────────────────────────────┐
│  [< Back] Family Members            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔵 John Smith      [Linked] │   │
│  │ you@email.com               │   │
│  │ [Edit]                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔴 Jane Smith      [Invite] │   │
│  │ Not linked yet              │   │
│  │ [Share Invitation]          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🟢 Emma Smith      [Linked] │   │
│  │ emma@email.com              │   │
│  │ [Edit]                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [+ Add Family Member]              │
│  (Free: 2/2 members)                │
│  [Upgrade to Pro for unlimited]     │
└─────────────────────────────────────┘
```

**Edit Member Sheet:**
```
┌─────────────────────────────────────┐
│  Edit Family Member        [Done]   │
│  [Grabber]                          │
│                                     │
│  Name                               │
│  ┌─────────────────────────────┐   │
│  │ John Smith                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Color                              │
│  🔵 🔴 🟢 🟡 🟣 🟠 ⚪ ⚫              │
│  [●]                                │
│                                     │
│  Schedule (Optional)                │
│  [Toggle: Use Custom Schedule]      │
│                                     │
│  Wake Time        Bed Time          │
│  7:00 AM          10:00 PM          │
│                                     │
│  [Delete Member]                    │
└─────────────────────────────────────┘
```

### Adding New Family Member

```
[+ Add Family Member]
    ↓
Add Member Sheet
    ↓
Enter Name + Select Color
    ↓
[Save]
    ↓
Create in Supabase
    ↓
Auto-Add to "Everyone" Events (Backend)
    ↓
Refresh Family List
    ↓
Show "Invite [Name]" Button
```

**Auto-Add Logic** (runs automatically on member creation):
```javascript
// After member is created
await addMemberToEveryoneEvents(newMember.id, familyId)

async function addMemberToEveryoneEvents(memberId, familyId) {
  // Get all current members (including new one)
  const { data: allMembers } = await supabase
    .from('family_members')
    .select('id')
    .eq('family_id', familyId)

  // Get all events
  const { data: events } = await supabase
    .from('calendar_events')
    .select('id, event_attendees(member_id)')
    .eq('family_id', familyId)
    .eq('is_deleted', false)

  // Find "Everyone" events (attendee count = old member count)
  const oldMemberCount = allMembers.length - 1
  const everyoneEvents = events.filter(e => 
    e.event_attendees.length === oldMemberCount
  )

  // Add new member to those events
  for (const event of everyoneEvents) {
    await supabase
      .from('event_attendees')
      .insert({
        event_id: event.id,
        member_id: memberId,
        calendar_id: familyCalendarId,
        status: 'accepted'
      })
  }
}
```

---

## Settings & Configuration

### Settings Navigation

```
Main App
    ↓
[Settings Button] (Bottom bar)
    ↓
Settings Home
```

**Settings Home Screen:**
```
┌─────────────────────────────────────┐
│  [✕] Settings                       │
│                                     │
│  👤 Account                         │
│     John Smith                      │
│     you@example.com                 │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  👥 Family Settings               > │
│     Smith Family, 3 members         │
│                                     │
│  📅 Calendar & Display            > │
│     Customize views                 │
│                                     │
│  🔔 Notifications                 > │
│     Morning briefs, reminders       │
│                                     │
│  📱 Widgets                       > │
│     Configure home screen widget    │
│     (Pro)                           │
│                                     │
│  🎨 Themes                        > │
│     FamCal Classic                  │
│     (Pro)                           │
│                                     │
│  💳 Subscription                  > │
│     Free Plan • [Upgrade to Pro]    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Help & Support                   > │
│  Send Feedback                    > │
│  Privacy Policy                   > │
│  Terms of Service                 > │
│                                     │
│  Delete Account                   > │
│                                     │
│  Version 2.0.0 (Build 123)          │
└─────────────────────────────────────┘
```

### Family Settings

```
┌─────────────────────────────────────┐
│  [< Back] Family Settings           │
│                                     │
│  Family Name                        │
│  ┌─────────────────────────────┐   │
│  │ Smith Family                │   │
│  └─────────────────────────────┘   │
│                                     │
│  Family Members                   > │
│  3 members (Free: 2/2, +1 Pro)      │
│                                     │
│  Calendar System                    │
│  Supabase Calendar (V2)             │
│                                     │
│  Family ID                          │
│  abc123... [Copy]                   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Saved Places (Pro)               > │
│  5 saved addresses                  │
│                                     │
│  Drivers (Pro)                    > │
│  3 saved drivers                    │
│                                     │
│  Attachments (Pro)                > │
│  125 MB / 250 MB used               │
│  [Progress bar: ████████░░ 50%]     │
└─────────────────────────────────────┘
```

### Calendar & Display Settings

```
┌─────────────────────────────────────┐
│  [< Back] Calendar & Display        │
│                                     │
│  GENERAL                            │
│                                     │
│  Default Home Screen                │
│  Family View                      > │
│                                     │
│  Auto Refresh Interval              │
│  Every 5 minutes                  > │
│                                     │
│  Events Window                      │
│  90 days past, 180 days future    > │
│                                     │
│  Default Alert                      │
│  15 minutes before                > │
│                                     │
│  Default Maps App                   │
│  Apple Maps                       > │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  FAMILY VIEW                        │
│                                     │
│  Events Per Person                  │
│  3 events                         > │
│                                     │
│  Spotlight Events Per Person        │
│  5 events (Pro: up to 15)         > │
│                                     │
│  Next Event Columns                 │
│  2 columns                        > │
│                                     │
│  Density Mode                       │
│  Detailed                         > │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  CALENDAR VIEW                      │
│                                     │
│  Calendar Cell Layout               │
│  Dots                             > │
│                                     │
│  Events Density                     │
│  Detailed                         > │
│                                     │
│  Expanded Month View                │
│  [Toggle: OFF]                      │
└─────────────────────────────────────┘
```

### Notification Settings

```
┌─────────────────────────────────────┐
│  [< Back] Notifications             │
│                                     │
│  Notifications Enabled              │
│  [Toggle: ON]                       │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  MORNING BRIEF                      │
│                                     │
│  Morning Brief Enabled              │
│  [Toggle: ON]                       │
│                                     │
│  Brief Time                         │
│  8:00 AM                          > │
│                                     │
│  Weekdays Only                      │
│  [Toggle: OFF]                      │
│                                     │
│  Selected Members                   │
│  All members                      > │
│                                     │
│  Notification Sound                 │
│  Default                          > │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  EVENT REMINDERS                    │
│                                     │
│  All events with alerts will send   │
│  notifications at the specified     │
│  time before the event.             │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  HISTORY                            │
│                                     │
│  Keep Notification History          │
│  [Toggle: ON]                       │
└─────────────────────────────────────┘
```

---

## Error States & Edge Cases

### No Internet Connection

```
┌─────────────────────────────────────┐
│  [Offline Icon]                     │
│                                     │
│  No Internet Connection             │
│                                     │
│  Some features are unavailable      │
│  while offline. Your data will      │
│  sync when you're back online.      │
│                                     │
│  [OK]                               │
└─────────────────────────────────────┘
```

**Offline Behavior:**
- Display cached events from local database (WatermelonDB)
- Gray out sync-dependent features
- Show "Offline" badge in UI
- Queue changes for sync when online (Sync Queue)

### Empty States

**No Events:**
```
┌─────────────────────────────────────┐
│                                     │
│  [Calendar Icon Illustration]       │
│                                     │
│  No Events Yet                      │
│                                     │
│  Tap the + button to create your    │
│  first family event.                │
│                                     │
│  [Create Event]                     │
│                                     │
└─────────────────────────────────────┘
```

**No Family Members:**
```
┌─────────────────────────────────────┐
│                                     │
│  [People Icon Illustration]         │
│                                     │
│  No Family Members Yet              │
│                                     │
│  Add family members to start        │
│  coordinating schedules.            │
│                                     │
│  [+ Add Member]                     │
│                                     │
└─────────────────────────────────────┘
```

**No Checklists:**
```
┌─────────────────────────────────────┐
│                                     │
│  [Checklist Icon Illustration]      │
│                                     │
│  No Checklists                      │
│                                     │
│  Create checklists for your events  │
│  to stay organized.                 │
│                                     │
│  Add a checklist from any event     │
│  detail screen.                     │
│                                     │
└─────────────────────────────────────┘
```

### Error Messages

**API Errors:**
```
┌─────────────────────────────────────┐
│  Error                              │
│                                     │
│  Failed to load events.             │
│  Please try again.                  │
│                                     │
│  [Retry]            [Cancel]        │
└─────────────────────────────────────┘
```

**Validation Errors:**
```
┌─────────────────────────────────────┐
│  Invalid Event                      │
│                                     │
│  End time must be after start time. │
│                                     │
│  [OK]                               │
└─────────────────────────────────────┘
```

**Pro Feature Limit:**
```
┌─────────────────────────────────────┐
│  Free Tier Limit Reached            │
│                                     │
│  You've reached the maximum of      │
│  2 family members on the free plan. │
│                                     │
│  Upgrade to Pro for unlimited       │
│  members and more features.         │
│                                     │
│  [Upgrade to Pro]   [Maybe Later]   │
└─────────────────────────────────────┘
```

---

## Navigation Patterns

### Modal Presentation

**When to use modals**:
- Add Event
- Edit Event
- Event Detail (on phone)
- Settings
- Add Member
- Invitation share sheet

**Dismissal**:
- [✕] close button (top-left or top-right)
- Swipe down gesture
- Tap outside (for some sheets)

### Sheets vs Full Screen

**Sheet** (bottom modal):
- Add Member
- Edit Member
- Invitation share
- Quick actions
- Settings on tablet

**Full Screen**:
- Add Event (complex form)
- Edit Event (complex form)
- Settings on phone
- Onboarding
- Family setup

### Back Navigation

**Navigation Stack**:
```
Main Tab View
  → Event Detail
    → Edit Event
      → [Save/Cancel returns to Event Detail]
      → [Back from Event Detail returns to Main]
```

**Breadcrumbs** (tablet/desktop only):
```
Home > Calendar > Event Detail > Edit Event
```

---

**END OF USER FLOWS**

