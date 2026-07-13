export interface AngularVersionMetadata {
  zone: string
  jpa: string
  jest: string
  typesJest?: string
}

export const angularMetadata: Record<string, AngularVersionMetadata> = {
  15: { zone: '~0.11.4', jpa: '^13.1.4', jest: '^29.0.0' },
  16: { zone: '~0.13.3', jpa: '^13.1.4', jest: '^29.0.0' },
  17: { zone: '~0.14.4', jpa: '^14.1.1', jest: '^29.0.0' },
  18: { zone: '~0.14.4', jpa: '^14.1.1', jest: '^29.0.0' },
  19: { zone: '~0.15.0', jpa: '^14.4.2', jest: '^29.0.0' },
  20: { zone: '~0.15.0', jpa: '^15.0.0', jest: '^30.2.0', typesJest: '^30.0.0' },
  21: { zone: '~0.16.0', jpa: '^17.0.0', jest: '^30.2.0', typesJest: '^30.0.0' },
}
