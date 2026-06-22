import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { environment } from 'src/environments/environment'
import { FingerprintModule } from '@fingerprint/angular'
import { PreloadedComponent } from './preloaded/preloaded.component'

@NgModule({
  declarations: [AppComponent, HomeComponent, PreloadedComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FingerprintModule.forRoot({
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
