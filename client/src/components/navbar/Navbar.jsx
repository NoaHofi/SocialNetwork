import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link ,useNavigate} from "react-router-dom";
import { useState, useEffect,useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { makeRequest } from "../../axios";  // Assuming you have this axios config


const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const navigate = useNavigate();

  const logout = async (username) => {
    try {
      const response = await makeRequest.post('/userLogin/logout', { username: username });
      if (response.status === 201) {
        console.log(response.data.message);
        // Optionally, clear any client-side state or data related to the user
        setLoggedInUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error('Error during Logout:', error);
    }
  }
  

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await makeRequest.get('/userLogin/getLoggedInUser');
        setLoggedInUser(response.data);
      } catch (error) {
        console.error('Error fetching the logged-in user:', error);
      } finally {
        // This will be called after trying to fetch the user,
        // regardless of success or failure
        setIsUserFetched(true);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>lamasocial</span>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlinedIcon />
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}

      </div>
      <div className="right">
      <Link to="/profile" style={{ textDecoration: "none" }}>
        <PersonOutlinedIcon />
      </Link>
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          {loggedInUser ? (
           <>
           <span>{loggedInUser.username}</span>
           <ExitToAppOutlinedIcon onClick={() => logout(loggedInUser.username)} />
         </>)
          :( <span>Loding..</span>)}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
