import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';
import AuthService from '../services/AuthService';
import AuthContext from '../contexts/AuthContext';
import {Link, useNavigate} from "react-router-dom";


const SigninPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = {
      username,
      password,
    };
    try {
      if (authContext) {
        const response = await AuthService.signin(user, navigate, authContext.setFullName);
        if (response) {
          authContext?.setAuthentication(true);
          setError(null); // clear error if sign in was successful
        }
      } else {
        throw new Error("AuthContext is undefined");
      }
    } catch (error) {
      setError("Invalid credentials"); // set error message
    }
  };

  return (
    <Container >
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          p: 1,
        }}
      >
        <TextField
          error={error !== null}
          helperText={error !== "" && error}
          label="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          sx={{mb: 2}}
        />
        <TextField
          error={error !== null}
          label="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{mb: 2}}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{mt: 2}}
        >
          Login
        </Button>
        <Box sx={{mt: 2}}>
          Don't have an account? <Link to="/auth/signup">Sign up</Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SigninPage;
