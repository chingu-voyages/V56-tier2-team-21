import React, { useState } from 'react';

export type PatientStatus = "Checked In" | "Pre-Procedure" | "In-progress" | "Closing" | "Recovery" | "Complete" | "Dismissal";

export interface Patient {
  id: string;
  number: string;
  name: string;
  status: PatientStatus;
}

interface PatientStatusFormProps {
  onSubmit: (patient: Patient) => void;
  existingPatient?: Patient;
  onNumberChange?: (num: number) => void;
  addError?: string;
}

const statusOptions: PatientStatus[] = ["Checked In", "Pre-Procedure", "In-progress", "Closing", "Recovery", "Complete", "Dismissal"];

const AddPatients: React.FC<PatientStatusFormProps> = ({ onSubmit, existingPatient, onNumberChange, addError }) => {
  // Only use number state for editing
  const [name, setName] = useState(existingPatient?.name || '');
  const [status, setStatus] = useState<PatientStatus>(existingPatient?.status || 'Checked In');

  // Helper to generate the next patient number as a string of digits
  function generateNextPatientNumber(existingNumbers: Set<string>): string {
    // Convert all to numbers, ignore non-numeric
    const nums = Array.from(existingNumbers)
      .map(n => parseInt(n, 10))
      .filter(n => !isNaN(n));
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return (max + 1).toString();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientName = existingPatient ? existingPatient.name : name;
    if (!patientName) return;
    let number: string;
    if (existingPatient) {
      number = existingPatient.number;
    } else {
      // Get all existing patient numbers from localStorage
      const data = localStorage.getItem('patientStatusBoardData');
      const patients = data ? JSON.parse(data) : [];
      const existingNumbers = new Set<string>(patients.map((p: any) => p.number));
      number = generateNextPatientNumber(existingNumbers);
    }
    const id = existingPatient?.id || Math.random().toString(36).substr(2, 6).toUpperCase();
    onSubmit({ id, number, name: patientName, status });
    setName('');
    setStatus('Checked In');
  };

  return (
    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transitio" onClick={handleSubmit}>
      Add
    </button>
  );
};

export default AddPatients;
