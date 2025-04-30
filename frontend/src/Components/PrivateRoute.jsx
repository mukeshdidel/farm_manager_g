import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem('auth_token');
  return authToken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
