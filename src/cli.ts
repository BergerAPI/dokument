import {Command} from "commander";
import * as logger from "@paperdave/logger";
import {exec} from "./helper/exec.js";
import {runJob} from "./helper/jobs.js";
import {__projectdir} from "./helper/path.js";

/**
 * This initializes the CLI.
 */
export function initializeCLI() {
    const program = new Command();

    program
        .name("dokument")
        .version("0.0.1")
        .description("CLI-Tool for building, deploying and managing microservices in a monorepo.")
        .option("-v, --verbose", "Enable verbose output")
        .option("-d, --debug", "Enable debug output")
        .option("-q, --quiet", "Disable output")

    program
        .command("init")
        .description("Initialize a new project")
        .argument("<name>", "Name of the project")
        .action(async (name: string) => {
            logger.info(`Initializing project ${name} with "setupTypescriptProject" Template.`);

            await exec("mkdir " + name);
            await runJob(`${__projectdir}/templates/setupTypescriptProject.yaml`, `./${name}`);
        });

    program.parse();
}