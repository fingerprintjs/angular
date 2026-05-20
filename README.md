<p align="center">
  <a href="https://fingerprint.com">
    <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://fingerprintjs.github.io/home/resources/logo_light.svg" />
     <source media="(prefers-color-scheme: light)" srcset="https://fingerprintjs.github.io/home/resources/logo_dark.svg" />
     <img src="https://fingerprintjs.github.io/home/resources/logo_dark.svg" alt="Fingerprint logo" width="312px" />
   </picture>
  </a>
<p align="center">
<a href="https://github.com/fingerprintjs/angular/actions/workflows/ci.yml">
  <img src="https://github.com/fingerprintjs/angular/actions/workflows/ci.yml/badge.svg" alt="CI badge" />
</a>
<a href="https://fingerprintjs.github.io/angular/coverage/">
 <img src="https://fingerprintjs.github.io/angular/coverage/badges.svg" alt="coverage">
</a>
<a href="https://www.npmjs.com/package/@fingerprint/angular">
  <img src="https://img.shields.io/npm/v/@fingerprint/angular.svg" alt="Current NPM version">
</a>
<a href="https://www.npmjs.com/package/@fingerprint/angular">
  <img src="https://img.shields.io/npm/dm/@fingerprint/angular.svg" alt="Monthly downloads from NPM">
</a>
<a href="https://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/:license-mit-blue.svg" alt="MIT license">
</a>
<a href="https://discord.gg/39EpE2neBg">
  <img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
</a>
<a href="https://fingerprintjs.github.io/angular/">
  <img src="https://img.shields.io/badge/-Documentation-green" alt="Documentation">
</a>

# Fingerprint Pro Angular

