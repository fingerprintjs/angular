import { exists, joinPath, mkdir, readDir, unlink } from './fs.mjs'
import { LOG_DIR } from './constants.mjs'

export function setupLogDir() {
  if (!exists(LOG_DIR)) {
    mkdir(LOG_DIR)
  } else {
    readDir(LOG_DIR).forEach((file) => {
      unlink(joinPath(LOG_DIR, file))
    })
  }
}
