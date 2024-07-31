import './App.css';
import ChatSection from './components/ChatSection/ChatSection';
import ChatUsers from './components/ChatUsers/ChatUsers';
import FilesContent from './components/FilesContent/FilesContent';
import Menubar from './components/Menubar/Menubar';

function App() {
  return (
    <div className="App">
      <Menubar></Menubar>
      <ChatUsers></ChatUsers>
      <ChatSection></ChatSection>
      <FilesContent></FilesContent>
    </div>
  );
}

export default App;
