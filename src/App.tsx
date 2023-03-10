import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './css/App.css';

import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

import Home from './pages/Home';

import { AuthContext } from './context/AuthContext';
import { DataContext } from './context/DataContext';
import OneOrderField from './components/OneOrderField';
import OneOrderConfirmation from './components/OneOrderConfirmation';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import SmallLogin from './components/SmallLogin';
import SmallRegistration from './components/SmallRegistration';

function App() {
  var user = useContext(AuthContext);
  var data = useContext(DataContext);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    document.body.classList.add('bodyDiv');

    // Add an event listener to detect screen width changes
    window.addEventListener('resize', handleResize);
    handleResize(); // Call the function on first load

    // Remove the event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 768); // Set breakpoint as desired
  };

  return (
      <BrowserRouter>
        <Navbar />
          <div className='main'>
              <Routes>

                <Route path='/' element={<Home/>}/>

                <Route
                  path='/login'
                  element={
                    <ProtectedRoute>
                      {isSmallScreen ? <SmallLogin /> : <LoginForm />}
                    </ProtectedRoute>
                  }
                />

                <Route path='/register' element={<ProtectedRoute><SmallRegistration/></ProtectedRoute>}/>

                <Route path='/OneOrder' element={<OneOrderField/>}/>

                <Route path='/OrderConfirmation' element={<OneOrderConfirmation/>}/>

                <Route path='/profile' element={<ProfilePage/>}/>

              </Routes>
          </div>
        <Footer />
      </BrowserRouter>
  );
}


export default App;
