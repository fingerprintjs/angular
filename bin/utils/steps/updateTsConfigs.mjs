import { updateJsonFile, joinPath, exists, readDir, readFile, writeFile, stat } from '../fs.mjs'
import { LIB_NAME } from '../constants.mjs'

export async function updateTsConfigs(workspaceDir, version) {
  const tsconfigFiles = [
    joinPath(workspaceDir, 'tsconfig.json'),
    joinPath(workspaceDir, 'tsconfig.base.json'),
    joinPath(workspaceDir, 'projects', LIB_NAME, 'tsconfig.spec.json'),
  ]

  for (const file of tsconfigFiles) {
    if (exists(file)) {
      updateJsonFile(file, (json) => {
        if (!json.compilerOptions) {
          json.compilerOptions = {}
        }
        json.compilerOptions.types = ['node', 'jest']
        json.compilerOptions.esModuleInterop = true
        json.compilerOptions.allowSyntheticDefaultImports = true
        json.compilerOptions.skipLibCheck = true
      })
    }
  }

  const allSpecTsconfigs = []
  const findSpecConfigs = (dir) => {
    readDir(dir).forEach((file) => {
      const fullPath = joinPath(dir, file)
      if (exists(fullPath) && stat(fullPath).isDirectory()) {
        if (file !== 'node_modules') {
          findSpecConfigs(fullPath)
        }
      } else if (file === 'tsconfig.spec.json') {
        allSpecTsconfigs.push(fullPath)
      }
    })
  }
  findSpecConfigs(workspaceDir)

  for (const file of allSpecTsconfigs) {
    updateJsonFile(file, (json) => {
      if (!json.compilerOptions) {
        json.compilerOptions = {}
      }
      if (!json.compilerOptions.types) {
        json.compilerOptions.types = []
      }
      if (!json.compilerOptions.types.includes('node')) {
        json.compilerOptions.types.push('node')
      }
      if (!json.compilerOptions.types.includes('jest')) {
        json.compilerOptions.types.push('jest')
      }

      json.compilerOptions.esModuleInterop = true
      json.compilerOptions.allowSyntheticDefaultImports = true
      json.compilerOptions.skipLibCheck = true
    })
  }

  if (exists(joinPath(workspaceDir, 'projects', LIB_NAME, 'tsconfig.spec.json'))) {
    if (!exists(joinPath(workspaceDir, 'tsconfig.json')) && exists(joinPath(workspaceDir, 'tsconfig.base.json'))) {
      updateJsonFile(joinPath(workspaceDir, 'projects', LIB_NAME, 'tsconfig.spec.json'), (json) => {
        json.extends = '../../tsconfig.base.json'
      })
    }
  }

  const addNodeReference = (dir) => {
    readDir(dir).forEach((file) => {
      const fullPath = joinPath(dir, file)
      if (exists(fullPath) && stat(fullPath).isDirectory()) {
        addNodeReference(fullPath)
      } else if (file.endsWith('.spec.ts')) {
        let content = readFile(fullPath)
        if (!content.startsWith('/// <reference types="node" />')) {
          content = '/// <reference types="node" />\n' + content
          writeFile(fullPath, content)
        }
      }
    })
  }
  addNodeReference(joinPath(workspaceDir, 'projects', LIB_NAME))

  if (parseInt(version) >= 21) {
    const targetTsconfigs = [
      joinPath(workspaceDir, 'tsconfig.json'),
      joinPath(workspaceDir, 'tsconfig.base.json'),
      joinPath(workspaceDir, 'projects', LIB_NAME, 'tsconfig.lib.json'),
    ]
    for (const configPath of targetTsconfigs) {
      if (exists(configPath)) {
        updateJsonFile(configPath, (json) => {
          if (json.compilerOptions) {
            json.compilerOptions.moduleResolution = 'bundler'
          }
        })
      }
    }
  }
}
