// @ts-check
"use strict";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

import sdkCreate from "@vertigis/sdk-library/scripts/create.js";

// Root of the SDK installation where the template is found.
const dirName = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dirName, "..");

// Target directory name.
const createIndex = process.argv.findIndex(s => s.includes("create"));
const directoryName = process.argv[createIndex + 1];

if (!directoryName) {
    console.error("Please specify the project directory name: vertigis-workflow-sdk create <project-name>");
    process.exit(1);
}

const targetPath = path.resolve(directoryName);

// 1. Run standard VertiGIS base scaffolding
sdkCreate(rootDir, directoryName, "workflow");

// 2. Apply Enterprise Template Custom Overlay
const customTemplateDir = path.join(rootDir, "template-custom");
if (fs.existsSync(customTemplateDir) && fs.existsSync(targetPath)) {
    console.log("\n[ENTERPRISE] Applying VertiGIS Studio Workflow SDK Enterprise Template Overlay...");
    fs.cpSync(customTemplateDir, targetPath, { recursive: true, force: true });

    // Ensure shell scripts are executable on POSIX systems
    if (process.platform !== "win32") {
        const executables = [
            path.join(targetPath, "certs/generate-cert.sh"),
            path.join(targetPath, "start.sh"),
            path.join(targetPath, "build.sh"),
        ];
        for (const exe of executables) {
            if (fs.existsSync(exe)) {
                try {
                    fs.chmodSync(exe, 0o755);
                } catch {
                    // Ignore chmod failures
                }
            }
        }
    }

    // Configure build scripts with user-selected project name
    const projectName = path.basename(targetPath);
    const buildScripts = [
        path.join(targetPath, "build.sh"),
        path.join(targetPath, "build.bat"),
    ];
    for (const bs of buildScripts) {
        if (fs.existsSync(bs)) {
            try {
                const scriptContent = fs.readFileSync(bs, "utf-8");
                fs.writeFileSync(bs, scriptContent.replace(/__PROJECT_NAME__/g, projectName), "utf-8");
            } catch {
                // Ignore replacement failure
            }
        }
    }

    // Ensure uuid.json exists alongside uuid.cjs for webpack metadata compiler compatibility
    const uuidCjs = path.join(targetPath, "uuid.cjs");
    const uuidJson = path.join(targetPath, "uuid.json");
    if (fs.existsSync(uuidCjs) && !fs.existsSync(uuidJson)) {
        try {
            const cjsContent = fs.readFileSync(uuidCjs, "utf-8");
            const match = cjsContent.match(/const uuid = ["']([^"']+)["']/);
            if (match && match[1]) {
                fs.writeFileSync(uuidJson, JSON.stringify(match[1]) + "\n", "utf-8");
            }
        } catch {
            // Ignore uuid copy failure
        }
    }

    // 3. Merge enterprise dependencies into package.json
    const pkgPath = path.join(targetPath, "package.json");
    if (fs.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
            pkg.dependencies = pkg.dependencies || {};
            pkg.dependencies["@mui/material"] = "^5.15.0";
            pkg.dependencies["@emotion/react"] = "^11.11.0";
            pkg.dependencies["@emotion/styled"] = "^11.11.0";

            pkg.scripts = pkg.scripts || {};
            pkg.scripts["cert:gen"] = "bash ./certs/generate-cert.sh";

            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + "\n", "utf-8");
            console.log("[ENTERPRISE] Added enterprise dependencies (@mui/material, @emotion/*) to package.json");
        } catch (e) {
            console.warn("[WARN] Failed to merge enterprise package.json dependencies:", e);
        }
    }

    // 4. Auto-generate development SSL certificate if openssl is available
    const certScript = path.join(targetPath, "certs", process.platform === "win32" ? "generate-cert.bat" : "generate-cert.sh");
    if (fs.existsSync(certScript)) {
        try {
            console.log("[ENTERPRISE] Checking development SSL certificate...");
            if (process.platform === "win32") {
                execSync(`cmd /c "${certScript}"`, { stdio: "inherit", cwd: targetPath });
            } else {
                execSync(`bash "${certScript}"`, { stdio: "inherit", cwd: targetPath });
            }
        } catch {
            console.log("[INFO] Certificate generation skipped (OpenSSL will run automatically on first start).");
        }
    }

    console.log("\n================================================================================");
    console.log("  [ENTERPRISE] VertiGIS Studio Workflow Extension successfully configured!");
    console.log("  - Centralized Design Tokens: src/tokens/ (100% safe fallbacks & color-mix)");
    console.log("  - Dynamic Dark/Light Theme:  src/hooks/useIsDarkTheme.ts & src/utils/");
    console.log("  - Touch Targets & A11y:      Minimum 44x44px touch targets on form controls");
    console.log("  - Modular Architecture:      src/elements/SampleFormElement/ (ErrorBoundary)");
    console.log("  - Custom Activity Sample:    src/activities/SampleActivity/main.ts");
    console.log("  - Development Scripts:       start.sh / start.bat, build.sh / build.bat");
    console.log("  - AI Directives:             AGENTS.md pre-configured for coding assistants");
    console.log("================================================================================\n");
}
