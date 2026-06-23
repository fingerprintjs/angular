import { copyRecursive, joinPath, exists, mkdir, copyFile, rm, writeFile } from '../fs.mjs'
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
  const libDestDir = joinPath(workspaceDir, 'projects', LIB_NAME, 'src', 'lib')
  if (exists(libDestDir)) {
    rm(libDestDir)
  }
  mkdir(libDestDir)

  copyRecursive(SOURCE_LIB_DIR, libDestDir)
  copyFile(SOURCE_PUBLIC_API, joinPath(workspaceDir, 'projects', LIB_NAME, 'src', 'public-api.ts'))

  if (exists(SOURCE_TEST_TS)) {
    copyFile(SOURCE_TEST_TS, joinPath(workspaceDir, 'test.ts'))
  }
  if (exists(SOURCE_JEST_CONFIG)) {
    copyFile(SOURCE_JEST_CONFIG, joinPath(workspaceDir, 'jest.config.js'))
  }
  if (exists(SOURCE_ROOT_TSCONFIG)) {
    copyFile(SOURCE_ROOT_TSCONFIG, joinPath(workspaceDir, 'tsconfig.json'))
  }
  if (exists(SOURCE_ROOT_TSCONFIG_SPEC)) {
    copyFile(SOURCE_ROOT_TSCONFIG_SPEC, joinPath(workspaceDir, 'tsconfig.spec.json'))
  }

  if (!exists(joinPath(workspaceDir, 'tsconfig.spec.json'))) {
    writeFile(
      joinPath(workspaceDir, 'tsconfig.spec.json'),
      JSON.stringify({ extends: './tsconfig.json', compilerOptions: { types: ['jest', 'node'] } })
    )
  }

  const projectDir = joinPath(workspaceDir, 'projects', LIB_NAME)
  copyFile(joinPath(SOURCE_PROJECT_DIR, 'ng-package.json'), joinPath(projectDir, 'ng-package.json'))
  copyFile(joinPath(SOURCE_PROJECT_DIR, 'package.json'), joinPath(projectDir, 'package.json'))
  copyFile(joinPath(SOURCE_PROJECT_DIR, 'tsconfig.lib.json'), joinPath(projectDir, 'tsconfig.lib.json'))
  copyFile(joinPath(SOURCE_PROJECT_DIR, 'tsconfig.lib.prod.json'), joinPath(projectDir, 'tsconfig.lib.prod.json'))
  copyFile(joinPath(SOURCE_PROJECT_DIR, 'tsconfig.spec.json'), joinPath(projectDir, 'tsconfig.spec.json'))
}
