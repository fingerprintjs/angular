import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core'
import { FingerprintModule } from '@fingerprint/angular'
import { environment } from '../environments/environment'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    importProvidersFrom(
      FingerprintModule.forRoot({
        startOptions: {
          apiKey: environment.fingerprintJsProPublicKey,
          cache: {
            storage: 'localStorage',
            cachePrefix: 'demo_cache_',
            duration: 'optimize-cost',
          },
        },
      })
    ),
  ],
}
