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

  const zoneVersionMap = {
    21: '~0.16.0',
    19: '~0.15.0',
    17: '~0.14.0',
    16: '~0.13.0',
    15: '~0.11.4',
  }

  const zoneVersionKey = Object.keys(zoneVersionMap)
    .map(Number)
    .sort((a, b) => b - a)
    .find((v) => majorVersion >= v)

  const zoneVersion = zoneVersionKey ? zoneVersionMap[zoneVersionKey] : 'latest'

  await pnpmAdd(
    workspaceDir,
    log,
    [`@angular/platform-browser-dynamic@^${version}`, `zone.js@${zoneVersion}`],
    ['--config.strict-peer-dependencies=false']
  )

  const builderPackages = [`ng-packagr@^${version}`]

  const jestPackagesMap = {
    21: [
      'jest@^30.0.0',
      'jest-preset-angular@^17.0.0',
      'jest-environment-jsdom@^30.0.0',
      '@types/jest@^29.5.0',
      '@types/node',
    ],
    19: [
      'jest@^29.7.0',
      'jest-preset-angular@^14.6.0',
      'jest-environment-jsdom@^29.7.0',
      '@types/jest@^29.5.0',
      '@types/node',
    ],
    18: ['jest@^29.5.0', 'jest-preset-angular@^14.1.0', 'jest-environment-jsdom@^29.5.0', '@types/jest', '@types/node'],
    16: ['jest@^29.0.0', 'jest-preset-angular@^13.1.0', 'jest-environment-jsdom@^29.0.0', '@types/jest', '@types/node'],
    0: ['jest@^28.0.0', 'jest-preset-angular@^12.2.0', 'jest-environment-jsdom@^28.0.0', '@types/jest', '@types/node'],
  }

  const jestVersionKey = Object.keys(jestPackagesMap)
    .map(Number)
    .sort((a, b) => b - a)
    .find((v) => majorVersion >= v)

  const jestPackages = jestPackagesMap[jestVersionKey]

  await pnpmAdd(
    workspaceDir,
    log,
    [...jestPackages, ...builderPackages],
    ['-D', '--config.strict-peer-dependencies=false']
  )
}
