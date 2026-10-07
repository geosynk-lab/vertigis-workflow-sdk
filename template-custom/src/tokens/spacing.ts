/**
 * Standardized Spacing Scale & Semantic Roles (MUI 8px Grid Multipliers)
 */
export const SPACING = {
    // Base Scale (Multipliers: 1 = 8px)
    none: 0,
    xs: 0.5,   // 4px  - micro gaps (badges, inline icons)
    sm: 1,     // 8px  - compact elements (form controls, list items)
    md: 1.5,   // 12px - intermediate (filter inputs, compact cards)
    lg: 2,     // 16px - standard sections (card body, dialogs)
    xl: 3,     // 24px - major layout gutters
    xxl: 4,    // 32px - page headers, empty states

    // Semantic Roles (Intent-Driven)
    inlineGap: 0.5,      // Gap between icon and accompanying text
    controlGap: 1,       // Gap between checkboxes, switches, and radio items
    fieldGap: 1.5,       // Gap between form fields / dropdowns
    sectionGap: 2,       // Gap between major card or panel sections
    cardPadding: 1.5,    // Standard inner padding for cards
    panelPadding: 2,     // Standard inner padding for drawers/panels
} as const;

export type SpacingToken = typeof SPACING[keyof typeof SPACING];
export default SPACING;
