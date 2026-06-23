import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideFingerprint } from '@fingerprint/angular'
import { environment } from '../environments/environment'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
