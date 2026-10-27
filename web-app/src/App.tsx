import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'react-quill-new/dist/quill.snow.css';
import './App.css';

// Dedicated Sub-Applications (Clean separation: Website Frontend vs Admin Frontend)
import WebsiteApp from './website/WebsiteApp';
import AdminApp from './admin/AdminApp';
import { ClientLoginPage, ClientRegisterPage } from './pages/ClientAuthPages';
import ClientDashboardPage from './pages/ClientDashboardPage';
import PartnerApplyPage from './pages/PartnerApplyPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Admin Frontend: Dedicated enterprise management portal */}
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/admin" element={<AdminApp />} />
          <Route path="/GMCADMIN/*" element={<AdminApp />} />
          <Route path="/gmcadmin/*" element={<AdminApp />} />
          <Route path="/gmcadmin" element={<AdminApp />} />

          {/* Standalone Full-screen Portal Experiences */}
          <Route path="/portal/login" element={<ClientLoginPage />} />
          <Route path="/portal/register" element={<ClientRegisterPage />} />
          <Route path="/portal/dashboard" element={<ClientDashboardPage />} />
          <Route path="/portal" element={<ClientLoginPage />} />
          <Route path="/partner-apply" element={<PartnerApplyPage />} />

          {/* Website Frontend: Public customer experience */}
          <Route path="/*" element={<WebsiteApp />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
