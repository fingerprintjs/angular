import { ngGenerate } from '../commands/ngGenerate.mjs'
import { joinPath, exists, writeFile, readFile } from '../fs.mjs'

export async function setupDemoApp(workspaceDir, version, log) {
  const isLegacy = parseInt(version) === 15
  const options = ['--routing=false', '--style=css', '--skip-tests=true']

  if (!isLegacy) {
    options.push('--standalone=true')
  }

  await ngGenerate(workspaceDir, log, 'application', 'demo', options)

  const appDir = joinPath(workspaceDir, 'projects', 'demo', 'src', 'app')

  if (isLegacy) {
    const appModulePath = joinPath(appDir, 'app.module.ts')
    if (exists(appModulePath)) {
      let content = readFile(appModulePath)
      content = content.replace(
        "import { NgModule } from '@angular/core';",
        "import { NgModule } from '@angular/core';\nimport { FingerprintModule } from '@fingerprint/angular';"
      )
      content = content.replace(
        'imports: [',
        `imports: [\n    FingerprintModule.forRoot({ startOptions: { apiKey: 'test-key' } }),`
      )
      writeFile(appModulePath, content)
    }
  } else {
    const appConfigPath = joinPath(appDir, 'app.config.ts')
    if (exists(appConfigPath)) {
      let content = readFile(appConfigPath)
      content = content.replace(
        "import { ApplicationConfig } from '@angular/core';",
        "import { ApplicationConfig } from '@angular/core';\nimport { provideFingerprint } from '@fingerprint/angular';"
      )
      content = content.replace(
        'providers: [',
        `providers: [\n    provideFingerprint({ startOptions: { apiKey: 'test-key' } }),`
      )
      writeFile(appConfigPath, content)
    } else {
      const mainTsPath = joinPath(workspaceDir, 'projects', 'demo', 'src', 'main.ts')
      if (exists(mainTsPath)) {
        let content = readFile(mainTsPath)
        if (content.includes('bootstrapApplication')) {
          content = content.replace(
            "import { bootstrapApplication } from '@angular/platform-browser';",
            "import { bootstrapApplication } from '@angular/platform-browser';\nimport { provideFingerprint } from '@fingerprint/angular';"
          )
          content = content.replace(
            'providers: [',
            `providers: [\n    provideFingerprint({ startOptions: { apiKey: 'test-key' } }),`
          )
          writeFile(mainTsPath, content)
        }
      }
    }
  }
}
