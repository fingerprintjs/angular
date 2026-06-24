import fs from 'fs'
import path from 'path'
import { updateJsonFile } from '../fs.mjs'
import { LIB_NAME } from '../constants.mjs'

export async function updateTsConfigs(workspaceDir, version) {
  const tsconfigFiles = [
    path.join(workspaceDir, 'tsconfig.json'),
    path.join(workspaceDir, 'tsconfig.base.json'),
    path.join(workspaceDir, 'projects', LIB_NAME, 'tsconfig.spec.json'),
  ]

  for (const file of tsconfigFiles) {
    if (fs.existsSync(file)) {
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
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file)
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
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

  if (fs.existsSync(path.join(workspaceDir, 'projects', LIB_NAME, 'tsconfig.spec.json'))) {
    if (
      !fs.existsSync(path.join(workspaceDir, 'tsconfig.json')) &&
      fs.existsSync(path.join(workspaceDir, 'tsconfig.base.json'))
    ) {
      updateJsonFile(path.join(workspaceDir, 'projects', LIB_NAME, 'tsconfig.spec.json'), (json) => {
        json.extends = '../../tsconfig.base.json'
      })
    }
  }

  const addNodeReference = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file)
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        addNodeReference(fullPath)
      } else if (file.endsWith('.spec.ts')) {
        let content = fs.readFileSync(fullPath, 'utf8')
        if (!content.startsWith('/// <reference types="node" />')) {
          content = '/// <reference types="node" />\n' + content
          fs.writeFileSync(fullPath, content, 'utf8')
        }
      }
    })
  }
  addNodeReference(path.join(workspaceDir, 'projects', LIB_NAME))

  if (parseInt(version) >= 21) {
    const targetTsconfigs = [
      path.join(workspaceDir, 'tsconfig.json'),
      path.join(workspaceDir, 'tsconfig.base.json'),
      path.join(workspaceDir, 'projects', LIB_NAME, 'tsconfig.lib.json'),
    ]
    for (const configPath of targetTsconfigs) {
      if (fs.existsSync(configPath)) {
        updateJsonFile(configPath, (json) => {
          if (json.compilerOptions) {
            json.compilerOptions.moduleResolution = 'bundler'
          }
        })
      }
    }
  }
}
