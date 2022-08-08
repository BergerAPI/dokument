import {exec as execSync} from 'child_process';
import {promisify} from 'util';

/**
 * Wrapper for execSync that returns a promise.
 */
const exec = promisify(execSync);

export {
    exec,
    execSync
};
