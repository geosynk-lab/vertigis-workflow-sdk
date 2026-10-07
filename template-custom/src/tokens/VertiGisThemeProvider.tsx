import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";

import { useIsDarkTheme } from "../hooks/useIsDarkTheme";
import { createVertiGisTheme } from "./muiTheme";

/** Applies src/tokens/muiTheme.ts, following the shell's light/dark mode. */
export function VertiGisThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
    const isDark = useIsDarkTheme();
    const theme = React.useMemo(() => createVertiGisTheme(isDark), [isDark]);
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default VertiGisThemeProvider;
