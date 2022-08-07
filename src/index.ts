#!/usr/bin/env node

import * as logger from "@paperdave/logger";
import * as cli from "./cli.js";

(async function () {
    if (!["darwin", "linux", "win32"].includes(process.platform)) {
        console.error("Your operating-system is not supported. This may or may not change. Please open an issue.");
        process.exit(1);
    }

    logger.injectLogger();
    cli.initializeCLI();
})().then(() => {
    /* */
})