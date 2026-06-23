import { executeCommand } from '../command.mjs'

export async function pnpmInstall(workspaceDir, log, options = []) {
  return executeCommand(
    'pnpm',
    ['install', '--config.fund=false', ...options],
    { cwd: workspaceDir, env: { ...process.env } },
    log
  )
}
