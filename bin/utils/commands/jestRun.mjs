import { executeCommand } from '../command.mjs'

export async function jestRun(workspaceDir, log) {
  return executeCommand('./node_modules/.bin/jest', [], { cwd: workspaceDir, env: { ...process.env } }, log)
}
