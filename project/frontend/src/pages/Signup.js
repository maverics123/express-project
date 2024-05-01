import React, { useState }  from 'react'
import '../component/Signup.css';
import { AiFillEye } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    {console.log("i am in dashboard")}
     const navigate = useNavigate();
   const apiUrl = "http://localhost:4000/api/v1/signup"; 
    const [isVisible, setVisisble] = useState("password");
    function visibilityHandler(){
        if(isVisible=="password"){
            setVisisble("text")
        }
        else{
            setVisisble("password")
        }
    }



  const [errorMessage1, setErrorMessage1] = useState("");
    const [errorMessage2, setErrorMessage2] = useState("");
    const [errorMessage3, setErrorMessage3] = useState("");
    const [errorMessage4, setErrorMessage4] = useState("");
    const [errorMessage5, setErrorMessage5] = useState("");
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        gender: '',
        });

        function handleInputChange(e){
            const{name,value} = e.target;
            setFormData({...formData, [name]:value});
            switch (name) {
               case 'fname':
                   setErrorMessage1(value === "" ? "first name is required" : "");
                   break;
               case 'lname':
                   setErrorMessage2(value === "" ? "Last name is required" : "");
                   break;
               case 'email':
                   setErrorMessage3(value === "" ? "Email is required" : "");
                   break;
               case 'gender':
                   setErrorMessage4(value === "" ? "Gender is required" : "");
                   break;
               case 'password':
                   setErrorMessage5(value === "" ? "Password is required" : "");
                   break;
               default:
                   break;
           }
        };
         
       async function handleSubmit(e){
            e.preventDefault();
            let hasError = false;

        switch (true) {
           
            
            case formData.fname === "":
                setErrorMessage1("First name is required");
                hasError = true;
                break;
            case formData.lname === "":
                setErrorMessage2("Last name is required");
                hasError = true;
                break;
                case formData.email === "":
                  setErrorMessage3("Email is required");
                  hasError = true;
                  break;
                  case formData.gender === "":
                     setErrorMessage4("Gender is required");
                     hasError = true;
                     break;
                  case formData.password === "":
                setErrorMessage5("Password is required");
                hasError = true;
                break;
           
            case formData.password.length < 8:
                setErrorMessage5("Password is less than eight characters");
                hasError = true;
                break;
            case !/[A-Z]/.test(formData.password):
                setErrorMessage5("Password does not contain uppercase character");
                hasError = true;
                break;
            case !/[a-z]/.test(formData.password):
                setErrorMessage5("Password does not contain lowercase character");
                hasError = true;
                break;
            case !/[0-9]/.test(formData.password):
                setErrorMessage5("Password does not contain numbers");
                hasError = true;
                break;
            case !/[!@#$%^&*()_+{}\[\]:;<>,.?/~\\|\-]/.test(formData.password):
                setErrorMessage5("Password does not contain special character");
                hasError = true;
                break;
            default:
                // No errors
                break;
        }
             
        if (!hasError) {
               
           
             try{
                formData.profileUrl="";
               
               console.log(formData);
               const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            navigate("/login");
            console.log(response);
            console.log('Form data submitted successfully');
               
             } 
             catch (err){
                 console.log(err);
             }   
           
             }
              
        }
        
  return (
    <div className='signup_div'>
   
    <h1 className='signup_heading'>Signup</h1>
    <form className='signup_form' onSubmit={handleSubmit}>
       <div className="form_group">
          <label htmlFor="fname">First Name</label>
          <input type="text" id="fname" name="fname" onChange={handleInputChange} value={formData.fname} placeholder="Enter your first name"/>
          <div className='error_message'>{errorMessage1}</div>
       </div>
       <div className="form_group">
          <label htmlFor="lname">Last Name</label>
          <input type="text" name="lname"  id="lname" onChange={handleInputChange} value={formData.lname} placeholder="Enter your last name"/>
          <div className='error_message'>{errorMessage2}</div>
       </div>
       <div className="form_group">
          <label htmlFor="email">Email</label>
          <input type="text"  name="email" id="email" onChange={handleInputChange} value={formData.email}/>
          <div className='error_message'>{errorMessage3}</div>
       </div>
       <div className="form_group">
          <label htmlFor="email">Gender</label>
          <select id="gender" name="gender" onChange={handleInputChange} value={formData.gender}>
          <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <div className='error_message'>{errorMessage4}</div>
        
       </div>
       <div className="form_group">
          <label htmlFor="password">Password</label>
          <div className='password_feild'>
          <input type={isVisible}  id="password" name="password" onChange={handleInputChange} value={formData.password}/>
          <AiFillEye onClick={visibilityHandler}/>
          </div>
          <div className='error_message'>{errorMessage5}</div>
       </div>
       <div className="form_group">
                   <button className="signup_btn" type="submit">Signup</button>
                </div>
    </form>
    </div>
  )
}
