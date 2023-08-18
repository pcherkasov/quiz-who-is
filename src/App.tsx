import React from 'react';
import './App.css';
import {BrowserRouter as Router} from 'react-router-dom';
import RoutesIndex from './routes/index';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import {AuthProvider} from './contexts/AuthContext';

const App: React.FC = () => {
  const bodyStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between',
  };

  return (
    <Router>
      <AuthProvider>
        <div style={bodyStyle}>
          <Header/>
            <RoutesIndex/>
          <Footer/>
        </div>
      </AuthProvider>
    </Router>

  );
}

export default App;
