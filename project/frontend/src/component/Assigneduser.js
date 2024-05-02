import React, { useEffect, useState } from 'react';
import AssignUserToProject from './AssignUserToProject';

export default function Assigneduser(props) {

    const apiUrl = 'http://localhost:4000/api/v1/users/';
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState([]);
   const project_id=props.project_id;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedUserDetails = [];

                // Loop through each assigned user ID and fetch user details
                for (const userId of props.assigneduser) {
                    const response = await fetch(apiUrl + userId);
                    if (response.ok) {
                        const userData = await response.json();
                        fetchedUserDetails.push(userData);
                    } else {
                        console.error('Error fetching user data:', response.statusText);
                        setLoading(false); // Set loading to false in case of error
                    }
                }

                // Set the fetched user details array in state
                setUserDetails(fetchedUserDetails);
                setLoading(false); // Set loading to false once all data is fetched
            } catch (err) {
                console.error('Error fetching user data:', err);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchData();
    }, [props.assigneduser]);

    console.log("User details:", userDetails);

    return (
        <div> 
            <ul>
                {userDetails.map((user, index) => (
                    <li key={index}>
                        <div>Name: {user.fname}{user.lname}</div>
                        <div>Email: {user.email}</div>
                        
                    </li>
                ))}
            </ul>
            <div>
              <AssignUserToProject projectId={project_id}/>

            </div>
        </div>
    );
}
