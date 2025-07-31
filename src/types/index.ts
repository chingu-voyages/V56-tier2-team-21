export type PatientStatus = "Checked In" | "Pre-Procedure" | "In-progress" | "Closing" | "Recovery" | "Complete" | "Dismissal";

export interface Patient {
  id: string;
  number: string;
  name: string;
  status: PatientStatus;
}

export interface PatientInfo {
  firstName: string;
  lastName: string;
  state:string;
  streetAddress: string;
  city: string;
  telephone: string;
  contactEmail: string;
}