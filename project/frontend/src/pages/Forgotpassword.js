import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
    const apiUrl = "http://localhost:4000/api/v1/forgotpassword";
    const [email, setEmail] = useState("");

    function handleChange(e) {
        setEmail(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Simplified JSON.stringify
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const responseData = await response.json();
            const { message, status } = responseData; // Destructure response data

            console.log(message);
            console.log(status);

            if (message == "Email has been sent on your mail") {
                toast.success(message); // Display success toast
            } else {
                toast.error(message); // Display error toast
            }

            console.log(responseData);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>OH MY GOD YOU FORGOT YOUR PASSWORD</p>
                <p>But do not worry just tell me your registered email id we will send a link</p>
                <input type="text" value={email} onChange={handleChange} />
                <button type="submit">Submit</button> {/* Added type="submit" */}
            </form>
        </div>
    );
}
