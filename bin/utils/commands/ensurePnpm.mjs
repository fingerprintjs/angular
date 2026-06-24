import { exec } from '../command.mjs'
import { PNPM_STORE_DIR } from '../constants.mjs'

export function ensurePnpm() {
  try {
    exec('pnpm --version', { stdio: 'ignore' })
  } catch (e) {
    throw new Error('pnpm not found')
  }
  exec(`pnpm config set store-dir "${PNPM_STORE_DIR}"`, { stdio: 'inherit' })
}
