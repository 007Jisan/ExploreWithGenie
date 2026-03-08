import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
 

// ==========================================
// 🔒 সাধারণ প্রোটেক্টেড রুট (যেকোনো লগইন করা ইউজারের জন্য)
// ==========================================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// ==========================================
// 🛡️ রোল-বেসড প্রোটেক্টেড রুট (অ্যাডমিন/এজেন্সির জন্য)
// ==========================================
const RoleRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // লগইনের সময় সেভ করা রোল

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // ইউজারের রোল না মিললে সরাসরি হোমে পাঠিয়ে দেবে, কোনো alert দেওয়া যাবে না (দিলে সাদা পেজ আসবে)
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App font-sans bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-20"> 
          <Routes>
            {/* পাবলিক রুটস */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} /> {/* 👈 এই লাইনটি যোগ করা হয়েছে */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔒 প্রাইভেট রুটস (সব লগইন করা ইউজারের জন্য) */}
            <Route path="/country/bangladesh" element={<PrivateRoute><Bangladesh /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            
            {/* 🛡️ অ্যাডমিন রুট (শুধুমাত্র admin ঢুকতে পারবে) */}
            <Route 
              path="/admin" 
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              } 
            />

            {/* 💼 এজেন্সি রুট (শুধুমাত্র agency ঢুকতে পারবে) */}
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

        <Footer />
      </div>
    </Router>
  );
}

export default App;