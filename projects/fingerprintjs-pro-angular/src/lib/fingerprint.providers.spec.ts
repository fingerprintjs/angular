import { TestBed } from '@angular/core/testing'

import { FingerprintService } from './fingerprint.service'
import { provideFingerprint } from './fingerprint.providers'

import { Fingerprint } from '../public-api'
import { packageVersion } from './version'

const plainStartOptions = {
  apiKey: 'test_api_key',
}

const fullOptions: Fingerprint.StartOptions = {
  ...plainStartOptions,
  cache: {
    duration: 30,
    cachePrefix: 'test_cache_',
    storage: 'sessionStorage',
  },
  region: 'eu',
}

jest.mock('@fingerprint/agent', () => {
  return {
    ...(jest.requireActual('@fingerprint/agent') as any),
    start: jest.fn(() => {
      return {
        get: jest.fn(),
        collect: jest.fn(),
      }
    }),
    handleAgentData: jest.fn(),
    isFingerprintError: jest.fn(),
    withoutDefault: jest.fn(),
  }
})

describe('provideFingerprint', () => {
  let service: FingerprintService
  let fingerprintAgent: any

  beforeEach(() => {
    fingerprintAgent = require('@fingerprint/agent')
    jest.clearAllMocks()
    TestBed.resetTestingModule()
  })

  it('should create FingerprintService', () => {
    TestBed.configureTestingModule({
      providers: [provideFingerprint({ startOptions: fullOptions })],
    })
    service = TestBed.inject(FingerprintService)
    expect(service).toBeTruthy()
  })

  it('should call Fingerprint.start with provided options', () => {
    TestBed.configureTestingModule({
      providers: [provideFingerprint({ startOptions: fullOptions })],
    })
    service = TestBed.inject(FingerprintService)

    expect(fingerprintAgent.start).toHaveBeenCalledWith({
      ...fullOptions,
      integrationInfo: [`angular/${packageVersion}`],
    })
  })

  it('should call Fingerprint.start with custom integrationInfo', () => {
    const optionsWithIntegration: Fingerprint.StartOptions = {
      ...fullOptions,
      integrationInfo: ['custom-integration'],
    }
    TestBed.configureTestingModule({
      providers: [provideFingerprint({ startOptions: optionsWithIntegration })],
    })
    service = TestBed.inject(FingerprintService)

    expect(fingerprintAgent.start).toHaveBeenCalledWith({
      ...optionsWithIntegration,
      integrationInfo: ['custom-integration', `angular/${packageVersion}`],
    })
  })

  it('should call getVisitorData via provider-configured service', async () => {
    TestBed.configureTestingModule({
      providers: [provideFingerprint({ startOptions: fullOptions })],
    })
    service = TestBed.inject(FingerprintService)

    const agent = (fingerprintAgent.start as jest.Mock).mock.results[0].value
    await service.getVisitorData({ linkedId: 'test' })
    expect(agent.get).toHaveBeenCalledWith({ linkedId: 'test' })
  })
})
