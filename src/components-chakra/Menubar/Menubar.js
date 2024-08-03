import React, { useState } from 'react'
import logo from "../../assets/chatlogominus.png";
import './Menubar.css'

const beforeColor = { background: "#FFFFFF" };
const afterColor = { background: "#E0F4F1" };

const Menubar = () => {
    const [color1, setColor1] = useState(beforeColor);
    const [color2, setColor2] = useState(beforeColor);
    const [color3, setColor3] = useState(beforeColor);
    const [color4, setColor4] = useState(beforeColor);
  return (
    <>
      <div className="menuContainer">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="menus">
          <div
            onMouseOver={() => setColor1(afterColor)}
            onMouseOut={() => setColor1(beforeColor)}
            style={color1}
            className="file1"
          ></div>
          <div
            onMouseOver={() => setColor2(afterColor)}
            onMouseOut={() => setColor2(beforeColor)}
            style={color2}
            className="file2"
          ></div>
          <div
            onMouseOver={() => setColor3(afterColor)}
            onMouseOut={() => setColor3(beforeColor)}
            style={color3}
            className="file3"
          ></div>
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
