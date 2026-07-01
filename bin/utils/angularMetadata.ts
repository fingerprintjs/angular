export interface AngularVersionMetadata {
  typescript: string
  zone: string
  jpa: string
  jest: string
  typesJest?: string
}

export const angularMetadata: Record<string, AngularVersionMetadata> = {
  15: { typescript: '~4.9.5', zone: '~0.11.4', jpa: '^13.1.4', jest: '^29.0.0' },
  16: { typescript: '~5.1.6', zone: '~0.13.3', jpa: '^13.1.4', jest: '^29.0.0' },
  17: { typescript: '~5.2.2', zone: '~0.14.4', jpa: '^14.1.1', jest: '^29.0.0' },
  18: { typescript: '~5.4.5', zone: '~0.14.4', jpa: '^14.1.1', jest: '^29.0.0' },
  19: { typescript: '~5.6.3', zone: '~0.15.0', jpa: '^14.4.2', jest: '^29.0.0' },
  20: { typescript: '~5.8.3', zone: '~0.15.0', jpa: '^15.0.0', jest: '^30.2.0', typesJest: '^30.0.0' },
  21: { typescript: '~5.9.2', zone: '~0.16.0', jpa: '^17.0.0', jest: '^30.2.0', typesJest: '^30.0.0' },
}
