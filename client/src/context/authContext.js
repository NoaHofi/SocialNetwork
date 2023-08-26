import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");

  const [currentUser, setCurrentUser] = useState(
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null
  );

  const login = async (inputs) => {
    try {
      const res = await axios.post("http://localhost:8000/userLogin/login", inputs, {
        withCredentials: true, // cookies 
      });
      console.log(res);
      
    
      setCurrentUser(res.data);
       
    } catch (error) {
      console.error('Error during login request:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
