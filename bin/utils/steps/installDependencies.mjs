import { pnpmInstall } from '../commands/pnpmInstall.mjs'
import { ngGenerate } from '../commands/ngGenerate.mjs'
import { pnpmAdd } from '../commands/pnpmAdd.mjs'
import { LIB_NAME } from '../constants.mjs'

export async function installDependencies(version, workspaceDir, log) {
  await pnpmInstall(workspaceDir, log)
  await ngGenerate(workspaceDir, log, 'library', LIB_NAME, ['--skip-install'])
  await pnpmInstall(workspaceDir, log, ['--config.strict-peer-dependencies=false', '--no-frozen-lockfile'])
  await pnpmAdd(workspaceDir, log, ['@fingerprint/agent'], ['--config.strict-peer-dependencies=false'])
  await pnpmAdd(
    workspaceDir,
    log,
    [`@angular/platform-browser-dynamic@${version}`, 'zone.js'],
    ['--config.strict-peer-dependencies=false']
  )
  const jestPackages =
    parseInt(version) >= 18
      ? ['jest@^29.5.0', 'jest-preset-angular@^14.1.0', 'jest-environment-jsdom@^29.5.0', '@types/jest', '@types/node']
      : ['jest', 'jest-preset-angular', 'jest-environment-jsdom', '@types/jest', '@types/node']

  await pnpmAdd(workspaceDir, log, jestPackages, ['-D', '--config.strict-peer-dependencies=false'])
}
