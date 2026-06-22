import { ModuleWithProviders, NgModule } from '@angular/core'
import { FINGERPRINT_ANGULAR_SETTINGS_TOKEN } from './tokens/fingerprint-angular-settings-token'
import { FingerprintSettings } from './interfaces/fingerprint-settings'

/**
 * Include FingerprintModule using `forRoot` method.
 *
 * @example ```typescript
 * import { NgModule } from '@angular/core';
 * import { FingerprintModule } from '@fingerprint/angular';
 * // ...
 *
 * @NgModule({
 *   declarations: [AppComponent],
 *   imports: [
 *     BrowserModule,
 *     FingerprintModule.forRoot({startOptions: {apiKey: 'your-fp-public-api-key'}})
 *   ],
 *   providers: [],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
 */
@NgModule()
export class FingerprintModule {
  static forRoot(settings: FingerprintSettings): ModuleWithProviders<FingerprintModule> {
    return {
      ngModule: FingerprintModule,
      providers: [
        {
          provide: FINGERPRINT_ANGULAR_SETTINGS_TOKEN,
          useValue: settings,
        },
      ],
    }
  }
}
