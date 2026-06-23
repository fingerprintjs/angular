import { exec } from '../command.mjs'
import { PNPM_STORE_DIR } from '../constants.mjs'

export function ensurePnpm() {
  try {
    exec('pnpm --version', { stdio: 'ignore' })
  } catch (e) {
    console.log('pnpm not found, installing...')
    exec('npm install -g pnpm', { stdio: 'inherit' })
  }
  exec(`pnpm config set store-dir "${PNPM_STORE_DIR}"`, { stdio: 'inherit' })
}
