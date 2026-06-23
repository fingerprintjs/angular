import { executeCommand } from '../command.mjs'

export async function ngBuild(workspaceDir, log, project) {
  return executeCommand('pnpm', ['exec', 'ng', 'build', project], { cwd: workspaceDir, env: { ...process.env } }, log)
}
