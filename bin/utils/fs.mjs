import fs from 'fs'
import path from 'path'
import os from 'os'

export function joinPath(...args) {
  return path.join(...args)
}

export function exists(path) {
  return fs.existsSync(path)
}

export function mkdir(path, options = { recursive: true }) {
  return fs.mkdirSync(path, options)
}

export function rm(path, options = { recursive: true, force: true }) {
  return fs.rmSync(path, options)
}

export function readDir(path) {
  return fs.readdirSync(path)
}

export function unlink(path) {
  return fs.unlinkSync(path)
}

export function stat(path) {
  return fs.statSync(path)
}

export function readFile(path, encoding = 'utf8') {
  return fs.readFileSync(path, encoding)
}

export function writeFile(path, data, encoding = 'utf8') {
  return fs.writeFileSync(path, data, encoding)
}

export function mkdtemp(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix))
}

export function createWriteStream(path) {
  return fs.createWriteStream(path)
}

export function copyFile(src, dest) {
  return fs.copyFileSync(src, dest)
}

export function updateJsonFile(filePath, updater) {
  if (!exists(filePath)) {
    return
  }
  const content = readFile(filePath)
  const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
  const json = JSON.parse(cleanContent)
  updater(json)
  writeFile(filePath, JSON.stringify(json, null, 2))
}

export function copyRecursive(src, dest) {
  const isDirectory = exists(src) && stat(src).isDirectory()
  if (isDirectory) {
    if (!exists(dest)) {
      mkdir(dest)
    }
    readDir(src).forEach((childItemName) => {
      copyRecursive(joinPath(src, childItemName), joinPath(dest, childItemName))
    })
  } else {
    copyFile(src, dest)
  }
}
