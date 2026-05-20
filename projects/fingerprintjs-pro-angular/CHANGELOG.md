# @fingerprint/angular

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
