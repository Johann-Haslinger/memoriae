import ChatWindow from "./components/ChatWindow";
import CommandMenu from "./components/CommandMenu";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MainContent />
      <ChatWindow />
      <CommandMenu />
    </div>
  );
};

export default App;
