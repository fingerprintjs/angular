import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import * as Fingerprint from '@fingerprint/agent'
import { packageVersion } from './version'
import { FingerprintSettings } from './interfaces/fingerprint-settings'
import { FINGERPRINT_ANGULAR_SETTINGS_TOKEN } from './tokens/fingerprint-angular-settings-token'

/**
 * Inject FingerprintService and use it to make identification requests.
 *
 * @example ```typescript
 * import { Component, OnInit } from '@angular/core';
 * import { FingerprintService } from '@fingerprint/angular';
 *
 * @Component({
 *   selector: 'app-home',
 *   templateUrl: './home.component.html',
 *   styleUrls: ['./home.component.css']
 * })
 * export class HomeComponent implements OnInit {
 *
 *   constructor(private FingerprintService: FingerprintService) { }
 *
 *   eventId = 'Press "Identify" button to get eventId';
 *
 *   async onIdentifyButtonClick() : Promise<void> {
 *     const data = await this.FingerprintService.getVisitorData();
 *     this.eventId = data.event_id;
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class FingerprintService {
  private readonly publicAgent: Fingerprint.Agent | undefined
  private readonly settings: FingerprintSettings

  constructor(
    @Inject(FINGERPRINT_ANGULAR_SETTINGS_TOKEN) settings: FingerprintSettings,
    @Inject(PLATFORM_ID) private readonly platformId: any
  ) {
    this.settings = settings
    if (isPlatformBrowser(this.platformId)) {
      const { startOptions } = settings
      const integrationInfo = startOptions.integrationInfo || []
      this.publicAgent = Fingerprint.start({
        ...startOptions,
        integrationInfo: [...integrationInfo, `angular/${packageVersion}`],
      })
    }
  }

  getVisitorData(getDataOptions?: Fingerprint.GetOptions): Promise<Fingerprint.GetResult> {
    if (!this.publicAgent) {
      return Promise.reject(new Error('Fingerprint agent is not initialized on this platform'))
    }
    return this.publicAgent.get(getDataOptions)
  }

  collectData(collectOptions?: Fingerprint.GetOptions): Promise<string> {
    if (!this.publicAgent) {
      return Promise.reject(new Error('Fingerprint agent is not initialized on this platform'))
    }
    return this.publicAgent.collect(collectOptions)
  }
}
