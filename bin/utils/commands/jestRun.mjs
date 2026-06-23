import { executeCommand } from '../command.mjs'

export async function jestRun(workspaceDir, log) {
  return executeCommand('pnpm', ['exec', 'jest'], { cwd: workspaceDir, env: { ...process.env } }, log)
}
