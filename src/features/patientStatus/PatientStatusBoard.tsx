// ...existing code...
import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import { useLocation } from 'react-router-dom';

// Local storage key
const STORAGE_KEY = 'patientStatusBoardData';

export type PatientStatus = "Checked In" | "Pre-Procedure" | "In-progress" | "Closing" | "Recovery" | "Complete" | "Dismissal";
export interface Patient {
  id: string;
  number: string;
  name: string;
  status: PatientStatus;
}

// Status color mapping
const statusColors: Record<PatientStatus, string> = {
  'Checked In': 'bg-yellow-100 text-yellow-800',
  'Pre-Procedure': 'bg-blue-100 text-blue-800',
  'In-progress': 'bg-green-100 text-green-800',
  'Closing': 'bg-gray-200 text-gray-500',
  'Recovery': 'bg-purple-100 text-purple-800',
  'Complete': 'bg-green-200 text-green-800',
  'Dismissal': 'bg-red-100 text-red-800',
};


const AUTO_REFRESH_INTERVAL = 10000; // 10 seconds
const VISIBLE_ROWS = 5; // Number of rows visible at a time before cycling

const getPatientsFromStorage = (): Patient[] => {
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

interface PatientStatusBoardProps {
  isGuest?: boolean;
  patients?: Patient[];
}

const statusOptions: PatientStatus[] = [
  'Checked In',
  'Pre-Procedure',
  'In-progress',
  'Closing',
  'Recovery',
  'Complete',
  'Dismissal',
];

function UpdateStatusDropdown({ patient, refreshBoard }: { patient: Patient; refreshBoard: () => void }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<PatientStatus>(patient.status);
  const handleUpdate = () => setShowDropdown(true);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PatientStatus;
    setSelected(newStatus);
    // Update localStorage
    const patients = getPatientsFromStorage();
    const idx = patients.findIndex(p => p.id === patient.id);
    if (idx > -1) {
      patients[idx].status = newStatus;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
      refreshBoard();
      setShowDropdown(false);
    }
  };
  return showDropdown ? (
    <select
      className="ml-2 px-2 py-1 rounded border text-xs"
      value={selected}
      onChange={handleChange}
    >
      {statusOptions.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  ) : (
    <button
      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
      onClick={handleUpdate}
    >
      Update
    </button>
  );
}

const PatientStatusBoard: React.FC<PatientStatusBoardProps> = ({ isGuest, patients: propPatients }) => {
  // If propPatients is provided (search result), use it and do not overwrite on refresh
  const [patients, setPatients] = useState<Patient[]>(propPatients ?? getPatientsFromStorage());
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [startIdx, setStartIdx] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const currentPath = location.pathname.replace('/', '');
  // Load from localStorage on mount (only if not using propPatients)
  useEffect(() => {
    if (!propPatients) {
      setPatients(getPatientsFromStorage());
    } else {
      setPatients(propPatients);
    }
  }, [propPatients]);

  // Auto-refresh logic: only refresh from storage if not showing search results
  useEffect(() => {
    if (!propPatients) {
      intervalRef.current = setInterval(() => {
        setPatients(getPatientsFromStorage());
        setLastUpdated(new Date().toLocaleTimeString());
        // Cycle rows if more than visible
        if (patients.length > VISIBLE_ROWS) {
          setStartIdx(prev => (prev + VISIBLE_ROWS) % patients.length);
        }
      }, AUTO_REFRESH_INTERVAL);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [patients.length, propPatients]);

  // Auto-scroll for guest view
  useEffect(() => {
    if (!isGuest) return;
    const container = scrollRef.current;
    if (!container) return;
    let scrollAmount = 1;
    let interval: NodeJS.Timeout;
    function startScroll() {
      interval = setInterval(() => {
        if (!container) return;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0;
        } else {
          container.scrollTop += scrollAmount;
        }
      }, 40); // Adjust speed as needed
    }
    startScroll();
    return () => clearInterval(interval);
  }, [isGuest, patients.length]);

  // Only refresh from storage if not showing search results
  const handleRefresh = () => {
    if (!propPatients) {
      setPatients(getPatientsFromStorage());
      setLastUpdated(new Date().toLocaleTimeString());
      setStartIdx(0);
    }
  };

  // Show only a slice if too many patients
  const visiblePatients = patients.length > VISIBLE_ROWS
    ? patients.slice(startIdx, startIdx + VISIBLE_ROWS)
    : patients;

  return (
    <div className={`${isGuest ? 'fixed inset-0 bg-white' : 'mx-auto mt-8 p-4 bg-white rounded-xl mb-24'}`}>
      {currentPath !== 'surgery-team' && <div className='mb-10'><Header /></div>}
      <div className={`${isGuest ? 'h-full flex flex-col' : ''}`}>
        <div className='mb-10'>
          {!isGuest && !propPatients && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleRefresh}
            >
              Refresh
            </button>
          )}
        </div>
        <div className="mb-2 text-sm text-gray-500">Latest updated at {lastUpdated}</div>
        <div
          className={`${isGuest ? 'flex-1 overflow-hidden p-6' : 'overflow-x-auto max-h-80'}`}
          ref={isGuest ? scrollRef : undefined}
          style={isGuest ? { maxHeight: '100%', height: '100%' } : {}}
        >
          <table className={`${isGuest ? 'w-full text-lg' : 'min-w-full'} border`}>
            <thead>
              <tr className="bg-gray-100">
                <th className={`${isGuest ? 'px-6 py-4' : 'px-4 py-2'} text-left`}>Patient #</th>
                <th className={`${isGuest ? 'px-6 py-4' : 'px-4 py-2'} text-left`}>Name</th>
                <th className={`${isGuest ? 'px-6 py-4' : 'px-4 py-2'} text-left`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {visiblePatients.map((patient) => (
                <tr key={patient.id} className="border-b">
                  <td className={`${isGuest ? 'px-6 py-4' : 'px-4 py-2'} font-mono`}>{patient.number}</td>
                  <td className={`${isGuest ? 'px-6 py-4' : 'px-4 py-2'}`}>{patient.name}</td>
                  <td className={`${isGuest ? 'px-6 py-4' : 'px-4 py-2'} flex items-center gap-2`}>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[patient.status] || 'bg-gray-100'}`}>
                      {patient.status}
                    </span>
                    {/* Only show update for non-guests */}
                    {!isGuest && (
                      <UpdateStatusDropdown patient={patient} refreshBoard={handleRefresh} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {patients.length > VISIBLE_ROWS && !isGuest && (
            <div className="text-xs text-gray-400 mt-2">Showing {startIdx + 1} - {Math.min(startIdx + VISIBLE_ROWS, patients.length)} of {patients.length} patients</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientStatusBoard;
