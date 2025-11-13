import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    // Mock login for now - we'll connect to API later
    console.log('Login with:', credentials);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({ username: credentials.username, role: 'ROLE_DONOR' });
        resolve({ success: true });
      }, 1000);
    });
  };

  const handleSignup = async (userData) => {
    // Mock signup for now - we'll connect to API later
    console.log('Signup with:', userData);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({ username: userData.username, role: userData.role });
        resolve({ success: true });
      }, 1000);
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Dashboard placeholder
  const Dashboard = () => (
    <Layout user={user} onLogout={handleLogout} showSidebar={true} role={user?.role}>
      <VStack spacing={6} align="stretch">
        <Heading>Welcome, {user?.username}!</Heading>
        <Text fontSize="lg">Role: {user?.role}</Text>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Text>Dashboard content will go here...</Text>
        </Box>
      </VStack>
    </Layout>
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Signup onSignup={handleSignup} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;