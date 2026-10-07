# Repository Agent Directives

<!-- vertigis-workflow-sdk:start -->
# VertiGIS Studio Workflow SDK Development Directives

> **Mandatory Agent Directive**: Whenever you make any change to or create any custom workflow activity or custom form element (Web or Mobile) in this repository, ALWAYS check and verify it against VertiGIS Workflow SDK standards (standard props wiring `enabled`/`visible`/`readOnly`, MobX/React patterns, MUI components with sx tokens, zero hardcoded colors, design token architecture, safe fallbacks, dual-theme adaptation, strict 150–250 line component modularity, state persistence in `setValue`/`setProperty`, and ErrorBoundary wrappers).

## 1. Typography System & Shell Inheritance
- **Strict ban on raw HTML text elements**: Never use raw `<span>`, `<p>`, `<h1>`-`<h6>`, or `<label>` tags.
- **MUI Typography Component**: Always use `@mui/material` `<Typography variant="...">`:
  - `h6`: Form header, section titles, and top-level card titles.
  - `subtitle1`, `subtitle2`: Fieldset headings, group labels, and subheadings.
  - `body1`, `body2`: Standard form labels, values, instructions, and descriptions.
  - `caption`, `overline`: Helper microcopy, field validation hints, units, and timestamps.
- **Semantic Typography Palette Props**: Primary text has no `color` prop: it inherits the host foreground (`color="text.primary"` is redundant). Use `color="text.secondary"` (captions, subtitles, helper microcopy), `color="inherit"` (inside a coloured surface that sets its own foreground), and `color="error"` (validation). NEVER write bespoke inline `sx={{ color: ... }}` solely to set secondary/helper text colors.
- **Top-Level Package Exports Only**: Always import directly from package roots (`import { Box, Typography } from "@mui/material"`; `import { createTheme, ThemeProvider } from "@mui/material/styles"`). Deep imports (e.g. `@mui/material/styles/createTheme`) are deprecated in MUI v7 and break under modern bundlers.
- **Zero `font-family` (No Exceptions)**: Typography and font family are inherited natively from the host shell (`.vsw-app` / Workflow host). NEVER declare `font-family`, the `font:` shorthand, or `fontFamily` anywhere (CSS, `sx`, `style`, token files). The single allowed line is `typography: { fontFamily: "inherit" }` in the `createTheme` theme provider. Using `<Typography>` deletes boilerplate font-size and line-height declarations.
- **Mobile & Field Form Readability**: Ensure minimum text sizing (at least 14px / `body2` on mobile screens) and comfortable line-height for readability in high-glare outdoor environments.

## 2. Host-Governed Styling (Zero Cosmetic `sx`)
- **Six Principles**:
  1. **Host governs cosmetics**: The host (VertiGIS Studio Web / Mobile runtime) supplies MUI theme + CSS custom properties (portal branding). Form elements inherit surface, elevation, borders and typography.
  2. **Zero cosmetic properties in component `sx`, `style`, `styles` dictionaries and `styled()`**: Banned: `border*`, `outline*`, `borderRadius*`, `background*`, `bgcolor`, `backdropFilter`, `boxShadow`, `textShadow`, `filter`, `color`, `textColor`, `textDecoration`, `textTransform`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`. These live ONLY in `src/tokens/muiTheme.ts` (`createTheme` `components.*.styleOverrides`) or are inherited. Text uses `<Typography variant>` and `color="text.secondary"`. Standard form controls (`TextField`, `Select`, `Button`) get states natively via `error`, `disabled={!enabled}`, and `helperText`.
  3. **Canonical layout, gap over margin**: 1D -> `<Stack direction spacing alignItems justifyContent>`. 2D -> `<Box sx={{ display: "flex", flexDirection, gap, alignItems }}>` or `<Grid container spacing>`. Space siblings via parent `gap` or `Stack spacing`, never child `margin`. Allowed `sx` keys: display, flex*, align*, justify*, grid*, spacing keys, sizing (width/height/min/max), positioning (position/top/bottom/left/right/zIndex), and overflow*.
  4. **8px grid spacing**: All spacing (`p*`, `m*`, `gap`, `spacing`) must use canonical 8px grid steps: `0, 0.5, 1, 1.5, 2, 2.5, 3, 4` (negatives, `"auto"`, and responsive objects allowed). Raw pixel strings (`"13px"`) and arbitrary decimals (`0.35`) are banned. Do NOT set `spacing: 5` in createTheme.
  5. **Declarative state via data attributes**: Express dynamic status via `<Card data-status={status}>`. Style `&[data-status="..."]` centrally in `src/tokens/muiTheme.ts`.
  6. **Containment**: `<canvas>` (signature pads), `<img>` (QR codes), `<iframe>` (captcha) must have `Paper`, `Card`, `CardContent`, `CardMedia` or `CardActionArea` as nearest JSX parent (e.g. `<Paper variant="outlined">`); child keeps only functional sizing (`style={{ width: "100%" }}`).
- **No Custom CSS**: NEVER generate `*.css` or `*.module.css` files in Workflow form elements. Form elements run across Web and Mobile runtimes; cosmetics come from `VertiGisThemeProvider` (`src/tokens/muiTheme.ts`), and component `sx` carries layout only.
- **Zero Hardcoded Colors & Shapes**: Strict ban on hardcoded hex (`#ffffff`), RGB (`rgb(...)`), or HSL color values, and hardcoded corner radii (e.g. `4px`). Always reference unified shape tokens: `var(--borderRadius, 4px)` (standard), `var(--borderRadiusSm, 2px)` (micro), `var(--borderRadiusLarge, 8px)` / `var(--borderRadiusLg, 8px)` (cards/dialogs), and `50%` / `9999px` (pills/rounds).
- **Crash Prevention**: NEVER pass raw `var(...)` strings (including any `UI_TOKENS.*` value) into `palette.primary.main` or `palette.error.main` (causes MUI `augmentColor()` to crash). Attach CSS variables via component `styleOverrides` (e.g. `MuiRadio: { styleOverrides: { root: { "&.Mui-checked": { color: "var(--primaryAccent, #007ac2)" } } } }`). Use `color-mix(in srgb, ...)` instead of `alpha()`, and configure `MuiLink` `styleOverrides` in `src/tokens/muiTheme.ts`.
- **Strict Ban on `<CssBaseline />`**: NEVER mount `<CssBaseline />` under `VertiGisThemeProvider` or anywhere in form elements.
- **MUI v7 `slotProps` Standardization**: Use `slotProps` for composite controls (`<TextField slotProps={{ input: { readOnly } }}>`).

