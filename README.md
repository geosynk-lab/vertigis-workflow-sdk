<p align="center">
  <a href="https://geosynk.com.au/" target="_blank" rel="noopener noreferrer">
    <img src="https://geosynk.com.au/images/logo/LOGO_MAIN1.svg" alt="GeoSynk" width="380" />
  </a>
</p>

# VertiGIS Studio Workflow SDK (Enterprise Edition)

[![Maintained by GeoSynk](https://img.shields.io/badge/maintained%20by-GeoSynk-f47c22.svg)](https://geosynk.com.au/)
[![NPM Version](https://img.shields.io/npm/v/@geosynk/vertigis-workflow-sdk.svg?color=cb3837)](https://www.npmjs.com/package/@geosynk/vertigis-workflow-sdk)
[![Upstream Sync](https://img.shields.io/badge/upstream-vertigis%2Fvertigis--workflow--sdk-blue.svg)](https://github.com/vertigis/vertigis-workflow-sdk)
[![Enterprise Ready](https://img.shields.io/badge/architecture-enterprise--overlay-green.svg)](#enterprise-architectural-features)
[![WCAG AA](https://img.shields.io/badge/accessibility-WCAG%20AA-success.svg)](#3-form-element-accessibility--touch-targets-wcag-aa)

An enterprise-enhanced fork of the official [VertiGIS Studio Workflow SDK](https://vertigisstudio.com/products/vertigis-studio-workflow/), maintained and engineered by [GeoSynk](https://geosynk.com.au/) (Davood Kazemi). This repository bootstraps production-grade activity packs and custom form elements pre-configured with centralized design tokens, dynamic light/dark theming, WCAG AA compliant 44x44px touch targets, strict anti-god-component modularity, automated OpenSSL certificates, and AI assistant directives (`AGENTS.md`), while preserving 100% compatibility with official VertiGIS upstream updates.

---

## Enterprise Architectural Features

Every project scaffolded from this repository includes:

1. **Centralized Design Token Subsystem (`src/tokens/`)**:
   - `tokens/ui.ts`: 35+ semantic tokens with **100% safe fallbacks** (`var(--primaryBackground, #ffffff)`), guaranteeing visual resilience across VertiGIS Studio Web, Mobile, Desktop (ArcGIS Pro), and Workflow Server.
   - `tokens/typography.ts`: Standardized font stack (`var(--defaultFont)`), font scale, and line heights.
   - `tokens/index.ts`: Native CSS `color-mix(in srgb, ...)` utilities (`alphaMix` and `surfaceMix`) for dynamic, cross-theme tints, hover states, and muted borders without manual media queries.

2. **Dynamic Dual-Theme System (`src/hooks/useIsDarkTheme.ts`)**:
   - Reactive React hook tracking active theme mode via MUI theme, OS `prefers-color-scheme`, and `MutationObserver` on `.vsw-app`/DOM.
   - `src/utils/themeDetection.ts`: Standalone `isDarkTheme()` utility with ITU-R BT.709 perceived luminance calculation for non-CSS engines (canvas renderers, charts, and PDF exports).

3. **Form Element Accessibility & Touch Targets (WCAG AA)**:
   - Form element inputs, buttons, sliders, and interactive controls enforce a minimum touch target size of **44x44px** (`minWidth: "44px"`, `minHeight: "44px"`), meeting WCAG 2.5.5 / 2.5.8 standards.

4. **Anti-God-Component Architecture (150–250 Line Ceilings)**:
   - Sample form element (`src/elements/SampleFormElement/`) cleanly decomposed into presenter view (`main.tsx`), type contracts (`types/index.ts`), error boundary (`components/FormElementErrorBoundary.tsx`), and barrel export (`index.ts`).
   - Sample custom activity (`src/activities/SampleActivity/main.ts`) demonstrating strongly typed inputs and outputs.
   - Strict separation between Workflow execution state, presentation, and pure utilities.

5. **Automated Development SSL Certificates (`certs/`)**:
   - Zero-configuration HTTPS: automated OpenSSL certificate generation via `certs/generate-cert.sh` / `certs/generate-cert.bat`.
   - Automatically executed on project creation or during first startup.

6. **Cross-Platform Startup & Build Scripts**:
   - `start.sh` / `start.bat`: Checks and kills stale port 5000 processes, verifies SSL certificates, and launches the development server.
   - `build.sh` / `build.bat`: Compiles and validates production bundles into `build/`.

7. **Coding Assistant Governance (`AGENTS.md`)**:
   - Pre-injected VertiGIS Workflow SDK directives ensuring AI coding assistants (such as Antigravity, Claude Code, Cursor, Copilot) strictly follow typography rules, token usage, touch targets, and file size limits.

---

## Creating a New Project

### Option A: From NPM Registry (Recommended)
```bash
npx @geosynk/vertigis-workflow-sdk create my-activity-pack
```

### Option B: Direct from GitHub (Zero Registry / No NPM Publish Required)
```bash
npx github:davekazemi/vertigis-workflow-sdk create my-activity-pack
```

### Option C: Local Linked SDK (Instant Local Development)
Inside this repository:
```bash
npm link
```
Then anywhere on your machine:
```bash
vertigis-workflow-sdk create my-activity-pack
```

---

## Scaffolded Project Structure

```text
my-activity-pack/
├── .vscode/                     ← VS Code recommended extensions
├── certs/                       ← Self-signed SSL certs for HTTPS devServer
│   ├── cert.pem
│   ├── key.pem
│   └── generate-cert.sh / .bat
├── src/
│   ├── index.ts                 ← Library entry point registering activities & elements
│   ├── main.ts                  ← Webpack bundle export entry
│   ├── tokens/                  ← Centralized design tokens subsystem
│   │   ├── ui.ts                ← Semantic color tokens with safe fallbacks
│   │   ├── typography.ts        ← Font families, scales, and line heights
│   │   └── index.ts             ← Barrel export + color-mix utilities
│   ├── hooks/
│   │   ├── useIsDarkTheme.ts    ← Reactive light/dark theme tracking
│   │   └── index.ts
│   ├── utils/
│   │   ├── themeDetection.ts    ← Standalone luminance-based theme detector
│   │   └── index.ts
│   ├── activities/
│   │   └── SampleActivity/      ← Custom workflow activity template
│   │       ├── main.ts
│   │       └── index.ts
│   └── elements/
│       └── SampleFormElement/   ← Decomposed form element template
│           ├── main.tsx         ← React view with 44x44px touch targets
│           ├── index.ts
│           ├── types/           ← Form element props and state interfaces
│           └── components/      ← Subcomponents & FormElementErrorBoundary
├── AGENTS.md                    ← AI assistant development directives
├── start.sh / start.bat         ← Port killer (5000) + SSL check + dev server runner
├── build.sh / build.bat         ← Production compilation script
├── package.json                 ← Includes @mui/material, @emotion/react, @emotion/styled
└── webpack.config.js
```

---

## Available Scripts (in Scaffolded Project)

- **`./start.sh` (or `start.bat`)**: Kills stale port 5000 processes, generates SSL certificates if missing, and runs `npm start`.
- **`npm start`**: Runs the project in development mode with hot reloading on `https://localhost:5000/main.js`.
- **`npm run build`** (or `./build.sh`): Generates an optimized production bundle in `build/`.
- **`npm run cert:gen`**: Regenerates development SSL certificates in `certs/`.
- **`npm run generate`**: Interactively generates a new activity or form element.

---

## Upstream Synchronization

This fork tracks official updates from `https://github.com/vertigis/vertigis-workflow-sdk.git`. Because enterprise templates are maintained in the isolated `template-custom/` overlay directory, upstream merges execute cleanly without merge conflicts:

```bash
git fetch upstream
git merge upstream/main --no-edit
git push origin main
```
Or run the parent batch synchronizer:
```bash
./sync.sh
```

---

## Documentation

- [VertiGIS Studio Workflow Developer Center](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview/)
- [VertiGIS Workflow SDK Skill Reference Guide](https://github.com/davekazemi/vertigis-sdk-skills)

---

## About GeoSynk

This project is curated and maintained by [GeoSynk](https://geosynk.com.au/), an Australian geospatial software consultancy founded by Davood Kazemi. GeoSynk specializes in enterprise GIS solutions, custom VertiGIS Studio integrations, Esri ArcGIS architecture, and automated cloud deployments.

- **Website**: [https://geosynk.com.au](https://geosynk.com.au/)
- **Contact**: [davood@geosynk.com.au](mailto:davood@geosynk.com.au)

