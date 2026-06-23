import { Component, inject, signal, OnInit } from '@angular/core'
import { Fingerprint, FingerprintService } from '@fingerprint/angular'

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private fingerprintService = inject(FingerprintService)

  eventId = signal('Press "Identify" button to get eventId')
  result = signal<Fingerprint.GetResult | null>(null)

  ngOnInit(): void {
    this.onClearCacheClick()
  }

  get resultJSON() {
    return JSON.stringify(this.result(), null, 2)
  }

  async onButtonClick(): Promise<void> {
    try {
      const data = await this.fingerprintService.getVisitorData()
      this.eventId.set(data.event_id)
      this.result.set(data)
    } catch (error) {
      if (error instanceof Error) {
        this.eventId.set(`${error.name}: ${error.message}`)
        this.result.set(null)
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

    this.eventId.set('Press button to get eventId again')
    this.result.set(null)
  }
}
