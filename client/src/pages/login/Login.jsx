import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    rememberMe: false
  });

const [err, setErr] = useState(null);

const navigate = useNavigate()

const handleChange = (e) => {
  const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  setInputs(prev => ({ ...prev, [e.target.name]: value }));
};

  const { login, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Check if the user is already authenticated
    console.log(`useEffect: ${isAuthenticated}`)
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
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
