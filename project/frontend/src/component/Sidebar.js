import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'; 
export default function Sidebar() {
    const [isSuperAdmin,setisSuperAdmin]=useState(false);
    const apiUrl = 'http://localhost:4000/api/v1/tokenvalidity';
    const token = localStorage.getItem('token');

    useEffect(()=>{
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
                // console.log(data);
                // console.log(data.userProfile.isSuperAdmin);
                if(data.userProfile.isSuperAdmin==true){
                    setisSuperAdmin(true);
                }

               
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    });

  
   
  return (
    <div className='side_bar'>
          <ul className='sidebar_ul'>
             <li> <Link to="/adduser">Add user</Link></li>
             {isSuperAdmin ?  <li> <Link to="/addadmin">Add Admin</Link></li> : null}
             <li><Link to="/addproject">Add Project</Link></li>
             <li><Link to="/projects">Projects</Link></li>
          </ul>


    </div>
  )
}
