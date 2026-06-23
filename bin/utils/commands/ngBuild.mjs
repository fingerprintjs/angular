import { executeCommand } from '../command.mjs'

export async function ngBuild(workspaceDir, log, project) {
  return executeCommand(
    './node_modules/.bin/ng',
    ['build', project],
    { cwd: workspaceDir, env: { ...process.env } },
    log
  )
}
