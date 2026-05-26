import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideFingerprint } from '@fingerprint/angular'
import { environment } from '../environments/environment'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFingerprint({
      startOptions: {
        apiKey: environment.fingerprintPublicKey,
        cache: {
          storage: 'localStorage',
          cachePrefix: 'demo_cache_',
          duration: 'optimize-cost',
        },
      },
    }),
  ],
}
