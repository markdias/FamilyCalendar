# Design System: FamilyCal

This document defines the visual design system, components, and accessibility standards for the FamilyCal application.

## Core Principles
- **Professional & Consistent**: Adhere to the defined color system, typography, and spacing.
- **Accessibility First**: WCAG AA contrast ratios, 44pt+ touch targets, and Dynamic Type support are mandatory.
- **Platform Native**: Follow iOS (Human Interface Guidelines) and Android (Material Design) conventions where appropriate, while maintaining a unified brand.

## Color Palette

### Primary Colors
- **Everyone (Primary Accent)**: #FF6B6B (Coral Red) - Used for events involving all family members.
- **System Blue**: #007AFF - Links and primary action indicators.
- **System Gray**: #8E8E93 - Secondary text and disabled states.

### Backgrounds & Surfaces
- **Background (Light)**: #F2F2F7
- **Background (Dark)**: #000000
- **Cards/Surfaces (Light)**: #FFFFFF
- **Cards/Surfaces (Dark)**: #1C1C1E

### Member Colors
Each family member is assigned a unique color from the palette to identify their specific events.

## Typography
- **Primary Font**: San Francisco (iOS), Roboto (Android), System Default (Web).
- **Title 1**: 34pt Bold
- **Title 2**: 28pt Bold
- **Title 3**: 22pt Semibold
- **Body**: 17pt Regular
- **Subheadline**: 15pt Regular
- **Caption**: 12pt Regular

*All text must support Dynamic Type (iOS) and Font Scaling (Android/Web).*

## Spacing (8pt Grid System)
All layout spacing should follow the 8pt grid:
- **xxxs**: 2pt
- **xxs**: 4pt
- **xs**: 8pt
- **s**: 12pt
- **m**: 16pt
- **l**: 24pt
- **xl**: 32pt
- **xxl**: 48pt

## Components

### Buttons
- **Primary**: Background = accent (#FF6B6B), White text, 12pt corner radius, 16pt vertical / 24pt horizontal padding, 50pt minimum height.
- **Secondary**: Clear or light gray background, accent text, 12pt corner radius, visible border.
- **Touch Targets**: Minimum 44pt × 44pt.

### Event Cards
- **Style**: 12pt corner radius, card background.
- **Indicator**: 4pt colored left border indicating the event category (Everyone or Member color).

### Member Cards
- **Style**: Title 3 font, member color dot, followed by a list of events.

### Navigation
- **Bottom Tab Bar**: 68pt height (including safe area), 5 icons with labels.

## Accessibility Requirements
- **Contrast**: Maintain WCAG AA standards for all text and interactive elements.
- **VoiceOver/TalkBack**: All interactive elements must have descriptive accessibility labels.
- **Haptics**: Use haptic feedback for primary actions and success/error states on mobile.
