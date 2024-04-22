import React, { useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Protected from './component/Protected';
import Redirect from './component/Redirect';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import default toast styles

// Create context
export const AuthContext = createContext();

function App() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setisLoggedIn] = useState(!!token); // Set initial state based on token existence

  return (
    <div className="App">
      <AuthContext.Provider value={{ isLoggedIn, setisLoggedIn }}> {/* Provide context value */}
        <ToastContainer /> {/* Initialize ToastContainer */}
        <Header />
        <div className="main_content">
          <Routes>
            <Route path='/dashboard' element={<Protected><Dashboard/></Protected>} />
            <Route path='/login' element={<Redirect><Login/></Redirect>}/>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<Redirect><Signup/></Redirect>}/>
            <Route path='/profile' element={<Protected><Profile /></Protected>} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
