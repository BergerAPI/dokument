#!/usr/bin/env node

import * as logger from "@paperdave/logger";
import * as cli from "./cli";

logger.injectLogger();
cli.initializeCLI();