## 3. Strict Component Modularity & Anti-God-Component Architecture
- **Strict File Size Thresholds**: Max 150–250 lines per file. Any file exceeding 250 lines MUST be refactored and decomposed.
- **JSX Only in `.tsx`**: Any file containing JSX MUST use the `.tsx` extension; never put JSX in a `.ts` file.
- **Standard Directory Blueprint**: Decompose complex form elements into:
  - `components/`: Presentational, stateless sub-components using MUI.
  - `hooks/`: Custom React hooks for state, lifecycle subscriptions, and workflow event handling.
  - `tokens/`: Centralized design token definitions and theme utilities.
  - `utils/`: Pure helper functions, defaults, and geometry algorithms.
  - `types/`: Domain models and prop interfaces.
- **Defensive Error Boundaries**: Wrap all custom form elements in a `<FormElementErrorBoundary>` to prevent layout crashes from bubbling up to the host application.

## 4. Mobile & Multi-Host Form Element Guidelines
- **Multi-Host Consistency**: Workflow form elements run across VertiGIS Studio Web (desktop), VertiGIS Studio Mobile (iOS, Android, Windows), and ArcGIS Experience Builder. UI must be responsive and adaptive.
- **Mobile Touch Targets**: All interactive controls (buttons, inputs, toggles, icon triggers) must maintain a minimum touch target size of 44x44px (WCAG 2.5.5 / 2.5.8).
- **Field Contrast & Sunlight Readability**: Outdoor field workers require strict WCAG AA contrast (minimum 4.5:1 for standard text, 3:1 for graphical elements and large headings) across both light and dark host themes.
- **State Token Wiring**:
  - `enabled`: Map `!enabled` to `disabled={!enabled}` on MUI controls.
  - `readOnly`: Display with a subtle non-editable background distinctly different from disabled (`readOnly` remains legible and selectable).
  - Validation errors: Wire via `error` and `helperText` on MUI controls.

## 5. Architecture & State Persistence
- **State Persistence (Surviving Tab Remounts)**: Form element state MUST be saved via `props.setValue()` or `props.setProperty()`. NEVER rely on ephemeral local React `useState` for critical business data, as form elements unmount and remount when users navigate between form tabs or workflow steps.
- **Defensive Activities**: Workflow Activities MUST wrap core execution logic in `try/catch` blocks and throw structured `Error` objects so the workflow engine can handle failures gracefully.

## 6. Verification & Rule Validator Gate
- After every code edit, run all of these and report each exit code. A passing build and lint is NOT a passing gate. Skip a step only when its script does not exist in `package.json`, and say so:
  1. `tsc --noEmit` (clean types).
  2. `npm run lint` (zero errors).
  3. `npm run verify:styles` (= `python3 scripts/verify_zero_cosmetic_sx.py`) MUST exit 0.
  4. `npm test` (all tests pass).
  5. `npm run build` (clean compilation).
  6. `python3 <skill-dir>/scripts/validate_workflow_sdk.py --path .` MUST exit 0, where `<skill-dir>` is the installed `vertigis-workflow-sdk-skill` folder (e.g. `~/.agents/skills/vertigis-workflow-sdk-skill`). Suppress a rule only with a written reason: `// vertigis-rule-disable RULE_ID -- <reason>`.
<!-- vertigis-workflow-sdk:end -->
