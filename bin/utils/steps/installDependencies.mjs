import { pnpmInstall } from '../commands/pnpmInstall.mjs'
import { ngGenerate } from '../commands/ngGenerate.mjs'
import { pnpmAdd } from '../commands/pnpmAdd.mjs'
import { LIB_NAME } from '../constants.mjs'

export async function installDependencies(version, workspaceDir, log) {
  const majorVersion = parseInt(version)
  await pnpmInstall(workspaceDir, log)
  await ngGenerate(workspaceDir, log, 'library', LIB_NAME, ['--skip-install'])
  await pnpmInstall(workspaceDir, log, ['--config.strict-peer-dependencies=false', '--no-frozen-lockfile'])
  await pnpmAdd(workspaceDir, log, ['@fingerprint/agent'], ['--config.strict-peer-dependencies=false'])
  let zoneVersion = 'latest'
  if (majorVersion >= 21) {
    zoneVersion = '~0.16.0'
  } else if (majorVersion >= 19) {
    zoneVersion = '~0.15.0'
  } else if (majorVersion >= 17) {
    zoneVersion = '~0.14.0'
  } else if (majorVersion >= 16) {
    zoneVersion = '~0.13.0'
  } else if (majorVersion >= 15) {
    zoneVersion = '~0.11.4'
  }

  await pnpmAdd(
    workspaceDir,
    log,
    [`@angular/platform-browser-dynamic@^${version}`, `zone.js@${zoneVersion}`],
    ['--config.strict-peer-dependencies=false']
  )
  let jestPackages = []
  const builderPackages = [`ng-packagr@^${version}`]

  if (majorVersion >= 21) {
    jestPackages = [
      'jest@^30.0.0',
      'jest-preset-angular@^17.0.0',
      'jest-environment-jsdom@^30.0.0',
      '@types/jest@^29.5.0',
      '@types/node',
    ]
  } else if (majorVersion >= 20) {
    jestPackages = [
      'jest@^29.7.0',
      'jest-preset-angular@^14.6.0',
      'jest-environment-jsdom@^29.7.0',
      '@types/jest@^29.5.0',
      '@types/node',
    ]
  } else if (majorVersion >= 19) {
    jestPackages = [
      'jest@^29.7.0',
      'jest-preset-angular@^14.6.0',
      'jest-environment-jsdom@^29.7.0',
      '@types/jest@^29.5.0',
      '@types/node',
    ]
  } else if (majorVersion >= 18) {
    jestPackages = [
      'jest@^29.5.0',
      'jest-preset-angular@^14.1.0',
      'jest-environment-jsdom@^29.5.0',
      '@types/jest',
      '@types/node',
    ]
  } else if (majorVersion >= 16) {
    jestPackages = [
      'jest@^29.0.0',
      'jest-preset-angular@^13.1.0',
      'jest-environment-jsdom@^29.0.0',
      '@types/jest',
      '@types/node',
    ]
  } else {
    // Angular 15
    jestPackages = [
      'jest@^28.0.0',
      'jest-preset-angular@^12.2.0',
      'jest-environment-jsdom@^28.0.0',
      '@types/jest',
      '@types/node',
    ]
  }

  await pnpmAdd(
    workspaceDir,
    log,
    [...jestPackages, ...builderPackages],
    ['-D', '--config.strict-peer-dependencies=false']
  )
}
