import fs from "fs";
import * as logger from "@paperdave/logger";
import {__projectdir} from "../helper/path.js";
import inquirer from "inquirer";
import {exec} from "../helper/exec.js";
import {Job, parseActionFile, runJob} from "../helper/jobs.js";

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
            content: parseActionFile(path),
            path
        }))

    // Generating groups of tags
    const groups: {
        [key: string]: Job[]
    } = {}

    templates.forEach(t => {
        if (!groups[t.content.tag])
            groups[t.content.tag] = []

        groups[t.content.tag].push(t.content);
    })

    // Questioning for the template to use
    const answer = await inquirer.prompt([
        {
            type: "list",
            choices: _ => Object.keys(groups)
                .map(s => [
                    new inquirer.Separator(`--- ${s} ---`),
                    ...groups[s].map(t => t.name)
                ])
                .flat(),
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