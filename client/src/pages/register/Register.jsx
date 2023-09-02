import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import React, { useState } from "react";

const Register = () => {
    const [input, setInput] = useState({
        username: "",
        password: ""
    });

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('none');

    const handleChange = (e) => {
        setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        setStatus('none');
        setMessage('');

        try {
            const response = await axios.post("http://localhost:8000/userLogin/register", input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {  // Check if userId exists and is not null
                setStatus('success');
                setMessage('User registered successfully.');
            } else {
                setStatus('error');
                setMessage('Registration was not successful.');
            }
        } catch (error) {
            setStatus(error.response.data);
            setMessage(error.response.data);
            }
    };

    return (
        <div className="register">
            <div className="card">
                <div className="left">
                    <h1>SportyNet.</h1>
                    <p>
                        Join us and celebrate the power of sports. 
                        Let's make every moment count!
                    </p>
                    <span>Do you have an account?</span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Username" name="username" onChange={handleChange} />
                        <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                        <button type="submit">Register</button>
                    </form>
                    {status === 'error' && <div className="error-message">{message}</div>}
                    {status === 'success' && <div className="success-message">{message}</div>}
                </div>
            </div>
        </div>
    );
};

export default Register;
