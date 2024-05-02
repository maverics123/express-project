import React, { useState, useEffect } from 'react'
import Sidebar from '../component/Sidebar'
import Project from '../component/Project';
import './Projects.css'

export default function Projects() {
    const apiUrl = 'http://localhost:4000/api/v1/allprojects';
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(apiUrl, {
              method: 'GET',
            });
    
            if (response.ok) {
              const data = await response.json();
              setProjects(data);
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
    <div className='admin_dash'>
   <Sidebar/>
   <div className='admin_main_content'>
      <h1>List of All Projects</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className='all_projects'>
          {projects.map((project) => (
           <li> <Project key={project._id} project={project}/></li>
          ))}
        </ul>
      )}
      </div>
    </div>
  )
}
