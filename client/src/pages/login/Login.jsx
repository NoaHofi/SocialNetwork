import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import { makeRequest } from "../../axios";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    rememberMe: "",
  });

const [err, setErr] = useState(null);

const navigate = useNavigate()

const handleChange = (e) => {
  const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  setInputs(prev => ({ ...prev, [e.target.name]: value }));
};

  const { login, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const validateToken = async () => {
        try {
              const response = await makeRequest.post('/userLogin/validateToken', null, {
                withCredentials: true
            });

              if (response.data.valid) {
                  navigate('/');
              }
            
        } catch (error) {
            console.error('Error validating token:', error);
        }
    }

    validateToken();
}, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault()
    try
    {
      const isLogin = await login(inputs);
      if (isLogin)
      {
        navigate("/")
      }
      else
      {
        setErr("Login failed.");
      }
    }
    catch(err)
    {
      setErr(err.response.data)
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>SportyNet</h1>
          <p>
            Welcome to SporyNet! 
            Connect with athletes, 
            sports fans, 
            and fitness enthusiasts worldwide. 
            Share achievements, 
            discuss games, and inspire others. 
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            {err && <p className="error-message">{err}</p>}
            <label>
            <input 
              type="checkbox" 
              name="rememberMe" 
              onChange={handleChange}
            />
            Remember me
          </label>
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
