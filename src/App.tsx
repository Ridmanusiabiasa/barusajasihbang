import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatInterface } from './components/ChatInterface';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? (
              <AdminPanel onBack={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;