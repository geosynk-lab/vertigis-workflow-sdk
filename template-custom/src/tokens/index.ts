import { UI_TOKENS } from "./ui";
import { TYPOGRAPHY_TOKENS } from "./typography";
import { SPACING } from "./spacing";

export { UI_TOKENS } from "./ui";
export { TYPOGRAPHY_TOKENS } from "./typography";
export { SPACING } from "./spacing";

export function alphaMix(token: string, opacityPercent: number): string {
    const clamped = Math.max(0, Math.min(100, opacityPercent));
    return `color-mix(in srgb, ${token} ${clamped}%, transparent)`;
}

export function surfaceMix(fgToken: string, bgToken: string, weightPercent: number): string {
    const clamped = Math.max(0, Math.min(100, weightPercent));
    return `color-mix(in srgb, ${fgToken} ${clamped}%, ${bgToken})`;
}

export const tokens = {
    ui: UI_TOKENS,
    typography: TYPOGRAPHY_TOKENS,
    spacing: SPACING,
    alphaMix,
    surfaceMix,
};

export default tokens;
