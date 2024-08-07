import { useAuth } from '@/hooks/useAuth';
import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isLogged } = useAuth();

  return isLogged ? element : <Navigate to="/" />;
};

export default ProtectedRoute;