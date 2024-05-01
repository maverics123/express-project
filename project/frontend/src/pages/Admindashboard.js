import React, { useEffect, useState } from 'react';
import './Admin.css';
import User from '../component/User';
import Sidebar from '../component/Sidebar';

export default function Admindashboard() {
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
          console.log(data);
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
    <div className="admin_dash">
    <Sidebar/>
      <div className='admin_main_content'>
      <h1>List of All Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <User key={user._id} user={user}/>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}
