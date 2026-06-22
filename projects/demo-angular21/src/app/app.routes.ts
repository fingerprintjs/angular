import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { PreloadedComponent } from './preloaded/preloaded';
import { LandingComponent } from './landing/landing';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'preloaded', component: PreloadedComponent },
];
