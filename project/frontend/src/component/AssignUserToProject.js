import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssignUserToProject({ projectId }) {
    const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = 'http://localhost:4000/api/v1/getallusers';

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

  const handleAssignUser = async () => {
    console.log(selectedUser);
    try {
      const response = await axios.post('http://localhost:4000/api/v1/assignproject', {
        projectId,
        userId: selectedUser
      });
      console.log('User assigned to project:', response.data);
      // You can show a success message to the user if needed
    } catch (error) {
      console.error('Error assigning user to project:', error);
      // You can show an error message to the user if needed
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Assign User to Project</h2>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Select User</option>
        {users.map((user) => (
    // Check if the user's role is not "Admin"
    user.role !== 'Admin' && (
        <option key={user._id} value={user._id}>{user.fname}</option>
    )
))}

      </select>
      <button onClick={handleAssignUser}>Assign User</button>
    </div>
  );
}
