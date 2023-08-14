import React, {createContext, ReactNode, useEffect, useState} from "react";
import AuthService from "../services/AuthService";
import {useNavigate} from "react-router-dom";
import CookieService from "../services/CookieService";

type authContextType = {
  isAuthenticated: boolean,
  setAuthentication: (value: boolean) => void,
  fullName: string,
  setFullName: (value: string) => void,
};

const AuthContext = createContext<authContextType | undefined>(
  undefined
);

let authSignedInContextState = {} as authContextType;

AuthService.setNavigateCallback((to: string) => {
  const navigate = useNavigate();
  if (authSignedInContextState.setAuthentication) {
    authSignedInContextState.setAuthentication(false);
  }
  navigate(to);
});

type AuthProviderProps = {
  children: ReactNode
}
export function AuthProvider ({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const [isAuthenticated, setAuthentication] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');

  authSignedInContextState = {
    isAuthenticated: isAuthenticated,
    setAuthentication: setAuthentication,
    fullName: fullName,
    setFullName: setFullName,
  };

  useEffect(() => {
    AuthService.setNavigateCallback(navigate);
  }, []);


  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshToken = CookieService.getCookie('refreshToken');
        if(refreshToken) {
          await AuthService.refreshAuthToken(refreshToken);
          setAuthentication(true);
        }
      } catch (e) {
        // handle error (optional)
        setAuthentication(false);
      }
    };
    AuthService.setNavigateCallback(navigate);
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthentication, fullName, setFullName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
