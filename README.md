<p align="center">
  <a href="https://geosynk.com.au/" target="_blank" rel="noopener noreferrer">
    <img src="https://geosynk.com.au/images/logo/LOGO_MAIN1.svg" alt="Geosynk" width="380" />
  </a>
</p>

# VertiGIS Studio Workflow SDK (Enterprise Edition)

[![Maintained by Geosynk](https://img.shields.io/badge/maintained%20by-Geosynk-f47c22.svg)](https://geosynk.com.au/)
[![NPM Version](https://img.shields.io/npm/v/@geosynk/vertigis-workflow-sdk.svg?color=cb3837)](https://www.npmjs.com/package/@geosynk/vertigis-workflow-sdk)
[![CI](https://github.com/geosynk-lab/vertigis-workflow-sdk/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/geosynk-lab/vertigis-workflow-sdk/actions/workflows/ci-cd.yml)
[![Upstream Sync](https://img.shields.io/badge/upstream-vertigis%2Fvertigis--workflow--sdk-blue.svg)](https://github.com/vertigis/vertigis-workflow-sdk)
[![Enterprise Ready](https://img.shields.io/badge/architecture-enterprise--overlay-green.svg)](#enterprise-architectural-features)
[![WCAG AA](https://img.shields.io/badge/accessibility-WCAG%20AA-success.svg)](#3-form-element-accessibility--touch-targets-wcag-aa)

An enterprise-enhanced fork of the official [VertiGIS Studio Workflow SDK](https://vertigisstudio.com/products/vertigis-studio-workflow/), maintained and engineered by [Geosynk](https://geosynk.com.au/) (Davood Kazemi). This repository bootstraps production-grade activity packs and custom form elements pre-configured with centralized design tokens, dynamic light/dark theming, WCAG AA compliant 44x44px touch targets, strict anti-god-component modularity, automated OpenSSL certificates, and AI assistant directives (`AGENTS.md`), while preserving 100% compatibility with official VertiGIS upstream updates.

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

8. **Monorepo & Dual Package Manager Resilience (`npm` & `pnpm`)**:
   - **Monorepo `--skip-install` Support**: Scaffolds full enterprise activities and form elements without generating duplicate nested `node_modules`.
   - **Native `pnpm` Support**: Easily scaffold and manage projects using `pnpm`.

---

## Creating a New Project

### Option A: From NPM Registry (Recommended)
```bash
npx @geosynk/vertigis-workflow-sdk create my-activity-pack
```

### Option B: Direct from GitHub (Zero Registry / No NPM Publish Required)
```bash
npx github:geosynk-lab/vertigis-workflow-sdk create my-activity-pack
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

### Option D: Inside a Monorepo / Workspaces (Single Shared `node_modules`)
To manage multiple workflow packs under a single `node_modules` at your workspace root:
```bash
# 1. Scaffold without installing duplicate dependencies
npx @geosynk/vertigis-workflow-sdk create my-activity-pack --skip-install

# 2. Run install once at your monorepo root
npm install
# or
pnpm install
```

### Option E: Direct with `pnpm`
```bash
npx @geosynk/vertigis-workflow-sdk create my-activity-pack --pnpm
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

## Developer Guide: Building & Deploying Activity Packs

> Official Reference: [VertiGIS Studio Workflow TypeScript SDK Overview](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview)

### 1. Architecture & Pack Lifecycle
The Workflow SDK compiles your custom activities and form elements into a client-side bundle and metadata manifest:
- **`src/index.ts`**: The central registry file exporting all custom activities and form elements.
- **`uuid.js`**: Holds an auto-generated unique GUID ensuring multiple activity packs run side-by-side in the same workflow engine without namespace collisions. *(Do not modify this value).*
- **`build/activitypack.json`**: The manifest describing activity inputs, outputs, element props, and bundle entry points required by VertiGIS Studio Workflow Designer.

### 2. Generating Activities & Form Elements
Scaffold new components using the interactive generator:
```bash
npm run generate
```
Follow the interactive CLI prompts:
- **Activity**: Creates a new business logic activity under `src/activities/<Name>/main.ts` with strongly typed inputs/outputs and registers it in `src/index.ts`.
- **Form Element**: Creates a custom React form component under `src/elements/<Name>/` with 44x44px touch targets, error boundary, and register it in `src/index.ts`.

### 3. Running the Development Server
Launch the local HTTPS development server with automatic certificate validation:
```bash
./start.sh      # Linux / macOS
start.bat       # Windows
# or: npm start
```
- Development endpoint: `https://localhost:5000/main.js` (and `https://localtest.me:5000/main.js`)
- Activity pack manifest: `https://localhost:5000/activitypack.json`
- Supports Cross-Origin Resource Sharing (CORS) from any origin out-of-the-box.

### 4. Registering the Activity Pack in ArcGIS Online / Portal
To make your custom activities visible to workflow authors inside **VertiGIS Studio Workflow Designer**:
1. Log in to **ArcGIS Online** or **Portal for ArcGIS**.
2. Navigate to **My Content** > **Add Item** > **An application**.
3. Fill in the item properties:
   - **Type**: `Web Mapping`
   - **Purpose**: `Ready To Use`
   - **API**: `JavaScript`
   - **URL**: `https://localhost:5000/activitypack.json` *(for local development)* or your production HTTPS manifest URL.
   - **Title**: e.g., *Custom Utility Workflow Pack*
   - **Tags**: Must include **`geocortex-workflow-activity-pack`** *(Mandatory: Designer will not discover the pack without this exact tag).*
4. Click **Save**.

### 5. Production Build & Web Server Hosting
Compile production artifacts:
```bash
./build.sh      # Linux / macOS
build.bat       # Windows
# or: npm run build
```
The build script outputs optimized files to `build/`:
- `build/main.js` & `build/<project-name>.js`: Minified production bundle
- `build/<project-name>.js.txt`: Script text artifact for hosting in environments requiring `.txt` extensions
- `build/activitypack.json`: Production activity pack manifest

**Web Server Hosting Requirements**:
- Must be hosted over **HTTPS** with a valid SSL certificate.
- Must enable **CORS** headers allowing requests from `https://apps.vertigisstudio.com` (or your on-premises VertiGIS portal domain).
- Update your ArcGIS Portal item URL from `https://localhost:5000/...` to your production URL `https://your-server.com/path/activitypack.json`.

### 6. Sharing with Workflow Authors
- Share the registered ArcGIS Item with the target groups or users in your organization who author workflows in Designer.
- *(Note: End users of the application running workflows do not require direct permissions to the Portal item; only workflow authors require access).*

---

### 5. AI Coding Assistant Skills (Antigravity, Cursor, Claude Code)

This SDK integrates directly with the [VertiGIS SDK Skills repository](https://github.com/geosynk-lab/vertigis-sdk-skills).

During project creation, you will be prompted:
```text
? Would you like to install AI coding assistant skills from https://github.com/geosynk-lab/vertigis-sdk-skills into this project? [Y/n]
```
If accepted, the `vertigis-workflow-sdk-skill` is automatically installed into `./.agents/skills/` using the standard `skills` tool (`npx skills add`).

You can install or update the skill at any time in your project:
```bash
npm run skill:add
```
Or via non-interactive flag during scaffolding:
```bash
npx @geosynk/vertigis-workflow-sdk create my-pack --skills
```

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
- [Implement Custom Workflow Activities](https://developers.vertigisstudio.com/docs/workflow/sdk-web-create-activity)
- [Implement Custom Form Elements](https://developers.vertigisstudio.com/docs/workflow/sdk-web-create-element)
- [VertiGIS Workflow SDK Skill Reference Guide](https://github.com/geosynk-lab/vertigis-sdk-skills)

---

## About Geosynk

[Geosynk](https://geosynk.com.au/) is an Australian geospatial engineering and software consultancy founded by Davood Kazemi, delivering enterprise GIS architecture, custom VertiGIS solutions, and modern web applications.

### Core Capabilities & Topics

- **VertiGIS Studio Engineering**: Turnkey Web SDK components, custom Workflow activities, accessible form elements, report templates, and automated printing services.
- **Esri ArcGIS Enterprise**: End-to-end cloud and on-premises architecture, Enterprise Geodatabase design, Utility Network migrations, and ArcGIS Experience Builder extensions.
- **Full-Stack Spatial Systems**: High-performance React, TypeScript, Node.js, WebGL, and Leaflet/Mapbox interactive web applications.
- **Spatial DevOps & Automation**: Automated CI/CD pipelines, automated testing, containerized GIS deployments, and infrastructure as code across AWS and Microsoft Azure.

### Connect with Geosynk
- **Website**: [https://geosynk.com.au](https://geosynk.com.au/)
- **Contact**: [Davood Kazemi](mailto:dave.kazemi@gmail.com)


