import fs from 'fs'
import path from 'path'
import { LOG_DIR } from './constants.mjs'

export function setupLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  } else {
    fs.readdirSync(LOG_DIR).forEach((file) => {
      fs.unlinkSync(path.join(LOG_DIR, file))
    })
  }
}
