import { Component } from '@angular/core'

@Component({
  selector: 'app-landing',
  template: `
    <div class="landing-container">
      <h1>Welcome to Fingerprint Demo</h1>
      <div class="nav-buttons">
        <button routerLink="/home" class="nav-button">Home Page (Identify & Clear Cache)</button>
        <button routerLink="/preloaded" class="nav-button">Preload Page</button>
      </div>
    </div>
  `,
  styles: [
    `
      .landing-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80vh;
        text-align: center;
      }
      .nav-buttons {
        display: flex;
        gap: 20px;
        margin-top: 20px;
      }
      .nav-button {
        padding: 15px 25px;
        font-size: 16px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s;
      }
      .nav-button:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class LandingComponent {}
