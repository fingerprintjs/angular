---
'@fingerprint/angular': minor
---

Add `provideFingerprint` function for [standalone Angular applications](https://angular.dev/reference/migrations/standalone) (Angular 15+).

This allows configuring the SDK without `NgModule` in `bootstrapApplication` or `ApplicationConfig`:

```typescript
import { provideFingerprint } from '@fingerprint/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFingerprint({ startOptions: { apiKey: 'your-api-key' } })
  ]
};
```

`FingerprintModule.forRoot()` remains available for NgModule-based applications.
