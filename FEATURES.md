# Features & Architecture: FamilyCal

This document outlines the feature specifications, data models, and constraints for the FamilyCal application.

## Core Features

### Calendar System
- **Supabase Calendar**: Default for all new families.
- **Attendee-based Assignment**: Events can be assigned to the whole family ("Everyone") or specific members.
- **Syncing**: Real-time synchronization via Supabase.
- **Offline Access**: Local cache using WatermelonDB/SQLite.

### Invitation System
- **Email Invitations**: Legacy system requiring a specific email address.
- **Shareable Invitations (v2)**: Universal tokens, 7-day expiration, shareable via link or QR code.

### Checklists
- **Event-Linked**: Checklists can be tied to specific calendar events.
- **Device Independent**: Uses a hash of "title + date" for identification across devices.

## Data Model (Supabase Schema)

### Tables & Columns
- **families**: id, name, created_at
- **family_members**: id, name, color, linked_user_id, sort_order, is_invited, avatar_initials
- **family_calendars**: id, family_id, name, color, is_default, calendar_type
- **calendar_events**: id, family_id, title, start_date, end_date, location, notes, meeting_link, is_all_day, recurrence_rule, is_deleted, alert_minutes, travel_time_minutes, created_by
- **event_attendees**: event_id, member_id, calendar_id, status
- **checklists**: event_identifier, event_title, deleted_at, deletion_reason
- **checklist_items**: checklist_id, title, is_completed, created_date, due_date
- **user_settings**: user_id, settings (JSON)

### Key Constraints
- **Soft Deletes**: Events use `is_deleted = true`. Always filter with `.eq('is_deleted', false)`.
- **Recurrence**: Uses iCalendar RRULE format.
- **Stable Identifiers**: Storage keys and checklist identifiers must not be modified.

## Pro Features & Enforcement

### Pro Feature Limits (Free Tier)
- **Family Members**: Max 2
- **Shared Calendars**: Max 1
- **Storage**: 0 MB (no attachments)
- **Spotlight Events**: 5 per person
- **Themes**: Default only
- **Widgets**: Disabled
- **Drivers/Saved Places**: Disabled

### Enforcement Logic
Always check `AppSettingsManager.shared.isProUser` before:
- Allowing > 2 family members.
- Allowing > 1 shared calendar.
- Showing attachments UI or allowing uploads.
- Enabling themes, widgets, or advanced features.

*Show upgrade prompts before blocking actions where possible.*

## Services Architecture
- **SupabaseAuthService**: Auth state and token management.
- **SupabaseDataService**: CRUD and synchronization.
- **AppSettingsService**: User preferences and Pro enforcement.
- **CalendarService**: Device calendar integration (expo-calendar).
- **NotificationService**: Push/local notifications and morning briefs.
- **ChecklistManager**: Checklist logic and identification.
