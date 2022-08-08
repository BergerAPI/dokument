import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

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