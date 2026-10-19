import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import BlogAdmin from '../blog/BlogAdmin';
import './Admin.css';

export function AdminApp() {
  return (
    <div className="admin-app-root">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/blog/new" element={<BlogAdmin />} />
        <Route path="*" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default AdminApp;
