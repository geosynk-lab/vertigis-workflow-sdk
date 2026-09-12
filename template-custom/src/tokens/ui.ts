/**
 * UI Design Tokens for VertiGIS Studio Workflow Form Elements
 * Maps official VertiGIS CSS custom properties with safe WCAG AA fallbacks.
 */

export const UI_TOKENS = {
    surface: {
        primary: "var(--primaryBackground, #ffffff)",
        secondary: "var(--secondaryBackground, #f5f5f5)",
        overlay: "var(--overlayBackground, rgba(0, 0, 0, 0.5))",
        inverse: "var(--primaryForeground, #212121)",
    },
    text: {
        primary: "var(--primaryForeground, #212121)",
        secondary: "var(--secondaryForeground, #666666)",
        disabled: "var(--disabledForeground, #9e9e9e)",
        inverse: "var(--primaryBackground, #ffffff)",
    },
    border: {
        primary: "var(--primaryBorder, #e0e0e0)",
        secondary: "var(--secondaryBorder, #eeeeee)",
        focus: "var(--focusBorder, #007ac2)",
    },
    accent: {
        primary: "var(--primaryAccent, #007ac2)",
        hover: "var(--primaryAccentHover, #005a91)",
        light: "var(--primaryAccentLight, #e1f5fe)",
        contrastText: "var(--buttonForeground, #ffffff)",
    },
    control: {
        buttonBackground: "var(--emphasizedButtonBackground, var(--primaryAccent, #007ac2))",
        buttonForeground: "var(--buttonForeground, #ffffff)",
        itemHover: "var(--itemHoverBackground, rgba(0, 0, 0, 0.04))",
        itemSelected: "var(--itemSelectedBackground, rgba(0, 122, 194, 0.12))",
    },
    status: {
        errorBg: "var(--alertRedBackground, #fdecea)",
        errorFg: "var(--alertRedForeground, #d32f2f)",
        errorBorder: "var(--alertRedBorder, #f5c2c7)",
        successBg: "var(--alertGreenBackground, #edf7ed)",
        successFg: "var(--alertGreenForeground, #2e7d32)",
        successBorder: "var(--alertGreenBorder, #c3e6cb)",
        warningBg: "var(--alertAmberBackground, #fff4e5)",
        warningFg: "var(--alertAmberForeground, #ed6c02)",
        warningBorder: "var(--alertAmberBorder, #ffeeba)",
        infoBg: "var(--alertGrayBackground, #e8f4fd)",
        infoFg: "var(--alertGrayForeground, #0288d1)",
        infoBorder: "var(--alertGrayBorder, #bee5eb)",
    },
    shape: {
        borderRadius: "var(--borderRadius, 4px)",
        borderRadiusSm: "var(--borderRadiusSm, 2px)",
        borderRadiusLg: "var(--borderRadiusLg, 8px)",
        borderRadiusPill: "9999px",
        shadowPrimary: "var(--shadowPrimary, 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24))",
        shadowElevated: "var(--shadowElevated, 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23))",
    },
    touch: {
        minHeight: "44px",
        minWidth: "44px",
    },
} as const;

export default UI_TOKENS;
