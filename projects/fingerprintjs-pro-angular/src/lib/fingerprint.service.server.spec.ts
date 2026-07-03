import { TestBed } from '@angular/core/testing'
import { FingerprintService } from './fingerprint.service'
import { PLATFORM_ID } from '@angular/core'
import { FINGERPRINT_ANGULAR_SETTINGS_TOKEN } from './tokens/fingerprint-angular-settings-token'

describe('FingerprintService (Server)', () => {
  let service: FingerprintService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FingerprintService,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: FINGERPRINT_ANGULAR_SETTINGS_TOKEN, useValue: { startOptions: { apiKey: 'test' } } },
      ],
    })
    service = TestBed.inject(FingerprintService)
  })

  it('should reject getVisitorData on non-browser platform', async () => {
    await expect(service.getVisitorData()).rejects.toThrow('Fingerprint agent is not initialized on this platform')
  })

  it('should reject collectData on non-browser platform', async () => {
    await expect(service.collectData()).rejects.toThrow('Fingerprint agent is not initialized on this platform')
  })
})
