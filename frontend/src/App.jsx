import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DonorDashboard from './pages/donor/DonorDashboard';
import MyDonations from './pages/donor/MyDonations';
import NewDonation from './pages/donor/NewDonation';
import AllDonations from './pages/admin/AllDonations';
import AdminDashboard from './pages/admin/AdminDashboard';
import Centers from './pages/Centers';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    console.log('Login with:', credentials);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Determine role based on username for testing
        let role = 'ROLE_DONOR';
        if (credentials.username === 'admin') role = 'ROLE_ADMIN';
        if (credentials.username === 'staff') role = 'ROLE_STAFF';

        setUser({ username: credentials.username, role });
        resolve({ success: true });
      }, 1000);
    });
  };

  const handleSignup = async (userData) => {
    console.log('Signup with:', userData);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Signup always creates DONOR accounts
        setUser({ username: userData.username, role: 'ROLE_DONOR' });
        resolve({ success: true });
      }, 1000);
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return (
      <Layout user={user} onLogout={handleLogout} showSidebar={true} role={user?.role}>
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
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to={getDashboardPath(user.role)} />
            ) : (
              <Signup onSignup={handleSignup} />
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