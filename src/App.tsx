import { useEffect } from "react";
import { AuthView } from "./components/AuthView";
import ChatWindow from "./components/ChatWindow";
import CommandMenu from "./components/CommandMenu";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const { user, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <CommandMenu />
      <MainContent />
      <ChatWindow />
    </div>
  );
};

export default App;
