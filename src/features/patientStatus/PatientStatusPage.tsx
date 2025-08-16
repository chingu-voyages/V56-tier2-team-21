
import React from 'react';
import PatientStatusBoard from './PatientStatusBoard';
import { LoginForm } from '../../components/login-form';
import { useAuth } from "../../features/auth/AuthContext";

const PatientStatusPage: React.FC = () => {
  const { isSurgeryTeam } = useAuth();

  return (
    <div>
      {!isSurgeryTeam ? (
        <LoginForm />
      ) : (
        <PatientStatusBoard isGuest={false} />
      )}
    </div>
  );
};

export default PatientStatusPage;