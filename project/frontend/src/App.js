import React, { useState, createContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import Forgotpassword from './pages/Forgotpassword';
import Resetpassword from './pages/Resetpassword';
import Admindashboard from './pages/Admindashboard';
import Checker from './component/Checker';
import Adduser from './pages/Adduser';
import Addadmin from './pages/Addadmin';
import { Navigate } from 'react-router-dom';
import Addproject from './pages/Addproject';
import Projects from './pages/Projects';


// Create context
export const AuthContext = createContext();

function App() {
  const apiUrl = 'http://localhost:4000/api/v1/tokenvalidity';
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [isSuperAdmin, setisSuperAdmin] = useState(true);
  const token = localStorage.getItem("token");
  const [isLoggedIn, setisLoggedIn] = useState(token); 
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Pass token in the Authorization header
                },
            });

            const data = await response.json();
            const {role,isSuperAdmin}=data.userProfile;
            setUserRole(role);
            setisSuperAdmin(isSuperAdmin);
            console.log("the role and is superadmin is:",role,isSuperAdmin)
            console.log("i am at app data is:",data);
            console.log("is logged in:",isLoggedIn);


            if (response.ok) {
               
            } else {
           
                    throw new Error(`HTTP error! Status: ${response.status}`);
                
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            localStorage.removeItem("token");
            setisLoggedIn(false);
        }
    };

    fetchData();
}, [navigate, token]);


  return (
    
    <div className="App">
      {console.log("i am at middle:",userRole)}
      <AuthContext.Provider value={{ isLoggedIn, setisLoggedIn }}> {/* Provide context value */}
        <ToastContainer /> {/* Initialize ToastContainer */}
        <Header />
        <div className="main_content">
          <Routes>
          <Route path='/Admindashboard' element={<Protected><Admindashboard/></Protected>} />
            <Route path='/dashboard' element={<Protected><Dashboard/></Protected>} />
            <Route path='/login' element={<Redirect><Login/></Redirect>}/>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<Redirect><Signup/></Redirect>}/>
            <Route path='/profile' element={<Checker><Profile /></Checker>} />
            <Route path='/forgotPassword' element={<Forgotpassword />} />
            <Route
              path='/adduser'
              element={
                isLoggedIn ? (
                  userRole == 'Admin' ? (
                    <Adduser/>
                  ) : (
                    <Navigate to='/dashboard' />
                  )
                ) : (
                  <Navigate to='/login' />
                )
              }
            />


            <Route path='/addadmin' 
            element={
              isLoggedIn ? (
                userRole == 'Admin' && isSuperAdmin==true ? (
                  <Addadmin/>
                ) : (
                  <Navigate to='/dashboard' />
                )
              ) : (
                <Navigate to='/login' />
              )
            }
            />
             <Route path='/addproject' 
            element={
              isLoggedIn ? (
                userRole == 'Admin' ? (
                  <Addproject/>
                ) : (
                  <Navigate to='/dashboard' />
                )
              ) : (
                <Navigate to='/login' />
              )
            }
            />
              <Route path='/projects' 
            element={
              isLoggedIn ? (
                userRole == 'Admin' ? (
                  <Projects/>
                ) : (
                  <Navigate to='/dashboard' />
                )
              ) : (
                <Navigate to='/login' />
              )
            }
            />
            <Route path='/resetpassword/:id/:token' element={<Resetpassword />} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
