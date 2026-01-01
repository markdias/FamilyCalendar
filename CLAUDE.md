# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**FamilyCal** is a comprehensive family calendar application built with React Native + Expo, designed to help families coordinate schedules and events. The app is cross-platform (iOS, Android, Web), uses Supabase for backend services and authentication, and includes Pro features with in-app subscriptions.

---

## Critical Principles for This Project

### 1. Design System & Professional Appearance

**All UI work must adhere to the comprehensive design system in `DESIGN_SYSTEM.md`**:
- **Do not** create "tacky" or inconsistent-looking UI
- Every component must follow the defined color system, typography, spacing, and component patterns
- Use the established color palette (Coral Red #FF6B6B for "Everyone" events, member-specific colors, semantic colors)
- Maintain 8pt spacing grid throughout
- All text must support Dynamic Type (iOS) and Font Scaling (Android/Web)
- Accessibility is non-negotiable: VoiceOver labels, WCAG AA contrast ratios, 44pt+ touch targets

### 2. No Breaking Changes to Functionality

**Before any modification**:
1. Read and understand the feature context in `FEATURES.md`
2. Understand the user flow in `USER_FLOWS.md`
3. Verify that no existing functionality will break
4. Changes must be backward compatible unless explicitly requested

### 3. Verification & Review Process

**All implementation requires**:
- Mockups/screenshots for UI changes (must be reviewed before final implementation)
- Planning documentation with implementation steps (written before coding)
- Testing coverage for new features
- Verification that Pro feature enforcement still works correctly

### 4. Planning First

For any feature or significant change:
1. Ask clarifying questions about requirements
2. Create a plan document showing implementation steps
3. Present mockups for UI work
4. Track progress with the todo list
5. Update plan as discoveries are made during implementation

---

## Architecture Overview

### Core Services (Singletons/Context Providers)

The app uses service-based architecture. Do NOT modify these without extreme care:

1. **SupabaseAuthService**: Authentication state, login/logout, token management
2. **SupabaseDataService**: CRUD operations for family data, event synchronization
3. **SupabaseClient**: Low-level Supabase client (supabase-js)
4. **AppSettingsService**: User preferences, Pro feature enforcement, widget configuration
5. **CalendarService**: Calendar integration (expo-calendar), external calendar syncing
6. **NotificationService**: Push/local notifications, morning briefs, event reminders
7. **ChecklistManager**: Checklist CRUD, device-independent event identification

### Data Model

**Calendar System**: Supabase Calendar (default for new families)
- Single family calendar per family with attendee-based event assignment
- Events stored in `calendar_events` table, attendees in `event_attendees` table
- Event colors: Coral Red (#FF6B6B) for "Everyone" events, member color for specific members

**Key Concepts**:
- `families`: Top-level organization
- `family_members`: People in the family (with colors for UI display)
- `family_calendars`: Calendar containers (one default per family)
- `calendar_events`: All events
- `event_attendees`: Links events to family members

**Storage**:
- Supabase PostgreSQL (source of truth)
- Local cache: WatermelonDB/SQLite for offline access
- AppGroup UserDefaults for widget communication
- AsyncStorage/MMKV for app settings

### Authentication

- **Methods**: Email/Password, Google OAuth, Guest Mode (local-only)
- **Session**: Stored in SecureStore, auto-refresh on 401
- **Guest Mode**: Local data only, no cloud sync, cannot access Pro features

---

## Critical Constraints (DO NOT CHANGE)

### Stable Identifiers & Storage Keys

These must never be modified as they persist user data:

```typescript
// Storage Keys (AsyncStorage/SecureStore)
"hasCompletedOnboarding"
"hasCompletedFamilySetup"
"com.famcal.familyId"
"com.famcal.pro.enabled"
// All keys in AppSettingsService

// Checklist Event Identifier Format
SHA256 hash of "title + date (YYYY-MM-DD UTC)"
// (supports old format for backward compatibility)

// Notification ID Format
"{eventIdentifier}_{ISO8601StartDate}"
"morningBrief"
"{itemID}_due", "{itemID}_24hrbefore" (checklists)
```

### Supabase Column Names

These are referenced throughout code and must match schema exactly:
- `family_members`: id, name, color, linked_user_id, sort_order, is_invited, avatar_initials
- `calendar_events`: id, family_id, title, start_date, end_date, location, notes, meeting_link, is_all_day, recurrence_rule, is_deleted, alert_minutes, travel_time_minutes, created_by
- `event_attendees`: event_id, member_id, calendar_id, status
- `family_calendars`: id, family_id, name, color, is_default, calendar_type
- `checklists`: event_identifier, event_title, deleted_at, deletion_reason
- `checklist_items`: checklist_id, title, is_completed, created_date, due_date
- `user_settings`: user_id, settings (JSON)

### Pro Feature Checks

Always check `AppSettingsManager.shared.isProUser` before:
- Showing attachments UI or allowing uploads
- Allowing > 2 family members
- Allowing > 1 shared calendar (future)
- Enabling themes (beyond default)
- Enabling widgets
- Showing saved places/drivers

```typescript
if !AppSettingsService.isProUser {
  showUpgradePrompt()
  return
}
```

### Pro Feature Limits (Free Tier)

- Family Members: 2 max
- Shared Calendars: 1 max
- Storage: 0 MB (no attachments)
- Spotlight Events: 5 per person
- Themes: Default only
- Widgets: Disabled
- Drivers/Saved Places: Disabled

---

## Feature Architecture

### Event System

**Event Display Colors**:
```typescript
// Everyone event (all family members are attendees)
→ displays in family calendar color (customizable, default coral red)

// Specific member(s) event
→ displays in first attendee's member color

// No attendees (shouldn't happen)
→ displays in gray (#808080)
```

### Invitation System (Two Types)

1. **Email Invitations** (legacy): Specific email required to accept
2. **Shareable Invitations** (v2): Universal tokens, 7-day expiration, shareable via WhatsApp/QR/links

```typescript
// RPC functions for invitations
create_shareable_invitation(member_id) → { id, token, expires_at }
accept_family_invitation(token) → links user to family member
```

### Soft Deletes

Events use soft deletes (set `is_deleted = true`). Always filter these out:

```typescript
// Queries should include
.eq('is_deleted', false)
```

### Recurrence

- iCalendar RRULE format in `recurrence_rule` column
- Edit options: "This event only" or "All future events"
- Display next 5 occurrences in event detail

### Notifications

- **Event Notifications**: Triggered by event alarms
- **Morning Brief**: Daily summary (configurable time, weekday-only option)
- **Checklist Reminders**: 24-hour advance, due date notifications
- Unique IDs prevent duplicates across devices

---

## Common Development Tasks

### Adding a New Setting

1. Add property to `AppSettingsService`
2. Define in `user_settings` JSON schema in Supabase
3. Implement get/set methods
4. Auto-sync to cloud (1-second debounce)
5. For widgets: Sync to AppGroup UserDefaults
6. Update `FEATURES.md` documentation

### Adding a New Pro Feature

1. Check `isProUser` in UI layer (gating)
2. Check `isProUser` in data layer (enforcement)
3. Show upgrade prompt before blocking action
4. Test both free and Pro tiers
5. Update `FEATURES.md` with limits

### Modifying Event Colors/Display

The event color logic is in `DESIGN_SYSTEM.md`. Before changing:
1. Understand current color cascade (everyone → member → gray)
2. Update both `DESIGN_SYSTEM.md` and implementation
3. Test with events containing different member combinations
4. Verify color accessibility (contrast ratios)

### Working with Checklists

- Event identifiers use device-independent hash (title + date only)
- Supports old format (title + date + calendarID) for backward compat
- Soft deletes cascade when parent event deleted
- Notifications tied to checklist items, not just events

---

## Testing Checklist Before Deployment

**Verify these before any commit**:

- [ ] Feature works in both authenticated and guest modes
- [ ] Family setup flow completes successfully
- [ ] Events create/edit/delete without breaking UI
- [ ] Notifications schedule and fire correctly
- [ ] Checklists sync across devices
- [ ] Pro enforcement works (limits, UI hiding)
- [ ] Settings persist across app restarts
- [ ] Token refresh handles 401 errors
- [ ] Logout clears session properly (guest data preserved)
- [ ] Onboarding shows only for new users
- [ ] No breaking changes to storage keys
- [ ] Design system adherence (colors, spacing, typography)
- [ ] Accessibility features work (VoiceOver, contrast, touch targets)
- [ ] All view modes work (Family/Month/Day)

---

## Common Gotchas

### Calendar IDs Change Across Devices

- EventKit calendar IDs are device-specific
- Use calendar **names** for matching, not IDs
- Checklist event identifiers exclude calendar ID to solve this

### Widget Data Staleness

- Widgets may show old data if timeline not refreshed
- Invoke Native Module to reload timelines after data changes
- Widget refreshes on background fetch schedule

### Session Validation

- Validate session on app **launch**, not every resume
- Only refresh token on 401 response
- Don't clear session on failed refresh (offline case)

### Pro Feature Enforcement

- Check in BOTH UI and data layers
- Enforce limits on save, not just display
- Show upgrade prompts BEFORE blocking

### Async/Await

- Standard JS async/await throughout
- Use React Query / TanStack Query for data fetching
- Handle UI jank from long database writes

---

## Design System Quick Reference

### Colors (Essential)
- **Primary Accent**: #FF6B6B (Coral Red) - "Everyone" events
- **System Blue**: #007AFF - iOS system color, links
- **System Gray**: #8E8E93 - Secondary text, disabled
- **Background (Light)**: #F2F2F7 | **Dark**: #000000
- **Cards (Light)**: #FFFFFF | **Dark**: #1C1C1E

### Typography
- **Font**: San Francisco (iOS), Roboto (Android), System (Web)
- **Title 1**: 34pt Bold | **Title 2**: 28pt Bold | **Title 3**: 22pt Semibold
- **Body**: 17pt Regular | **Subheadline**: 15pt Regular
- **All text must support Dynamic Type scaling**

### Spacing (8pt Grid)
- xxxs: 2pt | xxs: 4pt | xs: 8pt | s: 12pt | m: 16pt | l: 24pt | xl: 32pt | xxl: 48pt

### Buttons
- **Primary**: Background = accent, White text, 12pt radius, 16pt V/24pt H padding, 50pt min height
- **Secondary**: Clear/light gray bg, accent text, 12pt radius, border visible
- **Touch Targets**: Minimum 44pt × 44pt

### Components
- **Event Cards**: Colored left border (4pt), card background, 12pt corner radius
- **Member Cards**: Title 3 font, member color dot, list of events below
- **Bottom Tab Bar**: 68pt height (including safe area), 5 icons + labels

---

## File Structure Notes

This project is primarily specifications and planning documentation:

- `DESIGN_SYSTEM.md`: Complete visual design (colors, typography, components, animations)
- `FEATURES.md`: Feature specs, constraints, Pro enforcement
- `USER_FLOWS.md`: Screen specifications, user journeys, navigation patterns
- `CLAUDE.md`: This file - guidance for Claude Code

When the actual source code is written, it will likely follow:
```
src/
  services/          # Core services (Auth, Data, Settings, Notifications, etc.)
  screens/           # Screen components (Family, Month, Day, Settings, etc.)
  components/        # Reusable UI components
  styles/            # Theme system, design tokens
  hooks/             # Custom React hooks
  utils/             # Helpers
  types/             # TypeScript interfaces
  navigation/        # Navigation stack setup
```

---

## Implementation Workflow for This Project

When building features:

1. **Plan First**: Write implementation plan, show mockups
2. **Follow Design System**: Every component, color, spacing must match
3. **Verify Schema**: Check Supabase tables/columns against `FEATURES.md`
4. **Service-Based**: Use existing services, don't duplicate logic
5. **Test Comprehensively**: Both Pro and Free tier, authenticated and guest
6. **Verify No Breaking Changes**: Test affected flows end-to-end
7. **Update Documentation**: Add to this CLAUDE.md or feature docs

---

## Key Contacts & Resources

- **Design System**: See `DESIGN_SYSTEM.md` for complete reference
- **Features & Constraints**: See `FEATURES.md` for architecture and limits
- **User Flows**: See `USER_FLOWS.md` for screen specs and navigation
- **Backend**: Supabase PostgreSQL with RLS policies

---

**Last Updated**: December 29, 2024