Fingerprint Pro Angular SDK is an easy way to integrate **[Fingerprint](https://fingerprint.com/)** into your Angular application. See the [`src` folder](https://github.com/fingerprintjs/fingerprintjs-pro-angular/tree/main/src) for a full usage example.

This SDK supports v4 of the Fingerprint JavaScript agent. See the [v3 to v4 migration guide](https://docs.fingerprint.com/reference/migrating-from-v3-to-v4) for more information.

## Table of contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Getting started](#getting-started)
- [Caching strategy](#caching-strategy)
- [Documentation](#documentation)
- [Support and feedback](#support-and-feedback)
- [License](#license)

## Requirements

The following dependencies are required:

- TypeScript >=4.6
- Node 16+
- Angular 15+

This package works with the commercial [Fingerprint platform](https://fingerprint.com/). It is not compatible with the source-available [FingerprintJS library](https://github.com/fingerprintjs/fingerprintjs). Learn more about the [differences between Fingerprint and FingerprintJS](https://fingerprint.com/github/).

## Installation

Using [npm](https://npmjs.org):

```sh
npm install @fingerprint/angular
```

Using [pnpm](https://pnpm.io/):

```sh
pnpm add @fingerprint/angular
```

Using [yarn](https://yarnpkg.com):

```sh
yarn add @fingerprint/angular
```

## Getting started

To identify visitors, you'll need a Fingerprint Pro account (you can [sign up for free](https://dashboard.fingerprint.com/signup/)).
To get your API key and get started, see the [Quick Start guide in our documentation](https://dev.fingerprint.com/docs/quick-start-guide).

1. Add `FingerprintModule.forRoot()` to the imports sections in your root application module and pass it the `startOptions` configuration object. You can specify multiple configuration options. Set a [region](https://dev.fingerprint.com/docs/regions) if you have chosen a non-global region during registration. Set `endpoints` if you are using [one of our proxy integrations to increase accuracy](https://dev.fingerprint.com/docs/protecting-the-javascript-agent-from-adblockers) and effectiveness of visitor identification.
   Read more about other [forRoot() parameters](#FingerprintModuleforroot-props) below.

```javascript
import { NgModule } from '@angular/core'
import { FingerprintModule, Fingerprint } from '@fingerprint/angular'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FingerprintModule.forRoot({
      startOptions: {
        apiKey: '<PUBLIC_API_KEY>',
        endpoints: ['https://metrics.yourwebsite.com'],
        // region: "eu"
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

2. Inject `FingerprintService` in your component's constructor. Now you can identify visitors using the `getVisitorData()` method.

```typescript
import { Component } from '@angular/core'
import { FingerprintService } from '@fingerprint/angular'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private FingerprintService: FingerprintService) {}
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  eventId = 'Press "Identify" button to get eventId'

  async onIdentifyButtonClick(): Promise<void> {
    const data = await this.FingerprintService.getVisitorData()
    //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    this.eventId = data.event_id
  }
}
```

## Server-side rendering (SSR) with Angular Universal

The library can be used with Angular Universal. Keep in mind that visitor identification is only possible in the browser, so your visitor identification code should only run client-side. See the example implementation for more details.

## Linking and tagging information

The `event_id` provided by Fingerprint Identification is especially useful when combined with information you already know about your users, for example, account IDs, order IDs, etc. To learn more about various applications of the `linkedId` and `tag`, see [Linking and tagging information](https://dev.fingerprint.com/docs/tagging-information).

Associate your data with an identification event using the `linkedId` or `tag` parameter of the options object passed into the `getVisitorData()` method:

```ts
// ...

import { Component } from '@angular/core'
import { FingerprintService } from '@fingerprint/angular'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private FingerprintService: FingerprintService) {}

  async onIdentifyButtonClick(): Promise<void> {
    const data = await this.FingerprintService.getVisitorData({
      linkedId: 'user_1234',
      tag: {
        userAction: 'login',
        analyticsId: 'UA-5555-1111-1',
      },
    })

    // ...
  }
}
```

## Caching strategy

Fingerprint Pro usage is billed per API call. To avoid unnecessary API calls, it is a good practice to [cache identification results](https://dev.fingerprint.com/docs/caching-visitor-information). By default, the SDK does not use caching.

- Specify `cache` on the `FingerprintModule.forRoot` props to enable and configure caching.
- For more details, see [Caching results](https://dev.fingerprint.com/docs/caching-visitor-information).

> [!NOTE]
> If you use data from [`extendedResult`](https://dev.fingerprint.com/reference/get-function#extendedresult), pay additional attention to your caching strategy.
> Some fields, for example, `ip` or `lastSeenAt`, might change over time for the same visitor. Use `getVisitorData({ ignoreCache: true })` to fetch the latest identification results.

## Documentation

This library uses Fingerprint Pro JavaScript agent under the hood. See our documentation for the full [JavaScript Agent API reference](https://dev.fingerprint.com/reference/javascript-agent).

### `FingerprintModule`

The module just initializes the Fingerprint Pro JS agent with start options and provides `FingerprintService` to DI.

#### `FingerprintModule.forRoot` props

`startOptions: Fingerprint.StartOptions`

Options for the FingerprintJS JS Pro agent `start()` method. Options follow the [agent's initialization properties](https://dev.fingerprint.com/reference/javascript-agent#start-options).

### `FingerprintService` methods

#### `getVisitorData(options?: GetOptions)`

This method performs identification requests with the FingerprintJS Pro API.

- `options: GetOptions` parameter follows the parameters of the FingerprintJS Pro's [`get` function](https://dev.fingerprint.com/reference/javascript-agent#get-options).

#### `collectData(options?: GetOptions)`

This method collects on demand fingerprint data.

- `options: GetOptions` parameter follows the parameters of the FingerprintJS Pro's [`collect` function](https://dev.fingerprint.com/reference/javascript-agent#collect-options).

## Demo application

This repository contains an example Angular application. To run the demo locally:

1. Clone the repository with `git clone git@github.com:fingerprintjs/angular.git`.
2. Inside the root folder, run `pnpm install` to install the dependencies.
3. Create a dev environment file with `cp src/environments/environment.ts src/environments/environment.dev.ts`, and inside, replace `FingerprintJS Pro public key` with your actual public key.
4. Run `pnpm generate:version` to create an SDK version file.
5. Run `pnpm start` to start the demo application. (The app will now use the internal library source directly).

The application will start on http://localhost:4200.

## Support and feedback

To ask questions or provide feedback, use [Issues](https://github.com/fingerprintjs/angular/issues). If you need private support, please email us at `oss-support@fingerprint.com`. If you'd like to have a similar Angular wrapper for the [source-available FingerprintJS](https://github.com/fingerprintjs/fingerprintjs), consider creating an issue in the main [FingerprintJS repository](https://github.com/fingerprintjs/fingerprintjs/issues).

## API Reference

See the full [generated API reference](https://fingerprintjs.github.io/angular/docs).

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/fingerprintjs/angular/blob/main/LICENSE) file for more info.
