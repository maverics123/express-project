import React, { useContext } from 'react';
import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom'; 
import logo from '../images/logo.png';
import { AuthContext } from '../App'; 

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, setisLoggedIn } = useContext(AuthContext); 
  const handleLogout = () => {
    localStorage.removeItem("token");
    setisLoggedIn(false); 
    navigate("/");
  
  };

  return (
    <header className='header_bar'>
      <img src={logo} className="logo_img" alt="Logo"></img>
      <ul className='header_menu'>
        {isLoggedIn ? (
          <>
            <li><NavLink to='/profile' className="nav-link">Profile</NavLink></li>
            <li><button onClick={handleLogout} className="nav-link">Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to='/login' className="nav-link">Login</NavLink></li>
            <li><NavLink to='/signup' className="nav-link">Signup</NavLink></li>
          </>
        )}
      </ul>
    </header>
  );
}
