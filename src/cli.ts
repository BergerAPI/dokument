import {Command} from "commander";
import * as logger from "@paperdave/logger";
import {exec} from "./helper/exec.js";
import {runJob} from "./helper/jobs.js";
import {__projectdir} from "./helper/path.js";
import inquirer from 'inquirer';
import * as yaml from "yaml";
import fs from "fs"

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
            if (fs.existsSync(name)) {
                console.error(`There is already a folder with the name of ${name}`)
                process.exit(1);
            }

            logger.info(`Initializing project "${name}"`);

            const templates = fs.readdirSync(`${__projectdir}/templates`)
                .filter(f => f.endsWith(".yaml"))
                .map(p => `${__projectdir}/templates/${p}`)
                .map(path => ({
                    content: yaml.parse(fs.readFileSync(path).toString()),
                    path
                }))

            const answer = await inquirer.prompt([
                {
                    type: "list",
                    choices: _ => [...templates.map(f => f.content.name)],
                    name: "template",
                    message: _ => "Choose the template which we should use to generate your project",
                }
            ])

            const file = templates.find(o => o.content.name === answer["template"])

            if (file === null || !file) {
                console.error("Something went horribly wrong. Please open a discussion on Github.")
                process.exit(1);
            }

            await exec("mkdir " + name);
            await runJob(`${file.path}`, `./${name}`);
        });

    program.parse();
}