import React, { useState, useContext } from 'react';
import { AiFillEye } from "react-icons/ai";
import '../component/Login.css';
import { AuthContext } from '../App'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login() {
    const { isLoggedIn, setisLoggedIn } = useContext(AuthContext); 
   const apiUrl = 'http://localhost:4000/api/v1/login'; 
   const [errorMessage1,setErrorMessage1] = useState("")
   const [errorMessage2,setErrorMessage2] = useState("")
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        });
        const navigate = useNavigate();
        function handleInputChange(e){
         const{name,value} = e.target;
         setFormData({...formData, [name]:value});
         switch (name) {
            case 'email':
                setErrorMessage1(value === "" ? "Email is required" : "");
                break;
            case 'password':
                setErrorMessage2(value === "" ? "Password does not match criteria" : "");
            default:
                break;
        }
         

     };
        async  function handleSubmit(e){
         e.preventDefault();
         let hasError = false;

         switch (true) {
            
             
            
                 case formData.email === "":
                   setErrorMessage1("Email is required");
                   hasError = true;
                   break;
                   
                   case formData.password === "":
                 setErrorMessage2("Password does not match criteria");
                 hasError = true;
                 break;
            
             case formData.password.length < 8:
                 setErrorMessage2("Password is less than eight characters");
                 hasError = true;
                 break;
             case !/[A-Z]/.test(formData.password):
                 setErrorMessage2("Password does not contain uppercase character");
                 hasError = true;
                 break;
             case !/[a-z]/.test(formData.password):
                 setErrorMessage2("Password does not contain lowercase character");
                 hasError = true;
                 break;
             case !/[0-9]/.test(formData.password):
                 setErrorMessage2("Password does not contain numbers");
                 hasError = true;
                 break;
             case !/[!@#$%^&*()_+{}\[\]:;<>,.?/~\\|\-]/.test(formData.password):
                 setErrorMessage2("Password does not contain special character");
                 hasError = true;
                 break;
             default:
                 // No errors
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
                if(responseData.success ==true){
                    setisLoggedIn(true);
                      let token = responseData.token;
                      if(token != undefined){
                      localStorage.setItem('token', token);
                      
                      navigate("/dashboard")
                      }
                    
                      }
                if (!response.ok) {
                    // If response status is not in the range 200-299, it's an error
                    var errorMessage = responseData.message;
                    throw new Error(errorMessage);
                }
            
                
                console.log(responseData); // Log the response data
                var message = responseData.message;
            
                // Proceed with your logic here using responseData
            
            } catch (error) {
                // Handle errors
                console.error('There was a problem with the fetch operation:',error);
                // You may not have access to `message` here, so handle it accordingly
                toast.error(errorMessage);
            }
            
        
         }
         e.preventDefault();
        }
    const [isVisible, setVisisble] = useState("password");
    function visibilityHandler(){
         if(isVisible=="password"){
            setVisisble("text")
         }
         else{
            setVisisble("password")
         }
    }
  return (
    <div className='login_div'>
         <h1 className='login_heading'>Login</h1>
             <form className='login_form' onSubmit={handleSubmit}>
                <div className="form_group">
                  <label htmlFor="email">Username/Email Id</label>
                  <input type='email' name="email" value={formData.email} id="email" onChange={handleInputChange}/>
                  <div className='error_message'>{errorMessage1}</div>
                </div>
                <div className="form_group">
                  <label htmlFor="password">Password</label>
                  <div className='password_feild'>
                  <input type={isVisible} name="password" id="password" value={formData.password} onChange={handleInputChange}/>
                  <AiFillEye onClick={visibilityHandler}/>
                  </div>
                  <div className='error_message'>{errorMessage2}</div>
                </div>
                <div className="form_group">
                   <button className="login_btn" type="submit">Login</button>
                </div>
             </form>     
  
    </div>
  )
}
