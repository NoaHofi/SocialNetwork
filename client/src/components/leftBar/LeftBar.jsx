import "./leftBar.scss";
import Groups from "../../assets/2.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { makeRequest } from "../../axios";  


const LeftBar = () => {

  const [pages, setPages] = useState([]);
  const [err, setErr] = useState(null);
  // Fetch the pages
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await makeRequest.get('/admin/pages');
        if (response.status === 200) {
          const data = response.data;
          setPages(data.pages);          
        }
        else{
          setErr("Failed to fetch pages.");
        }

      } catch (error) {
        console.error("Failed to fetch pages:", error);
        setErr("Failed to fetch pages.");
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
          {err && <p className="error-message">{err}</p>}
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
