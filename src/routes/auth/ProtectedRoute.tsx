import { Navigate, useLocation } from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import { ReactNode, ReactElement } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }): ReactElement | null => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated
    ? <>{children}</>
    : <Navigate state={{ from: location }} to="/auth/signin" />;
};
