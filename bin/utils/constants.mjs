import path from 'path'

export const LIB_NAME = 'fingerprintjs-pro-angular'
export const VERSIONS = ['15', '16', '17', '18', '19', '20', '21']

export const ROOT_DIR = process.cwd()
export const PNPM_STORE_DIR = path.join(ROOT_DIR, '.pnpm-store')

export const SOURCE_PROJECT_DIR = path.join(ROOT_DIR, 'projects', LIB_NAME)
export const SOURCE_LIB_DIR = path.join(SOURCE_PROJECT_DIR, 'src', 'lib')
export const SOURCE_PUBLIC_API = path.join(SOURCE_PROJECT_DIR, 'src', 'public-api.ts')
export const SOURCE_TEST_TS = path.join(ROOT_DIR, 'test.ts')
export const SOURCE_JEST_CONFIG = path.join(ROOT_DIR, 'jest.config.js')
export const SOURCE_ROOT_TSCONFIG = path.join(ROOT_DIR, 'tsconfig.json')
export const SOURCE_ROOT_TSCONFIG_SPEC = path.join(ROOT_DIR, 'tsconfig.spec.json')

export const LOG_DIR = path.join(ROOT_DIR, 'test-logs')
