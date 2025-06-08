import { useEffect } from "react";
import { AuthView } from "./components/AuthView";
import ChatWindow from "./components/chat/ChatWindow";
import CommandMenu from "./components/CommandMenu";
import MainContent from "./components/main-content/MainContent";
import Sidebar from "./components/sidebar/Sidebar";
import { useDisableZoom } from "./hooks/useDisableZoom";
import { useFolderStore } from "./store";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const { user, isLoading, initialize } = useAuthStore();
  const fetchFolders = useFolderStore((state) => state.fetchFolders);

  // Use the zoom prevention hook
  useDisableZoom();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

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

  // Fetch folders when component mounts and when selectedFolderId changes

  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <CommandMenu />
      <MainContent />
      <ChatWindow />
    </div>
  );
};

export default App;
