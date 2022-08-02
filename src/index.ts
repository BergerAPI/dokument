#!/usr/bin/env node

import * as logger from "@paperdave/logger";
import * as env from "./helper/env.js"
import * as cli from "./cli.js";

(async function () {
    logger.injectLogger();
    await env.checkPrograms();
    cli.initializeCLI();
})().then(() => {
    /* */
})