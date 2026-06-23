import { executeCommand } from '../command.mjs'

export async function ngNew(version, workspaceDir, log) {
  const parentDir = workspaceDir.split('/').slice(0, -1).join('/')
  const workspaceName = workspaceDir.split('/').pop()

  return executeCommand(
    'npx',
    [
      '-y',
      `@angular/cli@${version}`,
      'new',
      workspaceName,
      '--create-application=false',
      '--skip-git',
      '--skip-install',
      '--defaults',
      '--package-manager=pnpm',
    ],
    { cwd: parentDir, env: { ...process.env } },
    log
  )
}
