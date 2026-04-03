import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { LanguageProvider } from './context/LanguageContext';
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Bangladesh from './pages/Bangladesh';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import About from './pages/About';
import Leaderboard from './pages/Leaderboard';
import SpotDetails from './pages/SpotDetails';
import TourPackages from './pages/TourPackages';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App font-sans bg-gray-50 min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/packages" element={<TourPackages />} />

              <Route
                path="/country/bangladesh"
                element={
                  <PrivateRoute>
                    <Bangladesh />
                  </PrivateRoute>
                }
              />
              <Route
                path="/spots/:id"
                element={
                  <PrivateRoute>
                    <SpotDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/agency-dashboard"
                element={
                  <RoleRoute allowedRoles={['agency']}>
                    <AgencyDashboard />
                  </RoleRoute>
                }
              />
            </Routes>
          </main>

          <Chatbot />
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
