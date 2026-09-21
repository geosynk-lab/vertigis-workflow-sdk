// @ts-check
"use strict";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import readline from "node:readline";

// Root of the SDK installation where the template is found.
const dirName = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dirName, "..");

// Target directory name and CLI options.
const cliArgs = process.argv.slice(2);
const nonFlagArgs = cliArgs.filter(arg => !arg.startsWith("-") && arg !== "create");
const directoryName = nonFlagArgs[0];

if (!directoryName) {
    console.error(
        "Please specify the project directory name: vertigis-workflow-sdk create <project-name> [--npm | --pnpm | --skip-install]"
    );
    process.exit(1);
}

const targetPath = path.resolve(directoryName);

// Validate project directory path
if (!/^[\w-]+$/.test(path.basename(targetPath))) {
    console.error(
        `Cannot create new project at ${targetPath} as the directory name is not valid. Letters, numbers, dashes and underscores are allowed.\n`
    );
    process.exit(1);
}
if (/[!]/.test(targetPath)) {
    console.error(
        `Cannot create new project at ${targetPath} as the path is not valid. Exclamation points (!) are not allowed in the file system path.\n`
    );
    process.exit(1);
}
if (fs.existsSync(targetPath) && fs.readdirSync(targetPath).length > 0) {
    console.error(`Cannot create new project at ${targetPath} as it already exists.\n`);
    process.exit(1);
}

// 0. Determine package manager (interactive prompt if no flag passed)
let packageManager = "npm";
if (cliArgs.includes("--skip-install") || cliArgs.includes("--no-install") || cliArgs.includes("--pm=none")) {
    packageManager = "none";
} else if (cliArgs.includes("--pnpm") || cliArgs.includes("--pm=pnpm")) {
    packageManager = "pnpm";
} else if (cliArgs.includes("--npm") || cliArgs.includes("--pm=npm")) {
    packageManager = "npm";
} else if (process.stdin.isTTY) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("\n? Which package manager would you like to use?");
    console.log("  1) npm (default)");
    console.log("  2) pnpm");
    console.log("  3) none (skip install — for monorepos / workspaces)\n");

    const answer = await new Promise(resolve => {
        rl.question("Select [1/2/3] (default: 1): ", ans => {
            rl.close();
            resolve(ans.trim().toLowerCase());
        });
    });

    if (answer === "2" || answer === "pnpm" || answer === "p") {
        packageManager = "pnpm";
    } else if (answer === "3" || answer === "none" || answer === "skip") {
        packageManager = "none";
    } else {
        packageManager = "npm";
    }
}

console.log(`\nCreating new project at ${targetPath}`);

// 1. Scaffolding base template
fs.cpSync(path.join(rootDir, "template"), targetPath, { recursive: true });

const tsconfigTpl = path.join(rootDir, "config/tsconfig.json.template");
if (fs.existsSync(tsconfigTpl)) {
    fs.copyFileSync(tsconfigTpl, path.join(targetPath, "tsconfig.json"));
}
const eslintTpl = path.join(rootDir, "config/eslint.config.js.template");
if (fs.existsSync(eslintTpl)) {
    fs.copyFileSync(eslintTpl, path.join(targetPath, "eslint.config.js"));
}
const gitignorePath = path.join(targetPath, "gitignore");
if (fs.existsSync(gitignorePath)) {
    fs.renameSync(gitignorePath, path.join(targetPath, ".gitignore"));
}

// Generate random UUID for uuid.cjs and uuid.json
const cryptoMod = await import("node:crypto");
const uuid = cryptoMod.randomUUID();
const uuidCjs = path.join(targetPath, "uuid.cjs");
if (fs.existsSync(uuidCjs)) {
    try {
        const cjsContent = fs.readFileSync(uuidCjs, "utf-8");
        fs.writeFileSync(uuidCjs, cjsContent.replace(/<uuid>/g, uuid), "utf-8");
    } catch {
        // Ignore replacement failure
    }
}
const uuidJson = path.join(targetPath, "uuid.json");
fs.writeFileSync(uuidJson, JSON.stringify(uuid) + "\n", "utf-8");

