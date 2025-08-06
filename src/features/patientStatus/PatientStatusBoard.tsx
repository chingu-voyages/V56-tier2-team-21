import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../../components/ui/alert-dialog';
import { Input } from '../../components/ui/input';
import type { PatientInfo, PatientStatus } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface PatientStatusBoardProps {
  isGuest?: boolean;
  patients?: PatientInfo[];
  onUpdatePatient?: (updatedPatient: PatientInfo) => void;
}

const statusColors: Record<PatientStatus, string> = {
  'Checked In': 'bg-yellow-100 text-yellow-800',
  'Pre-Procedure': 'bg-blue-100 text-blue-800',
  'In-progress': 'bg-green-100 text-green-800',
  'Closing': 'bg-gray-200 text-gray-500',
  'Recovery': 'bg-purple-100 text-purple-800',
  'Complete': 'bg-green-200 text-green-800',
  'Dismissal': 'bg-red-100 text-red-800',
};

const statusOptions: PatientStatus[] = [
  'Checked In',
  'Pre-Procedure',
  'In-progress',
  'Closing',
  'Recovery',
  'Complete',
  'Dismissal',
];

const PatientStatusBoard: React.FC<PatientStatusBoardProps> = ({
  isGuest,
  patients = [],
  onUpdatePatient,
}) => {
  const [editingPatient, setEditingPatient] = useState<PatientInfo | null>(null);

  const handleStatusChange = (patient: PatientInfo, newStatus: PatientStatus) => {
    const updatedPatient = { ...patient, status: newStatus };
    onUpdatePatient && onUpdatePatient(updatedPatient);
  };

  const handleEditSave = () => {
    if (editingPatient) {
      // Validate telephone is a number and not NaN
      const tel = Number(editingPatient.telephone);
      if (isNaN(tel)) {
        alert('Telephone must be a valid number');
        return;
      }

      onUpdatePatient && onUpdatePatient({ ...editingPatient, telephone: tel });
      setEditingPatient(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Patient #</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Telephone</th>
            <th className="px-4 py-2 text-left">Contact Email</th>
            <th className="px-4 py-2 text-left">Status</th>
            {/* <th className="px-4 py-2 text-left">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b">
              <td className="px-4 py-2 font-mono">{patient.id}</td>
              <td className="px-4 py-2">{patient.firstName} {patient.lastName}</td>
              <td className="px-4 py-2">{patient.streetAddress},{patient.city},{patient.state}, {patient.country} </td>
              <td className="px-4 py-2">{patient.telephone}</td>
              <td className="px-4 py-2">{patient.contactEmail}</td>
              <td className="px-4 py-2">
                <Select
                  value={patient.status}
                  onValueChange={(value) => handleStatusChange(patient, value as PatientStatus)}
                  disabled={isGuest}
                >
                  <SelectTrigger className={`px-2 py-1 rounded text-sm ${statusColors[patient.status as PatientStatus]}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              {/* <td className="px-4 py-2">
                {!isGuest && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button onClick={() => setEditingPatient(patient)}>Edit</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit Patient</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                          <div className="flex flex-col gap-4">
                            <Input
                              value={editingPatient?.firstName || ''}
                              onChange={(e) =>
                                setEditingPatient({ ...editingPatient!, firstName: e.target.value })
                              }
                              placeholder="First Name"
                            />
                            <Input
                              value={editingPatient?.lastName || ''}
                              onChange={(e) =>
                                setEditingPatient({ ...editingPatient!, lastName: e.target.value })
                              }
                              placeholder="Last Name"
                            />
                            <Input
                              value={editingPatient?.streetAddress || ''}
                              onChange={(e) =>
                                setEditingPatient({ ...editingPatient!, streetAddress: e.target.value })
                              }
                              placeholder="Street Address"
                            />
                            <Input
                              value={editingPatient?.city || ''}
                              onChange={(e) =>
                                setEditingPatient({ ...editingPatient!, city: e.target.value })
                              }
                              placeholder="City"
                            />
                            <Input
                              value={editingPatient?.state || ''}
                              onChange={(e) =>
                                setEditingPatient({ ...editingPatient!, state: e.target.value })
                              }
                              placeholder="State/Province/Region"
                            />
                            <Input
                              type="number"
                              value={editingPatient?.telephone.toString() || ''}
                              onChange={(e) =>
                                setEditingPatient({
                                  ...editingPatient!,
                                  telephone: parseInt(e.target.value, 10) || 0,
                                })
                              }
                              placeholder="Telephone"
                            />
                            <Input
                              value={editingPatient?.contactEmail || ''}
                              onChange={(e) =>
                                setEditingPatient({ ...editingPatient!, contactEmail: e.target.value })
                              }
                              placeholder="Contact Email"
                            />
                            <select
                              className="px-2 py-1 rounded text-sm"
                              value={editingPatient?.status}
                              onChange={(e) =>
                                setEditingPatient({ ...editingPatient!, status: e.target.value as PatientStatus })
                              }
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setEditingPatient(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleEditSave}>Save</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientStatusBoard;