import './App.css';
import { Button } from '@chakra-ui/react';
import ChatPage from './pages/chatPage/chatPage';
import HomePage from './pages/homePage/homePage';
import { Outlet } from 'react-router-dom';

function App() {

  
  
  return (
    <div className="App">
        <Outlet/>
    </div>
  );
}

export default App;
