import Logout from "../authentication/Logout";
import React from "react";
import {AppBar, Toolbar, Typography} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const authContext = React.useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {authContext?.isAuthenticated ? authContext.fullName : 'Quizy Easy'}
        </Typography>
        {authContext?.isAuthenticated && <Logout />}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
