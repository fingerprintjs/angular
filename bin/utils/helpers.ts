import * as fs from 'fs'
import * as path from 'path'
import { spawn, SpawnOptions } from 'child_process'
import { parse, stringify } from 'comment-json'

export function setupLogDir(logDir: string): void {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  } else {
    fs.readdirSync(logDir).forEach((file) => {
      fs.unlinkSync(path.join(logDir, file))
    })
  }
}

export function executeCommand(
  cmd: string,
  args: string[],
  opts: SpawnOptions,
  log?: (data: string) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, opts)
    if (log) {
      child.stdout?.on('data', (data) => log(data.toString()))
      child.stderr?.on('data', (data) => log(data.toString()))
    }
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with code ${code}: ${cmd} ${args.join(' ')}`))
      }
    })
  })
}

export function updateJsonFile(filePath: string, updater: (json: any) => void): void {
  if (!fs.existsSync(filePath)) {
    return
  }
  const content = fs.readFileSync(filePath, 'utf8')
  const json = parse(content)
  updater(json)
  fs.writeFileSync(filePath, stringify(json, null, 2), 'utf8')
}

export function copyRecursive(src: string, dest: string): void {
  const isDirectory = fs.existsSync(src) && fs.statSync(src).isDirectory()
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursive(path.join(src, childItemName), path.join(dest, childItemName))
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}
