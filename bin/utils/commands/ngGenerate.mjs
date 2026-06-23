import { executeCommand } from '../command.mjs'

export async function ngGenerate(workspaceDir, log, type, name, options = []) {
  return executeCommand(
    'pnpm',
    ['exec', 'ng', 'generate', type, name, ...options],
    { cwd: workspaceDir, env: { ...process.env } },
    log
  )
}
