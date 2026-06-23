import { Component, OnInit } from '@angular/core'
import { Fingerprint, FingerprintService } from '@fingerprint/angular'

@Component({
  selector: 'app-preloaded',
  templateUrl: './preloaded.component.html',
  styleUrls: ['./preloaded.component.css'],
})
export class PreloadedComponent implements OnInit {
  constructor(private FingerprintService: FingerprintService) {}

  eventId = 'Loading eventId...'

  ngOnInit(): void {
    this.onClearCacheClick()
    this.FingerprintService.getVisitorData().then(
      (visitorData: Fingerprint.GetResult) => (this.eventId = visitorData.event_id)
    )
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
