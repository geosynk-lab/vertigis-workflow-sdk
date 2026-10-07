import { createTheme, type Theme } from "@mui/material/styles";

import { UI_TOKENS } from "./ui";

/**
 * The only home for cosmetic styling. Components keep sx to layout, geometry and 8px-grid spacing,
 * inherit everything else from the host shell's CSS custom properties, and express state as
 * data attributes (e.g. <Card data-status={status}>) that are styled here.
 */
export function createVertiGisTheme(isDark: boolean): Theme {
    return createTheme({
        palette: { mode: isDark ? "dark" : "light" },
        typography: { fontFamily: "inherit" },
        components: {
            MuiCard: {
                defaultProps: { variant: "outlined" },
                styleOverrides: {
                    root: {
                        position: "relative",
                        borderRadius: UI_TOKENS.shape.borderRadiusLarge,
                        backgroundColor: UI_TOKENS.surface.primary,
                        border: `1px solid ${UI_TOKENS.border.primary}`,
                        borderLeftWidth: 4,
                        borderLeftColor: "transparent",
                        boxShadow: "none",
                        '&[data-status="Open"], &[data-status="Opened"]': { borderLeftColor: UI_TOKENS.status.warningFg },
                        '&[data-status="In Progress"]': { borderLeftColor: UI_TOKENS.accent.primary },
                        '&[data-status="Completed"]': { borderLeftColor: UI_TOKENS.status.successFg },
                        '&[data-status="Closed"], &[data-status="Archived"]': { borderLeftColor: UI_TOKENS.text.secondary },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: "none" },
                    outlined: { borderColor: UI_TOKENS.border.primary, borderRadius: UI_TOKENS.shape.borderRadius },
                },
            },
        },
    });
}

export default createVertiGisTheme;
