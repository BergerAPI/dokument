import fs from "fs";
import * as logger from "@paperdave/logger";
import {__projectdir} from "../helper/path";
import * as yaml from "yaml";
import inquirer from "inquirer";
import {exec} from "../helper/exec";
import {runJob} from "../helper/jobs";

/**
 * Initializing a new project with a template.
 * @param name The name of the project.
 */
export async function init(name: string) {
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
}