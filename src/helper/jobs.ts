import {Spinner} from "@paperdave/logger";
import {__projectdir} from "./path.js";
import * as process from "process";
import {PACKAGE_MANAGER} from "./env.js";
import {exec} from "./exec.js";
import * as yaml from "yaml";
import * as fs from "fs";

/**
 * This defines a shell-command to be executed along with its name that should
 * describe what the Step does.
 */
type Step = {
    name: string;

    /**
     * Will be executed as a shell-command, once the Step is executed.
     */
    run: string;
}

/**
 * Type for the YAML configuration file, that describes how projects are built/initialized/generated.
 */
interface Job {
    name: string;
    description: string;

    /**
     * In this array all steps are stored with their description.
     * @type {Array<Step>}
     */
    steps: Step[]

    /**
     * Every required program
     */
    required: string[]
}

/**
 * Checks if the given object is a Step.
 * @param obj The object to check.
 */
function isStep(obj: any): obj is Step {
    return obj.name !== undefined
        && obj.run !== undefined;
}

/**
 * Checks if the given object is a Job.
 * @param obj The object to check.
 */
function isJob(obj: any): obj is Job {
    return obj.description !== undefined
        && obj.name !== undefined
        && obj.required !== undefined
        && Array.isArray(obj.required)
        && obj.steps !== undefined
        && Array.isArray(obj.steps)
        && obj.steps.every(isStep);
}

/**
 * This function will return a job that is defined in a configuration file.
 * @param path
 */
export function parseActionFile(path: string): Job {
    const content = fs.readFileSync(path).toString();
    const job: Job = yaml.parse(content);

    if (!isJob(job)) {
        console.error(`The file ${path} is not a valid job configuration.`);
        process.exit(1);
    }

    return job;
}

const ENV = {
    ...process.env,
    PACKAGE_MANAGER,
    INSTALL_PACKAGE: {
        pnpm: "pnpm add",
        yarn: "yarn add",
        npm: "npm install",
    }[PACKAGE_MANAGER],
    INSTALL_PACKAGE_DEV: {
        pnpm: "pnpm add -D",
        yarn: "yarn add -D",
        npm: "npm install --save-dev",
    }[PACKAGE_MANAGER],

    SETUP_PACKAGE: `${PACKAGE_MANAGER} init -y`,
    PROJECT_DIR: __projectdir
}

/**
 * This function will run a job.
 *
 * @param data The job to run or the path.ts to the job to run.
 * @param cwd The working directory to run the job in.
 */
export async function runJob(data: string, cwd: string | null = null): Promise<void> {
    const job = parseActionFile(data);

    // Checking if all required programs are available
    for (const r of job.required) {
        try {
            await exec(`which ${r}`, {
                cwd: cwd || process.cwd(),
                env: ENV
            });
        } catch(_) {
            console.log(`Required Program "${r}" is missing.`)
            process.exit(1);
        }
    }

    const spinner = new Spinner({
        text: `Running job: "${job.name}"`,
    });

    for (const step of job.steps) {
        spinner.update(`${step.name}: ${step.run}`);

        const result = await exec(step.run, {
            cwd: cwd || process.cwd(),
            env: ENV
        });

        if (result.stderr.length > 0) {
            spinner.fail(`"${job.name}" (step: ${step.name}) failed.`);
            process.exit(1);
        }
    }

    spinner.success(`Job "${job.name}" finished.`);
}
