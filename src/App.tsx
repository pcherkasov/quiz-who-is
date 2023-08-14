import React from 'react';
import './App.css';
import {BrowserRouter as Router} from 'react-router-dom';
import RoutesIndex from './routes/index';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import {AuthProvider} from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <RoutesIndex />
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
