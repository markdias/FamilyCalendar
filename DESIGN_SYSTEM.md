# FamCal Design System
### Complete Visual Design Specifications

**Part of**: FamCal Rebuild Guide
**Date:** December 24, 2024

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Component Library](#component-library)
4. [Layout & Spacing](#layout--spacing)
5. [Icons & Imagery](#icons--imagery)
6. [Animations & Transitions](#animations--transitions)
7. [Theme System](#theme-system)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)

---

## Color System

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Coral Red** | `#FF6B6B` | rgb(255, 107, 107) | "Everyone" events, primary accent |
| **System Blue** | `#007AFF` | rgb(0, 122, 255) | iOS system blue (links, buttons) |
| **System Gray** | `#8E8E93` | rgb(142, 142, 147) | Secondary text, disabled states |

### Member Colors (Defaults)

| Member | Hex Code | RGB | Description |
|--------|----------|-----|-------------|
| **Blue** | `#4A90E2` | rgb(74, 144, 226) | Cool blue |
| **Red** | `#E74C3C` | rgb(231, 76, 60) | Vibrant red |
| **Green** | `#2ECC71` | rgb(46, 204, 113) | Fresh green |
| **Yellow** | `#F39C12` | rgb(243, 156, 18) | Golden yellow |
| **Purple** | `#9B59B6` | rgb(155, 89, 182) | Royal purple |
| **Orange** | `#E67E22` | rgb(230, 126, 34) | Warm orange |
| **Pink** | `#EC407A` | rgb(236, 64, 122) | Hot pink |
| **Teal** | `#1ABC9C` | rgb(26, 188, 156) | Aqua teal |

**Note**: Users can select any color for family members. These are suggested defaults.

### Semantic Colors

| Purpose | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| **Background** | `#F2F2F7` | `#000000` | App background |
| **Card Background** | `#FFFFFF` | `#1C1C1E` | Card/panel backgrounds |
| **Primary Text** | `#000000` | `#FFFFFF` | Main text content |
| **Secondary Text** | `#8E8E93` | `#AEAEB2` | Labels, captions |
| **Border** | `#C6C6C8` | `#38383A` | Dividers, card strokes |
| **Success** | `#34C759` | `#32D74B` | Success states |
| **Warning** | `#FF9500` | `#FF9F0A` | Warning states |
| **Error** | `#FF3B30` | `#FF453A` | Error states, destructive actions |
| **Link** | `#007AFF` | `#0A84FF` | Clickable links |

### Event Color Logic

### Event Color Logic
```typescript
/**
 * Determines the display color for an event based on attendance.
 */
function getEventColor(attendees: Attendee[], allMembers: FamilyMember[]): string {
    if (attendees.length === allMembers.length) {
        // Everyone event
        return "#FF6B6B"; // Coral red
    } else if (attendees.length > 0) {
        // Specific member(s) event - use first attendee's color
        const firstAttendee = attendees[0];
        const member = allMembers.find(m => m.id === firstAttendee.member_id);
        return member ? member.color : "#808080";
    } else {
        // Fallback (no attendees)
        return "#808080"; // Gray
    }
}
```

### Gradient Colors

Used in onboarding, launch screens, and special UI elements:

**Launch Flow Gradient:**
```swift
colors: [
    Color(red: 0.02, green: 0.15, blue: 0.32),  // Deep teal-blue
    Color(red: 0.05, green: 0.34, blue: 0.46),  // Ocean blue
    Color(red: 0.04, green: 0.56, blue: 0.54)   // Bright teal
]
startPoint: .topLeading
endPoint: .bottomTrailing
```

**Accent Gradient (Sunset):**
```swift
colors: [
    Color(red: 0.95, green: 0.63, blue: 0.15),  // Golden
    Color(red: 0.92, green: 0.33, blue: 0.6)    // Pink
]
startPoint: .leading
endPoint: .trailing
```

---

## Typography

### Font Family

**Primary**: San Francisco (iOS), Roboto (Android), System Font (Web)

### Text Styles

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Title 1** | 34pt | Bold | 41pt | Page titles |
| **Title 2** | 28pt | Bold | 34pt | Section headers |
| **Title 3** | 22pt | Semibold | 28pt | Card titles |
| **Headline** | 17pt | Semibold | 22pt | List headers |
| **Body** | 17pt | Regular | 22pt | Main content |
| **Callout** | 16pt | Regular | 21pt | Supporting text |
| **Subheadline** | 15pt | Regular | 20pt | Secondary content |
| **Footnote** | 13pt | Regular | 18pt | Captions, metadata |
| **Caption 1** | 12pt | Regular | 16pt | Fine print |
| **Caption 2** | 11pt | Regular | 13pt | Timestamps, small labels |

### Dynamic Type Support
All text must support **Dynamic Type** (iOS) and **Font Scaling** (Android):

| Category | Scale Factor | Approx Size (px) | Usage |
|----------|--------------|-------------------|-------|
| xSmall | 0.86 | 12 | Fine print |
| Small | 0.94 | 14 | Captions |
| Medium (Default) | 1.0 | 16 | Body text |
| Large | 1.12 | 18 | Headlines |
| xLarge | 1.24 | 20 | Titles |
| xxLarge | 1.35 | 24 | Large Titles |
| xxxLarge | 1.53 | 30 | Display text |

**Implementation:**
Use React Native's `PixelRatio.getFontScale()` or styled-components' helper functions to ensure text scales correctly. Avoid fixed heights on text containers.

### Text Color Hierarchy

| Level | Light Mode Opacity | Dark Mode Opacity | Usage |
|-------|-------------------|-------------------|-------|
| **Primary** | 100% black | 100% white | Main content |
| **Secondary** | 60% black | 60% white | Labels, secondary info |
| **Tertiary** | 30% black | 30% white | Placeholders, disabled |

---

## Component Library

### Buttons

#### Primary Button

```
┌───────────────────────────┐
│      Save Event           │
└───────────────────────────┘
```

**Specifications:**
- Background: Accent color (`#FF6B6B` or theme accent)
- Text: White, Headline weight
- Corner Radius: 12pt
- Padding: Vertical 16pt, Horizontal 24pt
- Min Height: 50pt
- Shadow: 0pt 2pt 8pt rgba(0,0,0,0.15)

**States:**
- Normal: Full color
- Pressed: 80% opacity
- Disabled: 40% opacity, no shadow

---

#### Secondary Button

```
┌───────────────────────────┐
│      Cancel               │
└───────────────────────────┘
```

**Specifications:**
- Background: Clear (or light gray in light mode)
- Border: 1pt solid system gray
- Text: Accent color, Headline weight
- Corner Radius: 12pt
- Padding: Vertical 16pt, Horizontal 24pt
- Min Height: 50pt

**States:**
- Normal: Border visible
- Pressed: Background 10% gray
- Disabled: 40% opacity

---

#### Icon Button

```
┌─────┐
│  +  │
└─────┘
```

**Specifications:**
- Size: 44pt x 44pt (min touch target)
- Icon Size: 20-24pt
- Corner Radius: 22pt (circular) or 12pt (rounded square)
- Background: Varies by context

**Variants:**
- **Filled**: Solid background, white icon
- **Outlined**: Border, colored icon
- **Text**: No background, colored icon

---

### Cards

#### Event Card

```
┌─────────────────────────────────────┐
│ ┃ 9:00 AM  Team Meeting             │
│ ┃ 📍 Office • 🔗 Zoom                │
│ ┃ 👥 John, Jane                      │
└─────────────────────────────────────┘
```

**Specifications:**
- Background: Card background color
- Corner Radius: 12pt
- Left Border: 4pt colored stripe (event color)
- Padding: 12pt all sides
- Shadow: 0pt 1pt 3pt rgba(0,0,0,0.1)
- Gap between elements: 4pt

**Content:**
1. **Time + Title**: Body font, primary text
2. **Meta Row**: Footnote font, secondary text, icons 14pt
3. **Attendees**: Footnote font, secondary text

---

#### Member Card (Family View)

```
┌─────────────────────────────────────┐
│ 🔵 John Smith                       │
│                                     │
│   9:00 AM  Team Meeting             │
│   2:00 PM  Dentist                  │
│   5:30 PM  Soccer Practice          │
│                                     │
│   No more events today              │
└─────────────────────────────────────┘
```

**Specifications:**
- Background: Card background color
- Corner Radius: 16pt
- Padding: 16pt all sides
- Shadow: 0pt 2pt 6pt rgba(0,0,0,0.08)
- Gap between events: 8pt

**Header:**
- Member color indicator: 12pt circle
- Name: Title 3 font, primary text

**Event Rows:**
- Each event: Mini event card (no border)
- "No more events" message: Footnote font, tertiary text

---

### Form Elements

#### Text Input

```
┌─────────────────────────────────────┐
│ Team Meeting                        │
└─────────────────────────────────────┘
```

**Specifications:**
- Background: System fill color
- Border: 1pt solid, system gray (increases to 2pt on focus)
- Corner Radius: 10pt
- Padding: 12pt all sides
- Min Height: 44pt
- Placeholder: Secondary text color
- Text: Body font, primary text

**States:**
- Normal: Gray border
- Focus: Accent color border
- Error: Red border
- Disabled: 50% opacity

---

#### Date/Time Picker

```
┌─────────────────────────────────────┐
│ Starts                              │
│ Tue, Dec 24, 2024      9:00 AM      │
└─────────────────────────────────────┘
```

**Specifications:**
- Displays as button that opens native picker
- Layout: Label on left, value on right
- Tap area: Full width
- Value text: Accent color when tappable

---

#### Toggle Switch

```
Label Text                    ◯──────
Label Text                    ───────●
```

**Specifications:**
- iOS: Native UISwitch
- Android: Material Switch
- Web: Custom toggle matching platform
- ON color: Accent color
- OFF color: System gray

---

#### Segmented Control

```
┌─────────────────────────────────────┐
│ ┌─────────┐  ┌─────────┐  ┌───────┐ │
│ │ Family  │  │  Month  │  │  Day  │ │
│ └─────────┘  └─────────┘  └───────┘ │
└─────────────────────────────────────┘
```

**Specifications:**
- Background: System gray fill
- Selected segment: Card background + shadow
- Corner Radius: 8pt (outer), 6pt (segments)
- Height: 32pt
- Text: Subheadline font

---

### Navigation Elements

#### Bottom Tab Bar

```
┌──────────────────────────────────────┐
│  [Icon] [Icon] [Icon] [Icon] [Icon]  │
│  Family Search  +    Lists  Settings │
└──────────────────────────────────────┘
```

**Specifications:**
- Background: Floating controls background (translucent)
- Height: 68pt (includes safe area)
- Icon Size: 20pt
- Label Font: Caption 1
- Active Color: Accent color
- Inactive Color: Secondary text
- Shadow: 0pt -2pt 8pt rgba(0,0,0,0.1)

---

#### Top Navigation Bar

```
┌─────────────────────────────────────┐
│ [< Back]    Title         [Action]  │
└─────────────────────────────────────┘
```

**Specifications:**
- Height: 44pt (plus safe area)
- Background: Matches main background or card
- Title: Headline font, centered or left-aligned
- Back button: Chevron + label (iOS), arrow only (Android)
- Action buttons: Icon or text, accent color

---

### Lists

#### Standard List Row

```
┌─────────────────────────────────────┐
│ [Icon] Primary Text        [>]      │
│        Secondary Text               │
└─────────────────────────────────────┘
```

**Specifications:**
- Min Height: 44pt
- Padding: 16pt horizontal, 12pt vertical
- Icon: 24pt, left-aligned, 12pt gap
- Primary Text: Body font
- Secondary Text: Footnote font, secondary color
- Chevron: 12pt, secondary color
- Divider: 1px, 16pt left inset

---

### Alerts & Modals

#### Alert Dialog

```
┌───────────────────────────┐
│     Delete Event?         │
│                           │
│ Are you sure you want to  │
│ delete "Team Meeting"?    │
│                           │
│ This cannot be undone.    │
│                           │
│ ┌───────┐    ┌──────────┐ │
│ │Cancel │    │  Delete  │ │
│ └───────┘    └──────────┘ │
└───────────────────────────┘
```

**Specifications:**
- Max Width: 270pt (iOS), 280dp (Android)
- Corner Radius: 14pt
- Background: Card background
- Shadow: 0pt 8pt 24pt rgba(0,0,0,0.3)
- Title: Title 3 font, centered
- Message: Body font, centered, secondary text
- Buttons: Full width, stacked or side-by-side

---

#### Sheet (Bottom Modal)

```
┌─────────────────────────────────────┐
│        [Grabber Handle]             │
│                                     │
│  Sheet Title                 [✕]    │
│  ─────────────────────────────────  │
│                                     │
│  [Sheet Content]                    │
│                                     │
└─────────────────────────────────────┘
```

**Specifications:**
- Corner Radius: 16pt (top corners only)
- Grabber: 36pt wide, 5pt tall, rounded, gray
- Padding: 20pt top (includes grabber), 16pt sides
- Background: Card background
- Dismiss: Swipe down or tap X

---

## Layout & Spacing

### Spacing Scale

FamCal uses an 8pt spacing system:

| Token | Value | Usage |
|-------|-------|-------|
| **xxxs** | 2pt | Minimal gaps (badge offsets) |
| **xxs** | 4pt | Tight spacing (icon-text gaps) |
| **xs** | 8pt | Small gaps (list row internal) |
| **s** | 12pt | Standard gaps (card padding) |
| **m** | 16pt | Medium gaps (section spacing) |
| **l** | 24pt | Large gaps (section headers) |
| **xl** | 32pt | Extra large gaps (major sections) |
| **xxl** | 48pt | Huge gaps (screen spacing) |

### Layout Margins

| Screen Type | Margin |
|-------------|--------|
| **Mobile (Portrait)** | 16pt left/right |
| **Mobile (Landscape)** | 20pt left/right |
| **Tablet (Portrait)** | 32pt left/right |
| **Tablet (Landscape)** | 48pt left/right |
| **Web (Desktop)** | Max width 1200px, centered |

### Safe Areas

Always respect platform safe areas:
- **iOS**: Top notch, bottom home indicator
- **Android**: System bars, navigation bar
- **Web**: Browser chrome

### Grid System

**Mobile:**
- Single column layout
- Cards stack vertically
- Full width minus margins

**Tablet:**
- 2-column layout for landscape
- Calendar + event list side-by-side

**Desktop:**
- 3-column layout option
- Sidebar + main content + detail panel

---

## Icons & Imagery

### Icon System

**Source**: SF Symbols (iOS), Material Icons (Android), Custom SVGs (Web)

#### Common Icons

| Icon | SF Symbol | Material | Usage |
|------|-----------|----------|-------|
| **Calendar** | `calendar` | `event` | Calendar views |
| **Family** | `person.3.fill` | `group` | Family view |
| **Add** | `plus.circle.fill` | `add_circle` | Create event |
| **Search** | `magnifyingglass` | `search` | Search |
| **Settings** | `gearshape.fill` | `settings` | Settings |
| **Location** | `mappin.circle.fill` | `place` | Event location |
| **Link** | `link` | `link` | Meeting links |
| **Checkmark** | `checkmark.circle.fill` | `check_circle` | Checklists |
| **Bell** | `bell.fill` | `notifications` | Alerts |
| **Repeat** | `repeat` | `repeat` | Recurring events |
| **Trash** | `trash.fill` | `delete` | Delete |
| **Edit** | `pencil` | `edit` | Edit |
| **Share** | `square.and.arrow.up` | `share` | Share |
| **More** | `ellipsis` | `more_vert` | More options |
| **Back** | `chevron.left` | `arrow_back` | Navigation back |
| **Close** | `xmark` | `close` | Dismiss |

### Icon Sizes

| Context | Size | Weight |
|---------|------|--------|
| **Tab Bar** | 20pt | Regular |
| **Inline (Text)** | 16pt | Regular |
| **List Icons** | 24pt | Regular |
| **Large Actions** | 28pt | Semibold |
| **Hero Icons** | 48pt+ | Regular |

### App Icon

**Design**: Family of colorful people figures around a calendar
**Sizes Required**:
- iOS: 1024x1024pt (App Store), 60x60, 76x76, 83.5x83.5, 120x120, 152x152, 167x167, 180x180
- Android: 512x512px (Play Store), 48x48, 72x72, 96x96, 144x144, 192x192
- Web: 192x192px, 512x512px (PWA)

### Launch Screen
**Design**: App icon + "FamCal" text on gradient background
**Platform Behavior**:
- **Expo Config Plugin**: `expo-splash-screen`
- Configured via `app.json` for background color and image
- Native gradient Splash screens require custom native code or pre-generation

---

## Animations & Transitions

### Timing Functions

| Name | Curve | Duration | Usage |
|------|-------|----------|-------|
| **Quick** | Ease In Out | 0.2s | Highlights, toggles |
| **Standard** | Ease In Out | 0.3s | Modal presentations, view changes |
| **Slow** | Ease In Out | 0.5s | Page transitions, large movements |
| **Bouncy** | Spring (response: 0.3, damping: 0.7) | Variable | Delightful interactions |

### Common Animations

#### View Transitions
```typescript
// Shared Element Transition (react-native-reanimated)
<SharedElement id="event.id">
  <EventCard event={event} />
</SharedElement>

// Layout Animation (react-native-reanimated)
<Animated.View entering={FadeIn.duration(300)} exiting={FadeOut}>
  {/* Content */}
</Animated.View>
```

#### Interactive Gestures
```typescript
// Swipeable Row (react-native-gesture-handler/Reanimated)
<Swipeable
  renderRightActions={(progress, dragX) => (
    <View style={styles.deleteAction}>
      <Icon name="trash" size={24} color="white" />
    </View>
  )}
>
  <EventRow />
</Swipeable>

// Pull to refresh (FlatList)
<FlatList
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
/>
```

#### Loading States
```typescript
// Skeleton Loading (moti/skeleton)
<Skeleton colorMode="light" width={200} height={20} />
```

#### Success Feedback
```typescript
// Animation (react-native-reanimated / lottie)
<LottieView
  source={require('./animations/checkmark.json')}
  autoPlay
  loop={false}
/>
```

---

## Theme System

### Theme Structure

### Theme Structure

```typescript
interface AppTheme {
    id: string;
    displayName: string;
    description: string;
    dark: boolean; // Replaces prefersDarkInterface

    colors: {
        background: string;
        cardBackground: string;
        cardStroke: string;
        floatingControlsBackground: string;
        accent: string;
        textPrimary: string;
        textSecondary: string;
        success: string;
        warning: string;
        error: string;
        // ... other semantic colors
    };
    
    spacing: {
       s: number;
       m: number;
       l: number; 
    };
}
```

### Default Themes

#### 1. FamCal Classic (Default)

**Light Mode:**
- Background: System grouped background `#F2F2F7`
- Cards: White `#FFFFFF`
- Accent: Dark gray `#333333`
- Text: Black

**Dark Mode:**
- Background: Dark gradient (teal-blue)
- Cards: Dark gray `#1C1C1E`
- Accent: Same as light
- Text: White

---

#### 2. Launch Flow (Pro Theme)

**Characteristics:**
- Always dark interface
- Teal gradient background
- Glass morphism cards (translucent white)
- Sunset gradient accents
- High contrast

**Colors:**
- Background Gradient: Deep teal → Ocean blue → Bright teal
- Card Background: White 14% opacity
- Card Stroke: White 28% opacity
- Accent Gradient: Golden → Pink
- Text: White

---

### Theme Application

**Context Provider:**
```typescript
// ThemeContext.tsx
export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState('classic');
  const theme = getTheme(themeId);
  
  return (
    <ThemeContext.Provider value={{ theme, setThemeId }}>
       <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
         {children}
       </View>
    </ThemeContext.Provider>
  );
};
```

**Per-Component:**
```typescript
const styles = StyleSheet.create({
  text: {
    color: theme.textPrimary,
    fontSize: 16,
  }
});

// Or using Styled Components:
const StyledText = styled.Text`
  color: ${props => props.theme.textPrimary};
  font-size: 16px;
`;
```

### Theme Persistence
```typescript
// Save theme
await AsyncStorage.setItem('selectedThemeID', theme.id);

// Load on launch
const storedID = await AsyncStorage.getItem('selectedThemeID');
const theme = getTheme(storedID || 'classic');
```

---

## Responsive Design

### Breakpoints

| Device Class | Width | Columns | Margins |
|--------------|-------|---------|---------|
| **Compact Phone** | < 375pt | 1 | 16pt |
| **Standard Phone** | 375-428pt | 1 | 16pt |
| **Large Phone** | 428-768pt | 1 | 20pt |
| **Tablet (Portrait)** | 768-1024pt | 2 | 32pt |
| **Tablet (Landscape)** | 1024-1366pt | 2-3 | 48pt |
| **Desktop** | > 1366pt | 3 | Max 1200px centered |

### Adaptive Layouts

#### Family View

**Phone**: Single column, stacked member cards
**Tablet**: 2 columns of member cards
**Desktop**: 3 columns or sidebar + main content

#### Calendar View

**Phone**: Full-screen calendar
**Tablet Portrait**: Calendar + bottom event list
**Tablet Landscape**: Calendar left, events right (side-by-side)
**Desktop**: 3-panel layout (navigation, calendar, event detail)

#### Event Detail

**Phone**: Full-screen modal
**Tablet**: Sheet (bottom 2/3 of screen)
**Desktop**: Right panel (persistent)

---

## Accessibility

### VoiceOver / Screen Readers

### Accessibility Properties
**All interactive elements** must have:
- `accessible={true}`
- `accessibilityLabel` (description)
- `accessibilityHint` (action)
- `accessibilityRole` (button, link, header, etc.)

```typescript
<Pressable 
    onPress={handleDelete}
    accessible={true}
    accessibilityLabel="Delete event"
    accessibilityHint="Deletes Team Meeting event"
    accessibilityRole="button"
>
    <Text>Delete</Text>
</Pressable>
```

**Event Card Example:**
```
Accessibility Label: "Team Meeting, Tuesday December 24 at 9:00 AM, Office, Zoom meeting, with John and Jane"
Accessibility Hint: "Tap to view event details"
```

### Dynamic Type

All text **must** scale with user's font size preference.

**Test at**:
- Default size
- Largest size (xxxLarge)
- Accessibility sizes (1-5)

**Ensure**:
- Text doesn't truncate
- Layouts don't break
- Buttons remain tappable

### Color Contrast

**WCAG AA Compliance:**
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio

**Test**:
- All text on backgrounds
- Icons on backgrounds
- Button text on button backgrounds

**High Contrast Mode:**
- Increase border widths
- Increase color saturation
- Add additional visual separators

### Touch Targets

**Minimum size**: 44pt x 44pt (iOS), 48dp x 48dp (Android)

**Examples:**
- Buttons: 44pt min height
- List rows: 44pt min height
- Icons: 44pt hit area (even if icon is smaller)

### Keyboard Navigation (Web)

- Tab order follows visual order
- Focus indicators visible
- Shortcuts for common actions:
  - `Cmd/Ctrl + N`: New event
  - `Cmd/Ctrl + F`: Search
  - `Cmd/Ctrl + ,`: Settings
  - `Esc`: Close modal

---

**END OF DESIGN SYSTEM**
