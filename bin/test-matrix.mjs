#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import os from 'os'
import { PNPM_STORE_DIR, VERSIONS, LIB_NAME, LOG_DIR } from './utils/constants.mjs'
import { ensurePnpm } from './utils/commands/ensurePnpm.mjs'
import { ngNew } from './utils/commands/ngNew.mjs'
import { ngBuild } from './utils/commands/ngBuild.mjs'
import { jestRun } from './utils/commands/jestRun.mjs'
import { copySourceFiles } from './utils/steps/copySourceFiles.mjs'
import { updateTsConfigs } from './utils/steps/updateTsConfigs.mjs'
import { installDependencies } from './utils/steps/installDependencies.mjs'
import { setupDemoApp } from './utils/steps/setupDemoApp.mjs'
import { setupLogDir } from './utils/setupLogDir.mjs'
import { logErrorSummary } from './utils/logErrorSummary.mjs'

process.env.NG_CLI_ANALYTICS = 'false'
process.env.PNPM_STORE_DIR = PNPM_STORE_DIR

async function testVersion(version) {
  const logFile = path.join(LOG_DIR, `angular-${version}.log`)
  const logStream = fs.createWriteStream(logFile)

  if (parseInt(version) >= 20) {
    const nodeVersion = process.versions.node
    const [major, minor] = nodeVersion.split('.').map(Number)
    if (major < 20 || (major === 20 && minor < 19)) {
      console.log(`Angular ${version}: Skipped (Node.js ${nodeVersion} < v20.19)`)
      return 0
    }
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angular-test-'))
  const workspaceDir = path.join(tempDir, 'test-workspace')

  try {
    const log = (data) => logStream.write(data)

    await ngNew(version, workspaceDir, log)
    await installDependencies(version, workspaceDir, log)
    await setupDemoApp(workspaceDir, version, log)
    await copySourceFiles(workspaceDir)
    await updateTsConfigs(workspaceDir, version)
    await ngBuild(workspaceDir, log, LIB_NAME)
    await jestRun(workspaceDir, log)

    console.log(`Angular ${version}: PASSED`)
    return 0
  } catch (err) {
    logErrorSummary(logStream, logFile, err, version)
    return 1
  } finally {
    logStream.end()
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

setupLogDir()

const args = process.argv.slice(2)
const versionArgs = []
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--version=')) {
    versionArgs.push(args[i].split('=')[1])
  } else if (args[i] === '--version' && i + 1 < args.length) {
    versionArgs.push(args[++i])
  }
}

const versionsToTest = versionArgs.length > 0 ? versionArgs : VERSIONS

console.log(`Starting tests for Angular versions: ${versionsToTest.join(', ')}`)
console.log(`Using pnpm store at: ${PNPM_STORE_DIR}`)
console.log(`Logs: ${LOG_DIR}`)
console.log('------------------------------------------------------------')

try {
  ensurePnpm()
} catch (e) {
  console.error(e)
  process.exit(1)
}

const results = await Promise.all(versionsToTest.map((v) => testVersion(v)))
const failed = results.some((code) => code !== 0)

console.log('------------------------------------------------------------')
if (failed) {
  console.log('CI Pipeline Failed')
  process.exit(1)
} else {
  console.log('Success: All Angular versions passed')
  process.exit(0)
}
