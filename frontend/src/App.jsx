import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 👇 Context & AI Chatbot
import { LanguageProvider } from './context/LanguageContext';
import Chatbot from './components/Chatbot';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Bangladesh from './pages/Bangladesh';
import Login from './pages/Login';   
import Signup from './pages/Signup'; 
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import About from './pages/About'; 
import TourPackages from './pages/TourPackages'; 
import Leaderboard from './pages/Leaderboard'; // 🟢 লিডারবোর্ড ইম্পোর্ট করা হলো

// ==========================================
// 🔒 PrivateRoute
// ==========================================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// ==========================================
// 🛡️ RoleRoute
// ==========================================
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
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/packages" element={<TourPackages />} /> 
              <Route path="/leaderboard" element={<Leaderboard />} /> {/* 🟢 লিডারবোর্ডের রাউট যোগ করা হলো */}

              {/* Private Routes */}
              <Route path="/country/bangladesh" element={<PrivateRoute><Bangladesh /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              
              {/* Admin Route */}
              <Route 
                path="/admin" 
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                } 
              />

              {/* Agency Route */}
              <Route 
                path="/agency-login" 
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