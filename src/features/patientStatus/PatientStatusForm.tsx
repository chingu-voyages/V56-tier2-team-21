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

const PatientStatusForm: React.FC<PatientStatusFormProps> = ({ onSubmit, existingPatient, onNumberChange, addError }) => {
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded-xl">
      {/* <h2 className="text-lg font-bold mb-4">{existingPatient ? 'Update' : 'Add'} Patient Status</h2> */}
      {addError ? (
        <div className="mb-3 text-red-600 font-semibold">{addError}</div>
      ) : (
        <>
          {/* <div className="mb-3">
            <label className="block mb-1">Patient Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              disabled={!!existingPatient}
              required={!existingPatient}
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as PatientStatus)}
              className="w-full px-3 py-2 border rounded"
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div> */}
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            {/* {existingPatient ? 'Update' : 'Add'} */}
            Add
          </button>
        </>
      )}
    </form>
  );
};

export default PatientStatusForm;
