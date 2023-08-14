import React from 'react';
import AuthService from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import {Button} from "@mui/material";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    AuthService.logout();
    if (authContext) {
      authContext.setAuthentication(false);
    }
    navigate("/auth/signin");
  }

  // Вместо null может быть кнопка или другой элемент интерфейса, вызывающий handleLogout по клику
  return <Button variant="contained" type="submit" onClick={handleLogout}>Logout</Button>;
}

export default Logout;
