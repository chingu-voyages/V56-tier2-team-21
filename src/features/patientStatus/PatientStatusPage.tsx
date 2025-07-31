import React, { useState } from 'react';
import PatientStatusModal from './PatientStatusModal';
import PatientStatusBoard from './PatientStatusBoard';
import { LoginForm } from '../../components/login-form';
import { useAuth } from "../../features/auth/AuthContext";

const STORAGE_KEY = 'patientStatusBoardData';

export type PatientStatus = "Checked In" | "Pre-Procedure" | "In-progress" | "Closing" | "Recovery" | "Complete" | "Dismissal";

export interface Patient {
  id: string;
  number: string;
  name: string;
  status: PatientStatus;
}


const PatientStatusPage: React.FC = () => {
  const { isSurgeryTeam } = useAuth();
  console.log('isSurgeryTeam in PatientStatusPage', isSurgeryTeam);
  // Add form state (independent)
  const [addName, setAddName] = useState('');
  const [addError, setAddError] = useState('');
  // Search form state (independent)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Get patients from localStorage
  const getPatients = (): Patient[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Add patient only (no update)
  const handlePatientSubmit = (patient: Patient) => {
    let patients = getPatients();
    patients.push(patient);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    setAddName('');
    setAddError('');
  };

  // Search by number or name (independent state)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const patients = getPatients();
    const query = searchQuery.trim().toLowerCase();
    let results = patients.filter(p =>
      p.number === query ||
      p.name.toLowerCase().includes(query)
    );
    setSearchResults(results.length > 0 ? results : []);
  };

  // Open modal for editing
  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  // Update patient from modal
  const handleUpdatePatient = (updatedPatient: Patient) => {
    let patients = getPatients();
    const idx = patients.findIndex(p => p.id === updatedPatient.id);
    if (idx > -1) {
      patients[idx] = { ...patients[idx], ...updatedPatient };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    }
    setEditingPatient(null);
    setModalOpen(false);
  };

  // Only use number state for editing
  // const [name, setName] = useState(existingPatient?.name || '');
  // const [status, setStatus] = useState<PatientStatus>(existingPatient?.status || 'Checked In');

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
    // const patientName = existingPatient ? existingPatient.name : name;
    // if (!patientName) return;
    // let number: string;
    // if (existingPatient) {
    //   number = existingPatient.number;
    // } else {
    //   // Get all existing patient numbers from localStorage
    //   const data = localStorage.getItem('patientStatusBoardData');
    //   const patients = data ? JSON.parse(data) : [];
    //   const existingNumbers = new Set<string>(patients.map((p: any) => p.number));
    //   number = generateNextPatientNumber(existingNumbers);
    // }
    // const id = existingPatient?.id || Math.random().toString(36).substr(2, 6).toUpperCase();
    // onSubmit({ id, number, name: patientName, status });
    // setName('');
    // setStatus('Checked In');
  };

  return (
    <div>
      {!isSurgeryTeam ? (
        <LoginForm />
      ) : (
        <>
          <div className='flex items-center justify-end'>
            {/* <AddPatients
              onSubmit={handlePatientSubmit}
              existingPatient={undefined}
              addError={addError}
            /> */}
            <div className="mb-3 flex gap-8">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer" onClick={handleSubmit}>
                Add
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter patient number or name"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer" onClick={handleSearch}>Search</button>
            </div>
            {/* Search Results */}
            {searchResults && (
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-md font-semibold mb-2">Search Results</h3>
                {searchResults.length === 0 ? (
                  <div className="text-red-500">Result not found</div>
                ) : (
                  <PatientStatusBoard isGuest={false} patients={searchResults} />
                )}
              </div>
            )}
          </div>
          {/* Main Patient Board */}
          <PatientStatusBoard isGuest={false} />

          {/* Edit Modal */}
          {editingPatient && (
            <PatientStatusModal
              open={modalOpen}
              onClose={() => { setModalOpen(false); setEditingPatient(null); }}
              onSubmit={handleUpdatePatient}
              existingPatient={editingPatient}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PatientStatusPage;
