import React, { useState } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';
import AuthService from '../services/AuthService';
import {NewUserRequestBody} from "../types/apiTypes";
import {Link, useNavigate} from "react-router-dom";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user: NewUserRequestBody = {
      username,
      email,
      firstName,
      lastName,
      password,
    };
    try {
      await AuthService.signup(user, navigate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
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
          label="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          sx={{mb: 2}}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          sx={{mb: 2}}
        />
        <TextField
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          sx={{mb: 2}}
        />
        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{mb: 2}}
        />
        <TextField
          label="Password"
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
          Register
        </Button>
        <Box sx={{mt: 2}}>
          Already have an account? <Link to="/auth/signin">Sign in</Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
