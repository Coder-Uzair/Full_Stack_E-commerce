import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { Spinner } from '@/components/common/Spinner.jsx';
import { ROUTES } from '@/utils/constants.js';

/** Role-gated admin surface. Role is also enforced server-side. */
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner size={32} />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!isAdmin) return <Navigate to={ROUTES.HOME} replace />;
  return children;
}

export default AdminRoute;
