import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook from React Router
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword() {
    const { id, token } = useParams(); // Use useParams to get id and token from URL params
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Password submitted:", password);
        try {
            const response = await fetch(`http://localhost:4000/api/v1/resetpassword/${id}/${token}`, { // Update URL to use id and token
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }), // Simplified JSON.stringify
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const responseData = await response.json();
            const { message, success } = responseData; // Destructure response data

            console.log(message);

            if (message === "Password reset successfully") {
                toast.success(message); // Display success toast
            } else {
                toast.error(message); // Display error toast
            }

            console.log(responseData);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}
