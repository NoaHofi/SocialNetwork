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
      
      if (res.status === 200) { // Check if the status code is 200 OK
        setCurrentUser(res.data);
        return true;
      } else {
        console.log("Login failed"); // Display message for failed login
        return false;
      }
       
    } catch (error) {
      console.error('Error during login request:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log(`CurrentUser:${currentUser}`)
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
