import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useContext } from "react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { makeRequest } from "../../axios";  


const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);
  const [pages, setPages] = useState([]);

  // Fetch the pages' status when the component mounts
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await makeRequest.get('/admin/pages');
        const data = response.data; // assuming the response structure has a data property
        setPages(data.pages);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      }
    };

    fetchPages();
}, []);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
          <Link to="/profile">
            <PersonOutlinedIcon />
          </Link>
          </div>
          {pages.find(page => page.pageName === "Scheduler" && page.enabled) && (
            <div className="item">
              <img src={Events} alt="" />
              <a href="/schedualer.html">Games Calender</a>
            </div>
          )}
          {pages.find(page => page.pageName === "HealthTips" && page.enabled) && (
            <div className="item">
              <img src={Groups} alt="" />
              <a href="/healthTips.html">Health Tips</a>
            </div>
          )}
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>Events</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
