import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DonorDashboard from './pages/donor/DonorDashboard';
import MyDonations from './pages/donor/MyDonations';
import NewDonation from './pages/donor/NewDonation';
import AllDonations from './pages/admin/AllDonations';
import AdminDashboard from './pages/admin/AdminDashboard';
import Centers from './pages/Centers';
import { Center, Spinner } from '@chakra-ui/react';

function App() {
  const { user, login, signup, logout, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return (
      <Layout user={user} onLogout={logout} showSidebar={true} role={user?.role}>
        {children}
      </Layout>
    );
  };

  // Role-based dashboard redirect
  const getDashboardPath = (role) => {
    if (role === 'ROLE_ADMIN' || role === 'ROLE_STAFF') {
      return '/admin/dashboard';
    }
    return '/dashboard';
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={getDashboardPath(user.role)} />
            ) : (
              <Login onLogin={login} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to={getDashboardPath(user.role)} />
            ) : (
              <Signup onSignup={signup} />
            )
          }
        />

        {/* Donor Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donations"
          element={
            <ProtectedRoute>
              <MyDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donations/new"
          element={
            <ProtectedRoute>
              <NewDonation />
            </ProtectedRoute>
          }
        />

        {/* Admin/Staff Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donations/all"
          element={
            <ProtectedRoute>
              <AllDonations />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes */}
        <Route
          path="/centers"
          element={
            <ProtectedRoute>
              <Centers isAdmin={user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_STAFF'} />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate to={user ? getDashboardPath(user.role) : "/login"} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;