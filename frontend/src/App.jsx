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
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffDeliveries from './pages/staff/StaffDeliveries';
import StaffRecipients from './pages/staff/StaffRecipients';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverDeliveries from './pages/driver/DriverDeliveries';
import Centers from './pages/Centers';
import Profile from './pages/Profile';
import DonationDetail from './pages/DonationDetail';
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
    if (role === 'ROLE_ADMIN') {
      return '/admin/dashboard';
    }
    if (role === 'ROLE_STAFF') {
      return '/staff/dashboard';
    }
    if (role === 'ROLE_DRIVER') {
      return '/driver/dashboard';
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

        {/* Donation Detail (Shared) */}
        <Route
          path="/donations/:id"
          element={
            <ProtectedRoute>
              <DonationDetail />
            </ProtectedRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/deliveries"
          element={
            <ProtectedRoute>
              <StaffDeliveries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/recipients"
          element={
            <ProtectedRoute>
              <StaffRecipients />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/deliveries"
          element={
            <ProtectedRoute>
              <DriverDeliveries />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
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
              <Centers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            <Navigate to={user ? getDashboardPath(user.role) : "/login"} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
