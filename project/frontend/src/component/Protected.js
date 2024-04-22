import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Protected(props) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate("/login");
        }
    }, [navigate]); // Added navigate to dependency array

    // Conditionally render children based on token
    return localStorage.getItem('token') ? (
        <div>
            {props.children}
        </div>
    ) : null;
}
