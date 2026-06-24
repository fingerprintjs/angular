import path from 'path'
import fs from 'fs'
import { copyRecursive } from '../fs.mjs'
import {
  LIB_NAME,
  SOURCE_PROJECT_DIR,
  SOURCE_LIB_DIR,
  SOURCE_PUBLIC_API,
  SOURCE_TEST_TS,
  SOURCE_JEST_CONFIG,
  SOURCE_ROOT_TSCONFIG,
  SOURCE_ROOT_TSCONFIG_SPEC,
} from '../constants.mjs'

export async function copySourceFiles(workspaceDir) {
  const libDestDir = path.join(workspaceDir, 'projects', LIB_NAME, 'src', 'lib')
  if (fs.existsSync(libDestDir)) {
    fs.rmSync(libDestDir, { recursive: true, force: true })
  }
  fs.mkdirSync(libDestDir, { recursive: true })

  copyRecursive(SOURCE_LIB_DIR, libDestDir)
  fs.copyFileSync(SOURCE_PUBLIC_API, path.join(workspaceDir, 'projects', LIB_NAME, 'src', 'public-api.ts'))

  if (fs.existsSync(SOURCE_TEST_TS)) {
    fs.copyFileSync(SOURCE_TEST_TS, path.join(workspaceDir, 'test.ts'))
  }
  if (fs.existsSync(SOURCE_JEST_CONFIG)) {
    fs.copyFileSync(SOURCE_JEST_CONFIG, path.join(workspaceDir, 'jest.config.js'))
  }
  if (fs.existsSync(SOURCE_ROOT_TSCONFIG)) {
    fs.copyFileSync(SOURCE_ROOT_TSCONFIG, path.join(workspaceDir, 'tsconfig.json'))
  }
  if (fs.existsSync(SOURCE_ROOT_TSCONFIG_SPEC)) {
    fs.copyFileSync(SOURCE_ROOT_TSCONFIG_SPEC, path.join(workspaceDir, 'tsconfig.spec.json'))
  }

  if (!fs.existsSync(path.join(workspaceDir, 'tsconfig.spec.json'))) {
    fs.writeFileSync(
      path.join(workspaceDir, 'tsconfig.spec.json'),
      JSON.stringify({ extends: './tsconfig.json', compilerOptions: { types: ['jest', 'node'] } })
    )
  }

  const projectDir = path.join(workspaceDir, 'projects', LIB_NAME)
  fs.copyFileSync(path.join(SOURCE_PROJECT_DIR, 'ng-package.json'), path.join(projectDir, 'ng-package.json'))
  fs.copyFileSync(path.join(SOURCE_PROJECT_DIR, 'package.json'), path.join(projectDir, 'package.json'))
  fs.copyFileSync(path.join(SOURCE_PROJECT_DIR, 'tsconfig.lib.json'), path.join(projectDir, 'tsconfig.lib.json'))
  fs.copyFileSync(path.join(SOURCE_PROJECT_DIR, 'tsconfig.lib.prod.json'), path.join(projectDir, 'tsconfig.lib.prod.json'))
  fs.copyFileSync(path.join(SOURCE_PROJECT_DIR, 'tsconfig.spec.json'), path.join(projectDir, 'tsconfig.spec.json'))
}
