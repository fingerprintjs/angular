---
'@fingerprint/angular': minor
---

Add `provideFingerprint` function for standalone Angular applications (Angular 14+).

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
