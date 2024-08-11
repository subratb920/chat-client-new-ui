import React, { useEffect, useState } from "react";
import Menubar from "../../components-chakra/Menubar/Menubar";
import CallUsers from "../../components-chakra/CallUsers/CallUsers";
import CallSection from "../../components-chakra/CallSection/CallSection";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../components-chakra/Context/ChatProvider";
import FilesContent from "../../components-chakra/FilesContent/FilesContent";
import "./callsPage.css";

const CallsPage = () => {

  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const navigate = useNavigate();

  // console.log(user);

  // if (!user) {
  //   navigate("/");
  // }

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

    return (
        <div className="callPage">
            <Menubar></Menubar>
            {/* {user && (
                <CallUsers
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                ></CallUsers>
            )}
            {user && (
                <CallSection
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                ></CallSection>
            )} */}
            <FilesContent></FilesContent>
        </div>
    );
};

export default CallsPage;
