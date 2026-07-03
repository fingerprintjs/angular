import * as publicApi from './public-api'
import { FingerprintService } from './lib/fingerprint.service'
import { FingerprintModule } from './lib/fingerprint.module'
import { provideFingerprint } from './lib/fingerprint.providers'
import { FINGERPRINT_ANGULAR_SETTINGS_TOKEN } from './lib/tokens/fingerprint-angular-settings-token'

describe('public-api', () => {
  it('should export the expected symbols', () => {
    expect(publicApi.FingerprintService).toBe(FingerprintService)
    expect(publicApi.FingerprintModule).toBe(FingerprintModule)
    expect(publicApi.provideFingerprint).toBe(provideFingerprint)
    expect(publicApi.FINGERPRINT_ANGULAR_SETTINGS_TOKEN).toBe(FINGERPRINT_ANGULAR_SETTINGS_TOKEN)
    expect(publicApi.Fingerprint).toBeDefined()
  })
})
