import React from 'react'
import Sidebar from '../component/Sidebar'
import { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Addproject() {
    const apiUrl = 'http://localhost:4000/api/v1/addproject'; 
    const [errorMessage1,setErrorMessage1] = useState("")
   const [errorMessage2,setErrorMessage2] = useState("")
    const [formData , setFormData] = useState({
        title:'',
        description:''
    });

  async function handleSubmit(e){
    e.preventDefault();
    let hasError = false;

    switch(true){
        case formData.title === "":
            setErrorMessage1("title is required");
                   hasError = true;
                   break;
        case formData.description === "":
                 setErrorMessage2("description is required");
                 hasError = true;
                 break;
    }

    if(!hasError){
        console.log(formData);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const responseData = await response.json();
            var message = responseData.message;
            if(responseData.success ==true){
                toast.success(message);
                console.log("i am trye");
            }
            if (!response.ok) {
                var errorMessage = responseData.message;
                throw new Error(errorMessage);
            }
        
            
            console.log(responseData);
            
        
            
        
        } catch (error) {
            console.error('There was a problem with the fetch operation:',error);
            toast.error(message);
           
            }

        }
        
    
     }
    

   



  
  function handleInputChange(e){
    const{name,value} = e.target;
    setFormData({...formData, [name]:value});

    switch (name) {
        case 'title':
            setErrorMessage1(value === "" ? "title is required" : "");
            break;
        case 'description':
            setErrorMessage2(value === "" ? "description is required" : "");
        default:
            break;
    }
  }



  return (
    <div className='admin_dash'>
     <Sidebar/>
   <div className='admin_main_content'>
      <h1>Add New Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
        <label for="title">Title</label>
        <input type='text' id="title" name="title" onChange={handleInputChange}/>
        <div className='error_message'>{errorMessage1}</div>
        </div>
        <div>
        <label for="description">Dscription</label>
        <textarea id="description" name="description" onChange={handleInputChange}></textarea>
        <div className='error_message'>{errorMessage2}</div>
        </div>

        <button>Add Project</button>
      </form>
 </div>
    </div>
  )
}