// 2. Apply Enterprise Template Custom Overlay
const customTemplateDir = path.join(rootDir, "template-custom");
if (fs.existsSync(customTemplateDir)) {
    console.log("[ENTERPRISE] Applying VertiGIS Studio Workflow SDK Enterprise Template Overlay...");
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
    const buildScripts = [path.join(targetPath, "build.sh"), path.join(targetPath, "build.bat")];
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
}

// 3. Configure package.json with enterprise dependencies, scripts, and SDK packages
const pkgPath = path.join(targetPath, "package.json");
if (fs.existsSync(pkgPath)) {
    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        pkg.name = path.basename(targetPath);

        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies["@mui/material"] = "^5.15.0";
        pkg.dependencies["@emotion/react"] = "^11.11.0";
        pkg.dependencies["@emotion/styled"] = "^11.11.0";

        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies["@vertigis/workflow-sdk"] = "latest";
        pkg.devDependencies["@vertigis/workflow"] = "^5.51.0";

        pkg.scripts = pkg.scripts || {};
        pkg.scripts["cert:gen"] = "bash ./certs/generate-cert.sh";
        pkg.scripts["skill:add"] =
            "npx --yes skills add geosynk-lab/vertigis-sdk-skills --skill vertigis-workflow-sdk-skill -y";
        pkg.scripts["skills:add"] = "npx --yes skills add geosynk-lab/vertigis-sdk-skills -y";

        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + "\n", "utf-8");
        console.log(
            "[ENTERPRISE] Added enterprise dependencies (@mui/material, @emotion/*) and skill:add scripts to package.json"
        );
    } catch (e) {
        console.warn("[WARN] Failed to configure enterprise package.json dependencies:", e);
    }
}

// 4. Auto-generate development SSL certificate if openssl is available
const certScript = path.join(
    targetPath,
    "certs",
    process.platform === "win32" ? "generate-cert.bat" : "generate-cert.sh"
);
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

// 5. Initialize Git Repository
try {
    execSync("git init -b main", { cwd: targetPath, stdio: "ignore" });
} catch {
    // Ignore git init failures
}

// 6. Prompt to install AI Coding Assistant Skill (https://github.com/geosynk-lab/vertigis-sdk-skills)
let shouldInstallSkill = false;
if (process.argv.includes("--skills") || process.argv.includes("--with-skills")) {
    shouldInstallSkill = true;
} else if (process.argv.includes("--no-skills") || process.argv.includes("--without-skills")) {
    shouldInstallSkill = false;
} else if (process.stdin.isTTY) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answer = await new Promise(resolve => {
        rl.question(
            "\n? Would you like to install AI coding assistant skills from https://github.com/geosynk-lab/vertigis-sdk-skills into this project? [Y/n] ",
            ans => {
                rl.close();
                resolve(ans.trim());
            }
        );
    });
    shouldInstallSkill = !answer || answer.toLowerCase().startsWith("y");
} else {
    console.log("\n[INFO] Non-interactive mode: Run 'npm run skill:add' to install AI assistant skills.");
}

if (shouldInstallSkill) {
    console.log("\n[SKILLS] Installing VertiGIS Workflow SDK skill into project repository via npx skills add...");
    try {
        execSync("npx --yes skills add geosynk-lab/vertigis-sdk-skills --skill vertigis-workflow-sdk-skill -y", {
            stdio: "inherit",
            cwd: targetPath,
        });
        console.log("✔ VertiGIS Workflow SDK skill installed successfully in .agents/skills/\n");
    } catch (e) {
        console.warn("[WARN] Automatic skill installation encountered an issue:", e.message);
        console.log("[INFO] You can install it anytime by running: npm run skill:add\n");
    }
}

