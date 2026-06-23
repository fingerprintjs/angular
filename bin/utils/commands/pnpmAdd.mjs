import { executeCommand } from '../command.mjs'

export async function pnpmAdd(workspaceDir, log, packages, options = []) {
  const args = ['add', ...packages, '--config.fund=false', ...options]
  return executeCommand('pnpm', args, { cwd: workspaceDir, env: { ...process.env } }, log)
}
