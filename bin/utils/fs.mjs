import fs from 'fs'
import path from 'path'

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
