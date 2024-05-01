import React from 'react'

export default function Addsingleadmin(props) {
    const apiUrl = 'http://localhost:4000/api/v1/addadmin';
    async function userAdminHandler(id) {
        console.log("user id is:",id)
        try {
          const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id }) // Pass id in the request body
          });
    
          const data = await response.json();
          console.log(data);
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
      <div className='role_user'>
        <span>Role:</span><span>{props.user.role}</span>
      </div>
      <button onClick={() => userAdminHandler(props.user._id)}>Make Admin</button> 
    </div>
  )
}
