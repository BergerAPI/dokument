import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * ! This is hardcoded.
 */
const __projectdir = resolve(`${__filename}/../../../`)

export {
    __filename,
    __dirname,
    __projectdir
}