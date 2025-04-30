import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const authToken = localStorage.getItem('auth_token');
  return !authToken ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
