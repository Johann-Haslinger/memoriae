import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ChatWindow from './components/ChatWindow';

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MainContent />
      <ChatWindow />
    </div>
  );
}

export default App;