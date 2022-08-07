import {exec} from "./exec.js";
import * as process from "process";

/**
 * Programs that we need to run the main functions.
 */
const requiredPrograms = [
    "npm",
    "npx",
    "node",
]

/**
 * Programs that are not necessary to run the main functions.
 */
const optionalPrograms = [
    "yarn",
    "pnpm",
    "docker",
    "docker-compose",
    "kubectl"
]

/**
 * Every available program with its matching path.ts.
 */
export let available: { [key: string]: string } = {};

/**
 * Gets the preferred package-manager of the user.
 * Credit goes to https://github.com/geelen/npx-import/blob/main/src/index.ts
 */
function getPackageManager(): string {
    const userAgent = process.env.npm_config_user_agent
    if (userAgent) {
        if (userAgent.startsWith('pnpm')) return 'pnpm'
        if (userAgent.startsWith('yarn')) return 'yarn'
        if (userAgent.startsWith('npm')) return 'npm'
    }

    const execPath = process.env.npm_execpath
    if (execPath) {
        if (/np[xm]-cli\.js$/.exec(execPath)) return 'npm'
        if (/yarn$/.exec(execPath)) return 'yarn'
    }

    const mainModulePath = process.mainModule?.path
    if (mainModulePath) {
        if (/\/\.?pnpm\//.exec(mainModulePath)) return 'pnpm'
        if (/\/\.?yarn\//.exec(mainModulePath)) return 'yarn'
    }

    return 'npm'
}

/**
 * This checks for any programs.
 */
export async function checkPrograms() {
    const programs = [...requiredPrograms, ...optionalPrograms];

    for (const program of programs) {
        try {
            const result = await exec(`which ${program}`);

            available[program] = result.stdout.trim();
        } catch (_) {
        }
    }

    // Checking if every required program is available
    for (const program of requiredPrograms)
        if (!available[program]) {
            console.error(`The program ${program} is not available, even thought it's required.`);
            process.exit(1);
        }
}

export const PACKAGE_MANAGER = getPackageManager();