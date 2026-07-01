import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { angularMetadata } from './utils/angularMetadata'
import { setupLogDir, executeCommand, updateJsonFile, copyRecursive } from './utils/helpers'
import { parseArgs } from 'node:util'

const LIB_NAME = 'fingerprintjs-pro-angular'
const LOG_DIR = path.join(process.cwd(), 'test-logs')

process.env['NG_CLI_ANALYTICS'] = 'false'

async function testVersion(version: string): Promise<number> {
  const meta = angularMetadata[version]
  if (!meta) {
    const errorMsg = `No metadata found for version ${version}`
    console.error(errorMsg)
    const logFile = path.join(LOG_DIR, `angular-${version}.log`)
    fs.writeFileSync(logFile, errorMsg)
    return 1
  }

  const logFile = path.join(LOG_DIR, `angular-${version}.log`)
  const logStream = fs.createWriteStream(logFile)
  const log = (data: string) => logStream.write(data)

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angular-test-'))
  const workspaceDir = path.join(tempDir, 'test-workspace')

  try {
    log(`Angular ${version}: Starting check...\n`)
    console.log(`Angular ${version}: Starting check...`)

    await executeCommand(
      'npx',
      [
        '-y',
        `@angular/cli@${version}`,
        'new',
        'test-workspace',
        '--create-application=false',
        '--skip-git',
        '--skip-install',
        '--defaults',
        '--package-manager=pnpm',
      ],
      { cwd: tempDir, env: { ...process.env } },
      log
    )

    await executeCommand(
      'npx',
      ['-y', `@angular/cli@${version}`, 'generate', 'library', LIB_NAME, '--skip-install'],
      { cwd: workspaceDir, env: { ...process.env } },
      log
    )

    const angularVersionTag = parseInt(version) > 15 ? `v${version}-lts` : `^${version}`

    const packagesToInstall = [
      `@angular/animations@${angularVersionTag}`,
      `@angular/common@${angularVersionTag}`,
      `@angular/compiler@${angularVersionTag}`,
      `@angular/core@${angularVersionTag}`,
      `@angular/forms@${angularVersionTag}`,
      `@angular/platform-browser@${angularVersionTag}`,
      `@angular/platform-browser-dynamic@${angularVersionTag}`,
      `@angular/router@${angularVersionTag}`,
      `zone.js@${meta.zone}`,
      '@fingerprint/agent',
    ]

    const jestVersion = meta.jest
    const typesJestVersion = meta.typesJest || jestVersion

    const devPackagesToInstall = [
      `@angular/cli@${angularVersionTag}`,
      `@angular/compiler-cli@${angularVersionTag}`,
      `@angular-devkit/build-angular@${angularVersionTag}`,
      `ng-packagr@^${version}`,
      `typescript@${meta.typescript}`,
      `jest-preset-angular@${meta.jpa}`,
      `jest@${jestVersion}`,
      `jest-environment-jsdom@${jestVersion}`,
      `@types/jest@${typesJestVersion}`,
      '@types/node',
    ]

    const commonOptions = [
      '--config.strict-peer-dependencies=false',
      '--no-lockfile',
      '--config.fund=false',
      '--ignore-scripts',
    ]

    await executeCommand(
      'pnpm',
      ['add', ...packagesToInstall, ...devPackagesToInstall, ...commonOptions],
      { cwd: workspaceDir, env: { ...process.env } },
      log
    )

    const libDestDir = path.join(workspaceDir, 'projects', LIB_NAME, 'src', 'lib')
    fs.mkdirSync(libDestDir, { recursive: true })
    copyRecursive(path.join(process.cwd(), 'projects', LIB_NAME, 'src', 'lib'), libDestDir)

    fs.copyFileSync(
      path.join(process.cwd(), 'projects', LIB_NAME, 'src', 'public-api.ts'),
      path.join(workspaceDir, 'projects', LIB_NAME, 'src', 'public-api.ts')
    )

    const rootFiles = ['jest.config.js', 'tsconfig.json', 'tsconfig.spec.json', 'test.ts']
    for (const file of rootFiles) {
      const src = path.join(process.cwd(), file)
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(workspaceDir, file))
      }
    }

    const projectDir = path.join(workspaceDir, 'projects', LIB_NAME)
    const projectFiles = [
      'ng-package.json',
      'package.json',
      'tsconfig.lib.json',
      'tsconfig.lib.prod.json',
      'tsconfig.spec.json',
    ]
    for (const file of projectFiles) {
      fs.copyFileSync(path.join(process.cwd(), 'projects', LIB_NAME, file), path.join(projectDir, file))
    }

    const tsconfigFiles = [
      path.join(workspaceDir, 'tsconfig.json'),
      path.join(workspaceDir, 'projects', LIB_NAME, 'tsconfig.spec.json'),
    ]
    for (const file of tsconfigFiles) {
      if (fs.existsSync(file)) {
        updateJsonFile(file, (json) => {
          if (!json.compilerOptions) {
            json.compilerOptions = {}
          }
          json.compilerOptions.skipLibCheck = true
          json.compilerOptions.esModuleInterop = true
          if (parseInt(version) >= 21) {
            json.compilerOptions.moduleResolution = 'bundler'
          }
        })
      }
    }

    await executeCommand(
      './node_modules/.bin/ng',
      ['build', LIB_NAME],
      { cwd: workspaceDir, env: { ...process.env } },
      log
    )

    await executeCommand('./node_modules/.bin/jest', [], { cwd: workspaceDir, env: { ...process.env } }, log)

    console.log(`Angular ${version}: PASSED`)
    return 0
  } catch (err: any) {
    log(err.stack || err.message)
    return 1
  } finally {
    logStream.end()
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

setupLogDir(LOG_DIR)

const { version: versionsParsed } = parseArgs({
  options: {
    version: {
      type: 'string',
      multiple: true,
      short: 'v',
    },
  },
}).values
const versionArgs: string[] = versionsParsed ?? []

const versionsToTest = versionArgs.length > 0 ? versionArgs : Object.keys(angularMetadata)

async function run() {
  console.log(`Starting matrix tests for: ${versionsToTest.join(', ')}`)

  const results = await Promise.all(versionsToTest.map((version) => testVersion(version)))
  const failed = results.some((code) => code !== 0)

  if (failed) {
    process.exit(1)
  } else {
    console.log('Success: All versions passed')
    process.exit(0)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
