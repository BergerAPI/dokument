import {promisify} from 'util';
import {exec as execSync} from 'child_process';

/**
 * Wrapper for execSync that returns a promise.
 */
const exec = promisify(execSync);

export {
    exec,
    execSync
};
