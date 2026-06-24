import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

export function setupLogDir(logDir) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  } else {
    fs.readdirSync(logDir).forEach((file) => {
      fs.unlinkSync(path.join(logDir, file))
    })
  }
}

export function logErrorSummary(logStream, logFile, err, version) {
  console.log(`Angular ${version}: FAILED (see ${logFile})`)

  try {
    const logContent = fs.readFileSync(logFile, 'utf8')
    const lines = logContent.split('\n')
    console.log(lines.slice(-15).join('\n'))
  } catch (e) {
    // ignore
  }
}

export function executeCommand(cmd, args, opts, log) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, opts)
    if (log) {
      child.stdout.on('data', log)
      child.stderr.on('data', log)
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

export function updateJsonFile(filePath, updater) {
  if (!fs.existsSync(filePath)) {
    return
  }
  const content = fs.readFileSync(filePath, 'utf8')
  const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
  const json = JSON.parse(cleanContent)
  updater(json)
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8')
}

export function copyRecursive(src, dest) {
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
