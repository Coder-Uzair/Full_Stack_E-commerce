import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { Spinner } from '@/components/common/Spinner.jsx';
import { ROUTES } from '@/utils/constants.js';

/** Gate for authenticated users; redirects to login with a return URL. */
export function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner size={32} />
      </div>
    );
  }
  if (!isAuthenticated) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.LOGIN}?returnTo=${returnTo}`} replace />;
  }
  return children;
}

export default PrivateRoute;
