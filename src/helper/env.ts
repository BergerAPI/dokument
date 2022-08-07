import * as process from "process";

/**
 * Gets the preferred package-manager of the user.
 * Credit goes to https://github.com/geelen/npx-import/blob/main/src/index.ts
 */
function getNodePackageManager(): string {
    const userAgent = process.env.npm_config_user_agent
    if (userAgent) {
        if (userAgent.startsWith('pnpm')) return 'pnpm'
        if (userAgent.startsWith('yarn')) return 'yarn'
        if (userAgent.startsWith('npm')) return 'npm'
    }

    const execPath = process.env.npm_execpath
    if (execPath) {
        if (/np[xm]-cli\.js$/.exec(execPath)) return 'npm'
        if (/yarn$/.exec(execPath)) return 'yarn'
    }

    const mainModulePath = process.mainModule?.path
    if (mainModulePath) {
        if (/\/\.?pnpm\//.exec(mainModulePath)) return 'pnpm'
        if (/\/\.?yarn\//.exec(mainModulePath)) return 'yarn'
    }

    return 'npm'
}

export const NODE_PACKAGE_MANAGER = getNodePackageManager();