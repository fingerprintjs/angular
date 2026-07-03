import { TestBed } from '@angular/core/testing'
import { FINGERPRINT_ANGULAR_SETTINGS_TOKEN } from './fingerprint-angular-settings-token'

describe('FINGERPRINT_ANGULAR_SETTINGS_TOKEN', () => {
  it('should have a default value', () => {
    TestBed.configureTestingModule({
      providers: [],
    })
    const settings = TestBed.inject(FINGERPRINT_ANGULAR_SETTINGS_TOKEN)
    expect(settings).toEqual({ startOptions: { apiKey: '' } })
  })
})
