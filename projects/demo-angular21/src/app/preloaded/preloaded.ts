import { Component, inject, signal } from '@angular/core'
import { Fingerprint, FingerprintService } from '@fingerprint/angular'

@Component({
  selector: 'app-preloaded',
  templateUrl: './preloaded.html',
  styleUrl: './preloaded.css',
})
export class PreloadedComponent {
  private fingerprintService = inject(FingerprintService)

  eventId = signal('Loading eventId...')

  constructor() {
    this.fingerprintService
      .getVisitorData()
      .then((visitorData: Fingerprint.GetResult) => this.eventId.set(visitorData.event_id))
  }
}
