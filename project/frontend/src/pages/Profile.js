import React, { useState, useEffect } from 'react';
import './Profile.css';

export default function Profile() {
  const apiUrl = 'http://localhost:4000/api/v1/profile';
  const imageUrl = 'http://localhost:4000/api/v1/imagepdate';
  const [userData, setUserData] = useState(null);


  const imageUploader = async (event) => {
    const file = event.target.files[0];
    const token = localStorage.getItem('token');
        console.log('File Name:', file.name);
        console.log('File Size:', file.size, 'bytes');
        console.log('File Type:', file.type);

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);
        
        // Convert FormData to plain JavaScript object
        const formDataObject = {};
        for (const [key, value] of formData.entries()) {
          formDataObject[key] = value;
        }
        
        // Now you can log the formDataObject
        console.log(formDataObject);
        const response = await fetch(imageUrl ,{
          method: 'POST',
          headers: {
            // No need to set Content-Type header for FormData
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
  
        const responseData = await response.json();
        console.log(responseData);
  
       
        setUserData((prevData) => ({
          ...prevData,
          profileUrl: responseData.user.profileUrl
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Pass token in the Authorization header
          },
        
        });
        var responseData = await response.json();
        responseData=responseData.userProfile;
        console.log(responseData);
        setUserData(responseData);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {userData && (
        <div>
          <div className="main_full_div">
            <div className='sidebar'>
            <img src={userData.profileUrl} alt="profile image" className='image_max' />

                 <input type="file"  onChange={imageUploader}/>
            </div>
            <div className='right_side'>
                
              <h1> hi {userData.fname} {userData.lname}, Welcome to the profile page</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
