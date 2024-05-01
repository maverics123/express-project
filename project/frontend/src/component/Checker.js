import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Loader from './Loader';

export default function Checker(props) {
    const apiUrl = 'http://localhost:4000/api/v1/tokenvalidity';
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);

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
                console.log(data);

                if (response.ok) {
                    setLoading(false);
                } else {
                    if (response.status === 401) {
                        navigate('/login');
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
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
