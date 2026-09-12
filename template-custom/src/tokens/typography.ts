/**
 * Typography Tokens for VertiGIS Studio Workflow Form Elements
 */

export const TYPOGRAPHY_TOKENS = {
    fontFamily: {
        primary: "var(--defaultFont, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif)",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    fontSize: {
        h6: "1.25rem",
        subtitle1: "1rem",
        subtitle2: "0.875rem",
        body1: "1rem",
        body2: "0.875rem",
        caption: "0.75rem",
        overline: "0.625rem",
    },
    fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.625,
    },
} as const;

export default TYPOGRAPHY_TOKENS;
