import { Component, inject, signal, OnInit } from '@angular/core'
import { Fingerprint, FingerprintService } from '@fingerprint/angular'

@Component({
  selector: 'app-preloaded',
  templateUrl: './preloaded.html',
  styleUrl: './preloaded.css',
})
export class PreloadedComponent implements OnInit {
  private fingerprintService = inject(FingerprintService)

  eventId = signal('Loading eventId...')

  ngOnInit(): void {
    this.onClearCacheClick()
    this.fingerprintService
      .getVisitorData()
      .then((visitorData: Fingerprint.GetResult) => this.eventId.set(visitorData.event_id))
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
  }
}
