import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link ,useNavigate} from "react-router-dom";
import { useState, useEffect,useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { makeRequest } from "../../axios"; 


const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const navigate = useNavigate();
  const [err, setErr] = useState(null);


  const logout = async (username) => {
    try {
      const response = await makeRequest.post('/userLogin/logout', { username: username });
      if (response.status === 200) {
        console.log(response.data.message);
        setLoggedInUser(null);
        navigate("/login");
      }
      else{
        setErr("Failed to logout.");
      }
    } catch (error) {
      console.error('Error during Logout:', error);
      setErr("Failed to logout.");
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
        setIsUserFetched(true);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>SportyNet</span>
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
      <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlinedIcon />
      </Link>
      <Link to="/profile" style={{ textDecoration: "none" }}>
        <PersonOutlinedIcon />
      </Link>
        <div className="user">
          {loggedInUser ? (
           <>
           <span>{loggedInUser.username}</span>
           <ExitToAppOutlinedIcon onClick={() => logout(loggedInUser.username)} />
         </>)
          :( <span>Loading..</span>)}
          {err && <p className="error-message">{err}</p>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
