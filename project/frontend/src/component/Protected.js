import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; 
import Loader from './Loader';

export default function Protected(props) {
    const { isLoggedIn, setisLoggedIn } = useContext(AuthContext); 
    const apiUrl = 'http://localhost:4000/api/v1/tokenvalidity';
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading,setLoading]=useState(true);
    console.log("welcome to india got protection");
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

                if (response.ok) {
                    const responseData = await response.json();
                    const role = responseData.userProfile.role;
                    if (role === 'Admin') {
                        navigate('/Admindashboard');
                       
                        setisLoggedIn(true);

                    } else if (role === 'User') {
                        navigate('/dashboard');
                       
                        setisLoggedIn(true);
                    } 
                }
                 else {
                    navigate('/login');
                    
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                
                navigate('/login');
            }
            finally{
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, token]);
   
   return (
    loading ? 
    <div className='loader_div'><Loader/></div> :
    <div>
        {props.children}
    </div>
);

}
