import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Menubar.css'

const beforeColor = { background: "#FFFFFF" };
const afterColor = { background: "#E0F4F1" };

const Menubar = () => {

  const navigate = useNavigate();

    const [color1, setColor1] = useState(beforeColor);
    const [color2, setColor2] = useState(beforeColor);
    const [color3, setColor3] = useState(beforeColor);
    const [color4, setColor4] = useState(beforeColor);
    
    const loadChatsPage = () => {
      navigate("/chats");
    }
  return (
    <>
      <div className="menuContainer">
        {/* <div className="logo">
          <img src={logo} alt="logo" />
        </div> */}

        <div className="menus">
          <div
            onMouseOver={() => setColor1(afterColor)}
            onMouseOut={() => setColor1(beforeColor)}
            onClick={() => loadChatsPage()}
            style={color1}
            className="file1"
          >
            Chat
          </div>
          <div
            onMouseOver={() => setColor2(afterColor)}
            onMouseOut={() => setColor2(beforeColor)}
            onClick={() => navigate("/calls")}
            style={color2}
            className="file2"
          >
            Call
          </div>
          <div
            onMouseOver={() => setColor3(afterColor)}
            onMouseOut={() => setColor3(beforeColor)}
            onClick={() => navigate("/files")}
            style={color3}
            className="file3"
          >
            File
          </div>
          <div
            onMouseOver={() => setColor4(afterColor)}
            onMouseOut={() => setColor4(beforeColor)}
            style={color4}
            className="file4"
          ></div>
        </div>
      </div>
      {/* <div className="logo">Logo here</div>      
          <div className="menus">Menu options here</div> */}
    </>
  );
}

export default Menubar
