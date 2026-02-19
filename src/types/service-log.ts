export type ServiceType = 'planned' | 'unplanned' | 'emergency';

export interface ServiceLog {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
  draft: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DraftFormData = Omit<
  ServiceLog,
  'id' | 'createdAt' | 'updatedAt' | 'draft'
>;
