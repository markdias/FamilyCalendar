# User Flows & Screen Specifications: FamilyCal

This document describes the user journeys, screen requirements, and navigation patterns for the FamilyCal application.

## Core User Flows

### Onboarding & Setup
1. **App Launch**: Check for existing session.
2. **Authentication**: Email/Password, Google OAuth, or Guest Mode.
3. **Family Setup**: Create or join a family.
4. **Member Configuration**: Set names and colors for family members.
5. **Onboarding Completion**: Set `hasCompletedOnboarding` flag.

### Event Management
- **Creation**: Select attendees (Everyone or specific members), set date/time, location, and alerts.
- **Editing**: Support for single occurrence or "all future events" for recurring items.
- **Deletion**: Soft delete with confirmation.

### Invitation Flow (v2)
1. **Generate**: Family admin creates a shareable token.
2. **Share**: Send via WhatsApp, SMS, or QR code.
3. **Accept**: Recipient opens link, authenticates, and is linked to the family member record.

## Screen Specifications

### Main Navigation (Tab Bar)
- **Family View**: Overview of the current day/week for all members.
- **Month View**: Traditional calendar grid.
- **Day View**: Detailed agenda for a single day.
- **Checklists**: List of all active checklists.
- **Settings**: User preferences, family management, and Pro subscription.

### Event Detail
- Display title, time, attendees, location, and notes.
- Option to add/view checklist items.
- Show next 5 occurrences for recurring events.

## Common Gotchas & Edge Cases
- **Calendar ID Changes**: Device-specific IDs for local calendars. Use names for matching.
- **Widget Staleness**: Timeline must be manually refreshed via Native Module after data updates.
- **Session Refresh**: Handle 401 errors by refreshing the token; don't logout automatically if offline.

## Testing & Verification Checklist
- [ ] Feature works in both authenticated and guest modes.
- [ ] Family setup flow completes successfully.
- [ ] Events create/edit/delete without breaking UI.
- [ ] Notifications schedule and fire correctly.
- [ ] Checklists sync across devices.
- [ ] Pro enforcement works (limits, UI hiding).
- [ ] Logout clears session properly (guest data preserved).
- [ ] Accessibility: VoiceOver, contrast, and touch targets verified.
