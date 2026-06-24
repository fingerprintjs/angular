import fs from 'fs'
import path from 'path'
import { ngGenerate } from '../commands/ngGenerate.mjs'

export async function setupDemoApp(workspaceDir, version, log) {
  const isLegacy = parseInt(version) === 15
  const options = ['--routing=false', '--style=css', '--skip-tests=true']

  if (!isLegacy) {
    options.push('--standalone=true')
  }

  await ngGenerate(workspaceDir, log, 'application', 'demo', options)

  const appDir = path.join(workspaceDir, 'projects', 'demo', 'src', 'app')

  if (isLegacy) {
    const appModulePath = path.join(appDir, 'app.module.ts')
    if (fs.existsSync(appModulePath)) {
      let content = fs.readFileSync(appModulePath, 'utf8')
      content = content.replace(
        "import { NgModule } from '@angular/core';",
        "import { NgModule } from '@angular/core';\nimport { FingerprintModule } from '@fingerprint/angular';"
      )
      content = content.replace(
        'imports: [',
        `imports: [\n    FingerprintModule.forRoot({ startOptions: { apiKey: 'test-key' } }),`
      )
      fs.writeFileSync(appModulePath, content, 'utf8')
    }
  } else {
    const appConfigPath = path.join(appDir, 'app.config.ts')
    if (fs.existsSync(appConfigPath)) {
      let content = fs.readFileSync(appConfigPath, 'utf8')
      content = content.replace(
        "import { ApplicationConfig } from '@angular/core';",
        "import { ApplicationConfig } from '@angular/core';\nimport { provideFingerprint } from '@fingerprint/angular';"
      )
      content = content.replace(
        'providers: [',
        `providers: [\n    provideFingerprint({ startOptions: { apiKey: 'test-key' } }),`
      )
      fs.writeFileSync(appConfigPath, content, 'utf8')
    } else {
      const mainTsPath = path.join(workspaceDir, 'projects', 'demo', 'src', 'main.ts')
      if (fs.existsSync(mainTsPath)) {
        let content = fs.readFileSync(mainTsPath, 'utf8')
        if (content.includes('bootstrapApplication')) {
          content = content.replace(
            "import { bootstrapApplication } from '@angular/platform-browser';",
            "import { bootstrapApplication } from '@angular/platform-browser';\nimport { provideFingerprint } from '@fingerprint/angular';"
          )
          content = content.replace(
            'providers: [',
            `providers: [\n    provideFingerprint({ startOptions: { apiKey: 'test-key' } }),`
          )
          fs.writeFileSync(mainTsPath, content, 'utf8')
        }
      }
    }
  }
}
