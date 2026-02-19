import type { ServiceType } from '../types/service-log.ts';

export const serviceTypes: { value: ServiceType; label: string }[] = [
  { value: 'planned', label: 'Planned' },
  { value: 'unplanned', label: 'Unplanned' },
  { value: 'emergency', label: 'Emergency' },
];
