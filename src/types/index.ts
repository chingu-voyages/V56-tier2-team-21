export type PatientStatus =
  | 'Checked In'
  | 'Pre-Procedure'
  | 'In-progress'
  | 'Closing'
  | 'Recovery'
  | 'Complete'
  | 'Dismissal';

export interface PatientInfo {
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  state:string;
  streetAddress: string;
  city: string;
  telephone: number;
  contactEmail: string;
  status: string;
}