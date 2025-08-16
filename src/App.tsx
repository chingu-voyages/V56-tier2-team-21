import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Login from './features/login/Login'
import { AuthProvider } from './features/auth/AuthContext'
import PrivateRoute from './features/auth/PrivateRoute'
import PatientStatusBoard from './features/patientStatus/PatientStatusBoard'
import Container from './features/container/Container'
import PatientStatusPage from './features/patientStatus/PatientStatusPage'
import AdminPage from './features/admin/AdminPage'
function App() {
  // const AdminPage = () => <div>Admin Page (Protected)</div>;
  const GuestPage = () => <div>Guest Page (Protected)</div>;

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/guest"
            element={
              <PrivateRoute>
                <GuestPage />
              </PrivateRoute>
            }
          />
          <Route path="/status" element={<PatientStatusBoard isGuest={true} />} />
          <Route path="/surgery-team" element={<PatientStatusPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
    //  <AuthProvider>
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<Container />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route
    //         path="/admin"
    //         element={
    //           <PrivateRoute>
    //             <AdminPage />
    //           </PrivateRoute>
    //         }
    //       />
    //       <Route
    //         path="/guest"
    //         element={
    //           <PrivateRoute>
    //             <GuestPage />
    //           </PrivateRoute>
    //         }
    //       />
    //       <Route path="/status" element={<PatientStatusBoard isGuest={true} />} />
    //       <Route path="/surgery-team" element={<SurgeryDashboard />} />
    //     </Routes>
    //     <Footer />
     
    //   </Router>
    // </AuthProvider>
  );
}

export default App;