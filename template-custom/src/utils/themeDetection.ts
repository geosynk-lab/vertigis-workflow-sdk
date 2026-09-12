export function calculatePerceivedLuminance(r: number, g: number, b: number): number {
    const normalize = (val: number) => {
        const s = val / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
}

export function parseRgbComponents(colorStr: string): [number, number, number] | null {
    if (!colorStr) return null;
    const clean = colorStr.trim().toLowerCase();

    if (clean.startsWith("#")) {
        const hex = clean.slice(1);
        if (hex.length === 3) {
            return [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16)];
        }
        if (hex.length >= 6) {
            return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
        }
    }

    const match = clean.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (match) {
        if (match[4] !== undefined && parseFloat(match[4]) === 0) return null;
        return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
    }

    return null;
}

export function isDarkTheme(): boolean {
    if (typeof window === "undefined" || typeof document === "undefined") return false;
    const docEl = document.documentElement;
    const body = document.body;

    if (docEl.getAttribute("data-theme") === "dark" || body.getAttribute("data-theme") === "dark") return true;

    const darkClasses = ["dark", "theme-dark", "vsw-theme-dark", "vsm-theme-dark"];
    for (const cls of darkClasses) {
        if (docEl.classList.contains(cls) || body.classList.contains(cls)) return true;
    }

    try {
        const testTarget = document.querySelector(".vsw-app") || document.querySelector(".vsm-app") || body || docEl;
        const style = window.getComputedStyle(testTarget);
        const bgVal = style.getPropertyValue("--primaryBackground").trim();
        if (bgVal) {
            const rgb = parseRgbComponents(bgVal);
            if (rgb) return calculatePerceivedLuminance(rgb[0], rgb[1], rgb[2]) < 0.5;
        }
    } catch {}

    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return true;
    return false;
}
