import React, { useRef, useState } from 'react';
import PatientStatusModal from './PatientStatusModal';
import PatientStatusBoard, { type Patient } from './PatientStatusBoard';
import { LoginForm } from '../../components/login-form';
import { useAuth } from "../../features/auth/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../components/ui/alert-dialog'
import { Input } from '../../components/ui/input';
import type { PatientInfo } from '../../types';
import { Button } from '../../components/ui/button';

// const STORAGE_KEY = 'patientStatusBoardData';

const PatientStatusPage: React.FC = () => {
  const { isSurgeryTeam } = useAuth();
  // const [addName, setAddName] = useState('');
  // const [addError, setAddError] = useState('');
  // Search form state (independent)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[] | null>(null);
  // const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    firstName: '',
    lastName: '',
    state: '',
    streetAddress: '',
    city: '',
    telephone: '',
    contactEmail: '',
  })

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fields = ['First Name', 'Last Name', 'State', 'Street Address', 'City', 'Telephone', 'Contact Email'];
  // Get patients from localStorage
  // const getPatients = (): Patient[] => {
  //   const data = localStorage.getItem(STORAGE_KEY);
  //   if (data) {
  //     try {
  //       return JSON.parse(data);
  //     } catch {
  //       return [];
  //     }
  //   }
  //   return [];
  // };

  // Add patient only (no update)
  // const handlePatientSubmit = (patient: Patient) => {
  //   let patients = getPatients();
  //   patients.push(patient);
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  //   setAddName('');
  //   setAddError('');
  // };

  // Search by number or name (independent state)
  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const patients = getPatients();
  //   const query = searchQuery.trim().toLowerCase();
  //   let results = patients.filter(p =>
  //     p.number === query ||
  //     p.name.toLowerCase().includes(query)
  //   );
  //   setSearchResults(results.length > 0 ? results : []);
  // };

  // Open modal for editing
  // const handleEditPatient = (patient: Patient) => {
  //   setEditingPatient(patient);
  //   setModalOpen(true);
  // };

  // Update patient from modal
  // const handleUpdatePatient = (updatedPatient: Patient) => {
  //   let patients = getPatients();
  //   const idx = patients.findIndex(p => p.id === updatedPatient.id);
  //   if (idx > -1) {
  //     patients[idx] = { ...patients[idx], ...updatedPatient };
  //     localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  //   }
  //   setEditingPatient(null);
  //   setModalOpen(false);
  // };

  // Only use number state for editing
  // const [name, setName] = useState(existingPatient?.name || '');
  // const [status, setStatus] = useState<PatientStatus>(existingPatient?.status || 'Checked In');

  // Helper to generate the next patient number as a string of digits
  // function generateNextPatientNumber(existingNumbers: Set<string>): string {
  //   // Convert all to numbers, ignore non-numeric
  //   const nums = Array.from(existingNumbers)
  //     .map(n => parseInt(n, 10))
  //     .filter(n => !isNaN(n));
  //   const max = nums.length > 0 ? Math.max(...nums) : 0;
  //   return (max + 1).toString();
  // }

  const generateId = () => Date.now().toFixed(6); // Or use Date.now() for a simpler ID


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

  const handlePatientAdd = () => {
    const id = generateId(); // Generate unique ID for this entry

    const values = fields.reduce((acc, key) => {
      acc[key] = inputRefs.current[key]?.value || '';
      return acc;
    }, {} as Record<string, string>);

    const entry = { id, ...values };

    // Get existing entries from localStorage
    const existing = JSON.parse(localStorage.getItem('formData') || '[]');

    // Append new entry
    const updated = [...existing, entry];

    // Save back to localStorage
    localStorage.setItem('formData', JSON.stringify(updated));

    console.log('Saved entry:', entry);
  }


  return (
    <div>
      {!isSurgeryTeam ? (
        <LoginForm />
      ) : (
        <>
          <div className="flex items-center justify-end">
            <div className="mb-3 flex gap-8">
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="cursor-pointer">
                      Add
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add Patient</AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="flex flex-col gap-5">
                          {fields.map((field) => (
                            <div className="flex gap-5 items-center" key={field}>
                              <div className="w-1/4">{field}</div>
                              <Input ref={(el) => { inputRefs.current[field] = el; }} />
                            </div>
                          ))}
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-blue-500"
                        onClick={handlePatientAdd}
                      >
                        Add
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter patient number or name"
              />
              <Button
                className="cursor-pointer"
              // onClick={handleSearch}
              >
                Search
              </Button>
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
          {/* {editingPatient && (
            <PatientStatusModal
              open={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setEditingPatient(null);
              }}
              onSubmit={handleUpdatePatient}
              existingPatient={editingPatient}
            />
          )} */}
        </>
      )}
    </div>
  );
};

export default PatientStatusPage;
