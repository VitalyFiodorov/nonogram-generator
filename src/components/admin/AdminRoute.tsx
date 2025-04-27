import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import SEODashboard from './SEODashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import AdminLayout from './AdminLayout';

const AdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('seo');

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout
      onLogout={handleLogout}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    >
      {currentPage === 'seo' && <SEODashboard onLogout={handleLogout} />}
      {currentPage === 'analytics' && <AnalyticsDashboard />}
    </AdminLayout>
  );
};

export default AdminRoute; 