// 7. Install Dependencies
if (packageManager === "npm") {
    console.log("\n[NPM] Installing packages with npm. This might take a minute...\n");
    try {
        execSync("npm install", { cwd: targetPath, stdio: "inherit" });
    } catch (e) {
        console.warn("[WARN] npm install encountered an issue:", e.message);
    }
} else if (packageManager === "pnpm") {
    console.log("\n[PNPM] Installing packages with pnpm...\n");
    let pnpmCmd = "pnpm";
    try {
        execSync("pnpm --version", { stdio: "ignore" });
    } catch {
        pnpmCmd = "npx --yes pnpm";
    }
    try {
        execSync(`${pnpmCmd} install`, { cwd: targetPath, stdio: "inherit" });
    } catch (e) {
        console.warn("[WARN] pnpm install encountered an issue:", e.message);
    }
} else {
    console.log("\n[INFO] Package installation was skipped (--skip-install / none).");
    console.log("       No node_modules directory was created in this project folder.");
    console.log("       Run 'npm install' or 'pnpm install' at your workspace root to install dependencies.\n");
}

// 8. Ensure @vertigis/workflow-sdk resolves in node_modules even when installed as @geosynk/vertigis-workflow-sdk
const nodeModulesDir = path.join(targetPath, "node_modules");
const vertigisScope = path.join(nodeModulesDir, "@vertigis");
const vertigisSdk = path.join(vertigisScope, "workflow-sdk");
const geosynkSdk = path.join(nodeModulesDir, "@geosynk", "vertigis-workflow-sdk");

if (fs.existsSync(geosynkSdk) && !fs.existsSync(vertigisSdk)) {
    try {
        if (!fs.existsSync(vertigisScope)) {
            fs.mkdirSync(vertigisScope, { recursive: true });
        }
        fs.symlinkSync(geosynkSdk, vertigisSdk, "junction");
        console.log("[ENTERPRISE] Linked @vertigis/workflow-sdk -> @geosynk/vertigis-workflow-sdk");
    } catch (e) {
        console.warn("[WARN] Could not link @vertigis/workflow-sdk:", e);
    }
} else if (fs.existsSync(vertigisSdk) && !fs.existsSync(geosynkSdk)) {
    try {
        const geosynkScope = path.join(nodeModulesDir, "@geosynk");
        if (!fs.existsSync(geosynkScope)) {
            fs.mkdirSync(geosynkScope, { recursive: true });
        }
        fs.symlinkSync(vertigisSdk, geosynkSdk, "junction");
        console.log("[ENTERPRISE] Linked @geosynk/vertigis-workflow-sdk -> @vertigis/workflow-sdk");
    } catch (e) {
        console.warn("[WARN] Could not link @geosynk/vertigis-workflow-sdk:", e);
    }
}

const runCmd = packageManager === "pnpm" ? "pnpm" : "npm";
console.log("\n================================================================================");
console.log("  [ENTERPRISE] VertiGIS Studio Workflow Extension successfully configured!");
console.log("  - Centralized Design Tokens: src/tokens/ (100% safe fallbacks & color-mix)");
console.log("  - Dynamic Dark/Light Theme:  src/hooks/useIsDarkTheme.ts & src/utils/");
console.log("  - Touch Targets & A11y:      Minimum 44x44px touch targets on form controls");
console.log("  - Modular Architecture:      src/elements/SampleFormElement/ (ErrorBoundary)");
console.log("  - Custom Activity Sample:    src/activities/SampleActivity/main.ts");
console.log("  - AI Assistant Skill:        npm run skill:add (install/update from vertigis-sdk-skills)");
console.log("  - Development Scripts:       start.sh / start.bat, build.sh / build.bat");
console.log("  - AI Directives:             AGENTS.md pre-configured for coding assistants");
if (packageManager === "none") {
    console.log("  - Monorepo Mode:             Run 'npm install' or 'pnpm install' at workspace root");
} else {
    console.log(`  - Quick Start:               cd ${path.basename(targetPath)} && ${runCmd} start`);
}
console.log("================================================================================\n");
