import { Component } from '@angular/core'
import { FingerprintService } from '@fingerprint/angular'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'demo-angular15'
  visitorId = ''

  constructor(private readonly fingerprint: FingerprintService) {}

  async identify(): Promise<void> {
    const data = await this.fingerprint.getVisitorData()
    this.visitorId = data.visitor_id ?? ''
  }
}
