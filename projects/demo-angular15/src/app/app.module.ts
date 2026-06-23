import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FingerprintModule } from '@fingerprint/angular'

import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FingerprintModule.forRoot({
      startOptions: {
        apiKey: 'test-public-api-key',
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
