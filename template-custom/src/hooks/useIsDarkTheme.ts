import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { isDarkTheme } from "../utils/themeDetection";

export function useIsDarkTheme(): boolean {
    const theme = useTheme();
    const [isDark, setIsDark] = React.useState<boolean>(() => {
        if (theme?.palette?.mode === "dark") return true;
        if (theme?.palette?.mode === "light") return false;
        return isDarkTheme();
    });

    React.useEffect(() => {
        if (theme?.palette?.mode === "dark") {
            setIsDark(true);
            return;
        }
        if (theme?.palette?.mode === "light") {
            setIsDark(false);
            return;
        }

        const updateDark = () => {
            setIsDark(isDarkTheme());
        };

        updateDark();

        const mql = typeof window !== "undefined" && window.matchMedia
            ? window.matchMedia("(prefers-color-scheme: dark)")
            : null;
        mql?.addEventListener?.("change", updateDark);

        let observer: MutationObserver | null = null;
        if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
            observer = new MutationObserver(updateDark);
            const obsConfig = {
                attributes: true,
                attributeFilter: ["data-theme", "class", "style"],
            };
            if (document.documentElement) observer.observe(document.documentElement, obsConfig);
            if (document.body) observer.observe(document.body, obsConfig);
            const vswApp = document.querySelector(".vsw-app");
            if (vswApp) observer.observe(vswApp, obsConfig);
        }

        return () => {
            mql?.removeEventListener?.("change", updateDark);
            observer?.disconnect();
        };
    }, [theme?.palette?.mode]);

    return isDark;
}

export default useIsDarkTheme;
