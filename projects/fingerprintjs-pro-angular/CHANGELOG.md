# @fingerprint/angular

## 3.0.0

### Major Changes

- Introduce Fingerprint Agent API v4.

  New package name is `@fingerprint/angular`.

  This version removes the dependency on `@fingerprintjs/fingerprintjs-pro-spa` and uses `@fingerprint/agent` directly.
  Caching is no longer enabled by default. To enable caching, you must configure it in the `startOptions` of the module.

  The `clearCache` method has been removed from the `FingerprintService`. If you need to clear the cache manually, you should do it by directly interacting with the storage you configured.

  > ⚠️This is a **breaking change**. Caching is no longer enabled by default.

  ### Why enable caching?

  Caching is essential for:

  - **Reducing API usage**: By storing visitor data locally, you avoid redundant calls to the Fingerprint API for the same visitor session.
  - **Improving performance**: Cached data is returned instantly, resulting in a faster user experience.
  - **Lowering costs**: If caching is not enabled manually after the upgrade, it will result in increased API usage on your Fingerprint Dashboard, which may increase your costs.

  ### Examples

  #### Enabling session storage caching

  ```typescript
  FingerprintModule.forRoot({
    startOptions: {
      apiKey: 'your-fp-public-api-key',
      cache: {
        storage: 'sessionStorage',
        duration: 'optimize-cost',
      },
    },
  })
  ```

  #### Enabling local storage caching

  ```typescript
  FingerprintModule.forRoot({
    startOptions: {
      apiKey: 'your-fp-public-api-key',
      cache: {
        storage: 'localStorage',
      },
    },
  })
  ```

  For more information, see the [Fingerprint Agent documentation](https://docs.fingerprint.com/docs/identify-visitors#caching-the-visitor-id). ([77b9ef3](https://github.com/fingerprintjs/angular/commit/77b9ef3ce60a0a66bb82848337350f2f9cf77b24))

### Minor Changes

- Add `provideFingerprint` function for [standalone Angular applications](https://angular.dev/reference/migrations/standalone) (Angular 15+).

  This allows configuring the SDK without `NgModule`, using `bootstrapApplication` or `ApplicationConfig`:

  ```typescript
  import { provideFingerprint } from '@fingerprint/angular'

  export const appConfig: ApplicationConfig = {
    providers: [provideFingerprint({ startOptions: { apiKey: 'your-api-key' } })],
  }
  ```

  `FingerprintModule.forRoot()` remains available for NgModule-based applications. ([fbf3eb8](https://github.com/fingerprintjs/angular/commit/fbf3eb8f3197b795398b68e9326f084a17cad053))

## 3.0.0-test.4

### Minor Changes

- Add `provideFingerprint` function for [standalone Angular applications](https://angular.dev/reference/migrations/standalone) (Angular 15+).

  This allows configuring the SDK without `NgModule`, using `bootstrapApplication` or `ApplicationConfig`:

  ```typescript
  import { provideFingerprint } from '@fingerprint/angular'

  export const appConfig: ApplicationConfig = {
    providers: [provideFingerprint({ startOptions: { apiKey: 'your-api-key' } })],
  }
  ```

  `FingerprintModule.forRoot()` remains available for NgModule-based applications. ([fbf3eb8](https://github.com/fingerprintjs/angular/commit/fbf3eb8f3197b795398b68e9326f084a17cad053))

## 3.0.0-test.3

### Patch Changes

- Put `tslib` back into dependencies as `ng-packagr` adds it as a part of the build ([51fade4](https://github.com/fingerprintjs/angular/commit/51fade4a4c6c26a8ac9ed50bab6da486f54fa23e))

## 3.0.0-test.2

### Patch Changes

- Remove unused `tslib` dependency. ([f136ff4](https://github.com/fingerprintjs/angular/commit/f136ff46b29eeb8733b2eab924523aa0ff187c6f))

## 3.0.0-test.1

### Patch Changes

- Fix release pipeline to publish from `dist/fingerprintjs-pro-angular` instead of the source `projects/` directory. ([edeea86](https://github.com/fingerprintjs/angular/commit/edeea86a95235098612877910ba5ba8a74abf115))

## 3.0.0-test.0

### Major Changes

- Introduce Fingerprint Agent API v4.

  New package name is `@fingerprint/angular`.

  This version removes the dependency on `@fingerprintjs/fingerprintjs-pro-spa` and uses `@fingerprint/agent` directly.
  Caching is no longer enabled by default. To enable caching, you must configure it in the `startOptions` of the module.

  The `clearCache` method has been removed from the `FingerprintService`. If you need to clear the cache manually, you should do it by directly interacting with the storage you configured.

  > ⚠️This is a **breaking change**. Caching is no longer enabled by default.

  ### Why enable caching?

  Caching is essential for:

  - **Reducing API usage**: By storing visitor data locally, you avoid redundant calls to the Fingerprint API for the same visitor session.
  - **Improving performance**: Cached data is returned instantly, resulting in a faster user experience.
  - **Lowering costs**: If caching is not enabled manually after the upgrade, it will result in increased API usage on your Fingerprint Dashboard, which may increase your costs.

  ### Examples

  #### Enabling session storage caching

  ```typescript
  FingerprintModule.forRoot({
    startOptions: {
      apiKey: 'your-fp-public-api-key',
      cache: {
        storage: 'sessionStorage',
        duration: 'optimize-cost',
      },
    },
  })
  ```

  #### Enabling local storage caching

  ```typescript
  FingerprintModule.forRoot({
    startOptions: {
      apiKey: 'your-fp-public-api-key',
      cache: {
        storage: 'localStorage',
      },
    },
  })
  ```

  For more information, see the [Fingerprint Agent documentation](https://docs.fingerprint.com/docs/identify-visitors#caching-the-visitor-id). ([77b9ef3](https://github.com/fingerprintjs/angular/commit/77b9ef3ce60a0a66bb82848337350f2f9cf77b24))
