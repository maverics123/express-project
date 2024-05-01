import React from 'react';

export default function User(props) {
  const apiUrl = 'http://localhost:4000/api/v1/deleteuser'; // Assuming this is the endpoint to delete a user
  // console.log(props);
  async function userDeleteHandler(id) {
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }) // Pass id in the request body
      });

      const data = await response.json();
      // console.log(data);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  }

  return (
    <div className='single_user_div'>
      <div className='username'>
        <span>{props.user.fname}</span>
        <span>{props.user.lname}</span>
      </div>
      <div className='email_user'>
      <span>{props.user.email}</span>
      </div>
      <button onClick={() => userDeleteHandler(props.user.id)}>Delete</button> {/* Pass id to userDeleteHandler */}
    </div>
  );
}
