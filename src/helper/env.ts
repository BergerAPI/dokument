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
 * Every available program with its matching path.
 */
export let available: { [key: string]: string } = {};

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