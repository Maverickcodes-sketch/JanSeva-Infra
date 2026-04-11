import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { hasAccess } from '../utils/roleRoutes';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!hasAccess(user.role, location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
