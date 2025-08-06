import React, { useRef, useState, useEffect } from 'react';
import PatientStatusBoard from './PatientStatusBoard';
import { LoginForm } from '../../components/login-form';
import { useAuth } from "../../features/auth/AuthContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '../../components/ui/alert-dialog'
import { Input } from '../../components/ui/input';
import type { PatientInfo } from '../../types';
import { Button } from '../../components/ui/button';

const STORAGE_KEY = 'patientStatusBoardData';

const PatientStatusPage: React.FC = () => {
  const { isSurgeryTeam } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [patientInfo, setPatientInfo] = useState<PatientInfo[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientInfo[] | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load patients from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const patients: PatientInfo[] = JSON.parse(storedData);
        setPatientInfo(patients);
      } catch {
        setPatientInfo([]);
      }
    }
  }, []);

  // Save patients to localStorage whenever patientInfo changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patientInfo));
  }, [patientInfo]);

  // Generate unique ID
  const generateId = () => Date.now();

  const fields = [
    'First Name',
    'Last Name',
    'Street Address',
    'City',
    'State/Province/Region',
    'Country',
    'Telephone',
    'Contact Email'
  ];

  const handlePatientAdd = () => {
    const values = fields.reduce((acc, key) => {
      acc[key] = inputRefs.current[key]?.value.trim() || '';
      return acc;
    }, {} as Record<string, string>);

    // Validate required fields (simple example)
    if (!values['First Name'] || !values['Last Name']) {
      alert('First Name and Last Name are required');
      return;
    }

    const newPatient: PatientInfo = {
      id: generateId(),
      firstName: values['First Name'],
      lastName: values['Last Name'],
      country: values['Country'],
      streetAddress: values['Street Address'],
      city: values['City'],
      state: values['State/Province/Region'],
      telephone: parseInt(values['Telephone'], 10) || 0,
      contactEmail: values['Contact Email'],
      status: 'Checked In', // default status on add
    };

    setPatientInfo((prev) => [...prev, newPatient]);

    // Clear inputs after add
    fields.forEach((field) => {
      if (inputRefs.current[field]) {
        inputRefs.current[field]!.value = '';
      }
    });
  };

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredPatients(null);
      return;
    }
    const results = patientInfo.filter(
      (p) =>
        p.id.toString().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q)
    );
    setFilteredPatients(results.length > 0 ? results : []);
  };

  const handleUpdatePatient = (updatedPatient: PatientInfo) => {
    setPatientInfo((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );

    // If filtering, update filteredPatients too
    setFilteredPatients((prev) =>
      prev
        ? prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
        : null
    );
  };

  return (
    <div>
      {!isSurgeryTeam ? (
        <LoginForm />
      ) : (
        <>
          <div className="flex items-center justify-end mb-6 gap-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Add Patient</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='mb-5'>Add Patient</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="flex flex-col gap-4">
                      {fields.map((field) => (
                        <div key={field} className="flex gap-4">
                          <label className="font-semibold flex-1/2">{field}</label>
                          <Input
                            ref={(el) => {
                              inputRefs.current[field] = el;
                            }}
                            type={field === 'Telephone' ? 'number' : 'text'}
                          />
                        </div>
                      ))}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePatientAdd}>
                    Add
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Input
              type="text"
              placeholder="Search by Patient # or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Button onClick={handleSearch}>Search</Button>
            {filteredPatients && (
              <Button onClick={() => setFilteredPatients(null)}>Clear</Button>
            )}
          </div>

          <PatientStatusBoard
            patients={filteredPatients ?? patientInfo}
            onUpdatePatient={handleUpdatePatient}
          />
        </>
      )}
    </div>
  );
};

export default PatientStatusPage;