import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import MainDashboard from './Components/Layout/MainDashboard';
import LoginForm from './Components/auth/Login';
import { useNavigate } from "react-router-dom";

function App() {

  

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/" element={<LoginForm/>} />
        
        <Route path="/main-dashboard/*" element={<MainDashboard />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;
