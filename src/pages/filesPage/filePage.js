import React, { useEffect } from 'react'
import Menubar from '../../components-chakra/Menubar/Menubar'
import "./filesPage.css"
import { ChatState } from '../../components-chakra/Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import FilesContent from '../../components-chakra/FilesContent/FilesContent';

const FilePage = () => {

    const navigate = useNavigate();
    const { user, fetchAgain, setFetchAgain } = ChatState();

    useEffect(
      () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo) {
          navigate("/");
        }
      },
      [fetchAgain],
      [navigate]
    );

  return (
    <div className="filePage">
      <Menubar></Menubar>
      Welcome to Files. Here you can send and recieve files to user already
      present in chai-n-chat system and call them.
      <FilesContent></FilesContent>
    </div>
  );
}

export default FilePage;
