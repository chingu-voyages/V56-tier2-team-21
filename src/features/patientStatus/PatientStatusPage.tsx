import React, { useState } from 'react';
import PatientStatusForm from './PatientStatusForm';
import PatientStatusModal from './PatientStatusModal';
import type { Patient } from './PatientStatusBoard';
import PatientStatusBoard from './PatientStatusBoard';
import Header from '../../components/Header';
import { LoginForm } from '../../components/login-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../features/auth/AuthContext";

const STORAGE_KEY = 'patientStatusBoardData';

const PatientStatusPage: React.FC = () => {
  // Remove local loggedIn state
  // const [loggedIn, setLoggedIn] = useState(false);
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
  const navigate = useNavigate();

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

  return (
    <div>
      {!isSurgeryTeam ? (
        <LoginForm />
      ) : (
        <>
          <div className="">
            <div className='w-full'>
              <div className='flex items-center justify-center'>
                <PatientStatusForm
                  onSubmit={handlePatientSubmit}
                  existingPatient={undefined}
                  addError={addError}
                />
                <form onSubmit={handleSearch} className="p-4 bg-white rounded-xl mb-4">
                  <div className="mb-3 flex gap-8">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Enter patient number or name"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Search</button>
                  </div>
                </form>
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

            </div>

          </div>

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
