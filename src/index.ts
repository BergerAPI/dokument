#!/usr/bin/env node

import * as logger from "@paperdave/logger";
import * as cli from "./cli.js";

(async function () {
    logger.injectLogger();
    cli.initializeCLI();
})().then(() => {
    /* */
})