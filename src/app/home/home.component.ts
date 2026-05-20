import { Component } from '@angular/core'
import { FingerprintService, Fingerprint } from '@fingerprint/angular'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private FingerprintService: FingerprintService) {}

  eventId = 'Press "Identify" button to get eventId'
  result: Fingerprint.GetResult | null = null

  get resultJSON() {
    return JSON.stringify(this.result, null, 2)
  }

  async onButtonClick(): Promise<void> {
    try {
      const data = await this.FingerprintService.getVisitorData()
      this.eventId = data.event_id
      this.result = data
    } catch (error) {
      if (error instanceof Error) {
        this.eventId = `${error.name}: ${error.message}`
        this.result = null
      }
    }
  }

  onClearCacheClick() {
    const prefix = 'demo_cache_'
    const storageEngine = window.localStorage
    if (storageEngine) {
      for (let i = 0; i < storageEngine.length; i++) {
        const key = storageEngine.key(i)
        if (key?.startsWith(prefix)) {
          storageEngine.removeItem(key)
          i--
        }
      }
    }

    this.eventId = 'Press button to get eventId again'
    this.result = null
  }
}
