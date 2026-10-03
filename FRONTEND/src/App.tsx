import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import ThreatScanner from './pages/ThreatScanner';
import ScanHistory from './pages/ScanHistory';
import SecurityAwareness from './pages/SecurityAwareness';
import UserRiskProfile from './pages/UserRiskProfile';
import AdminDashboard from './pages/AdminDashboard';
import NotificationsPage from './pages/Notifications';

const Layout = () => (
  <div className="min-h-screen bg-[#070A12] text-white flex flex-col">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#070A12] cyber-bg-grid">
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authenticated Workspace Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/scanner" element={<ThreatScanner />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/awareness" element={<SecurityAwareness />} />
          <Route path="/risk-profile" element={<UserRiskProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
