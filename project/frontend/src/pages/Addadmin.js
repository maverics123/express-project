import React, { useEffect, useState } from 'react';
import './Admin.css';
import Sidebar from '../component/Sidebar';
import Addsingleadmin from '../component/Addsingleadmin';

export default function Addadmin() {
  const apiUrl = 'http://localhost:4000/api/v1/getallusers';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          console.log("user data is",data);
          setLoading(false);
        } else {
          console.error('Error fetching data:', response.statusText);
          setLoading(false); // Set loading to false in case of error
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  return (
    <div className='admin_dash'>
   <Sidebar/>
   <div className='admin_main_content'>
   {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <Addsingleadmin key={user._id} user={user}/>
          ))}
        </ul>
      )}
 </div>
    </div>
  )
}
