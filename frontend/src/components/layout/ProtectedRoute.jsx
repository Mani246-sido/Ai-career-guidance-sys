import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const hasToken = !!localStorage.getItem('accessToken');

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
