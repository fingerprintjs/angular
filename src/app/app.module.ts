import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { LandingComponent } from './landing/landing.component'
import { environment } from 'src/environments/environment'
import { FingerprintModule } from '@fingerprint/angular'
import { PreloadedComponent } from './preloaded/preloaded.component'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'preloaded', component: PreloadedComponent },
]

@NgModule({
  declarations: [AppComponent, HomeComponent, PreloadedComponent, LandingComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RouterModule.forRoot(routes),
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
