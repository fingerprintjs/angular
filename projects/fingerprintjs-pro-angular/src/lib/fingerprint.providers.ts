import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { FINGERPRINT_ANGULAR_SETTINGS_TOKEN } from './tokens/fingerprint-angular-settings-token'
import { FingerprintSettings } from './interfaces/fingerprint-settings'

/**
 * Provides Fingerprint configuration for standalone Angular applications.
 *
 * Use this in `bootstrapApplication` or `ApplicationConfig` providers array.
 *
 * @example ```typescript
 * import { ApplicationConfig } from '@angular/core';
 * import { provideFingerprint } from '@fingerprint/angular';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideFingerprint({ startOptions: { apiKey: 'your-fp-public-api-key' } })
 *   ]
 * };
 * ```
 */
export function provideFingerprint(settings: FingerprintSettings): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: FINGERPRINT_ANGULAR_SETTINGS_TOKEN,
      useValue: settings,
    },
  ])
}
