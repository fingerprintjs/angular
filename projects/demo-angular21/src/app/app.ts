import { Component } from '@angular/core'
import { HomeComponent } from './home/home'
import { PreloadedComponent } from './preloaded/preloaded'

@Component({
  selector: 'app-root',
  imports: [HomeComponent, PreloadedComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {}
