import { ArrowUp, MessageSquare, PanelRight, Plus } from "lucide-react";
import React, { useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ContextFolder {
  id: string;
  name: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isOpen, setIsOpen] = useState(true);
  const [contextFolders, setContextFolders] = useState<ContextFolder[]>([
    { id: "1", name: "src/components" },
    { id: "2", name: "src/utils" },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  if (!isOpen) {
    return (
      <button
        className="h-screen flex items-center justify-center w-10 bg-white dark:bg-white/[0.08] border-l border-slate-200 dark:border-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <PanelRight className="text-slate-500 dark:text-white/60" size={22} />
      </button>
    );
  }

  return (
    <aside className="w-96 h-full bg-gray-100 dark:bg-white/[0.08] border-l border-slate-200 dark:border-white/[0.05] p-4 flex flex-col text-gray-900 dark:text-gray-100">
      {/* Close button */}
      <div className="w-full flex justify-end mb-2">
        <button
          className="p-1.5 hover:bg-slate-200 rounded-lg dark:hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
        >
          <PanelRight size={22} className="text-slate-500 dark:text-white/60" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="relative">
        <div className="relative bg-white dark:bg-white/[0.03] rounded-xl border border-gray-300 dark:border-white/5">
          {/* Top Bar */}
          <div className="flex items-centers space-x-2 px-3 py-2">
            <button
              type="button"
              className="dark:text-white/80 hover:text-gray-700 text-gray-400 dark:hover:text-gray-200  dark:bg-black/5 border border-white/5 rounded-md text-xs p-1 h-fit px-1.5"
              title="Add context folder"
            >
              @
            </button>

            {/* Context Folders */}
            {contextFolders.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {contextFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex dark:text-white/80 items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-black/5 border border-white/5 rounded-md text-xs"
                  >
                    <span>{folder.name}</span>
                    <button
                      onClick={() =>
                        setContextFolders((folders) =>
                          folders.filter((f) => f.id !== folder.id)
                        )
                      }
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Textarea */}
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full h-16 text-sm px-3 placeholder:text-white/30 bg-transparent focus:outline-none resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />

          {/* Bottom Bar */}
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="px-2 py-1 text-sm  bg-white/5 rounded-full text-white/60 flex items-center gap-2">
              <MessageSquare size={14} />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="focus:outline-none text-sm bg-transparent"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5">GPT-3.5</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 dark:text-white/40"
                title="Add resources"
              >
                <Plus size={20} />
              </button>
              <button
                type="submit"
                className={`
                  size-7 rounded-full flex items-center justify-center
                  bg-blue-500 text-white
                  dark:bg-white/15 dark:text-black/70
                  hover:opacity-90 active:opacity-70
                  hover:bg-blue-600 dark:hover:bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all
                `}
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </aside>
  );
};

export default ChatWindow;
