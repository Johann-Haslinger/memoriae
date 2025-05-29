import { ArrowUp, PanelRight, Plus } from "lucide-react";
import React, { useState } from "react";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import Tooltip from "./Tooltip";

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
  const [isOpen, setIsOpen] = useState(true);
  const [contextFolders, setContextFolders] = useState<ContextFolder[]>([
    { id: "1", name: "src/components" },
    { id: "2", name: "src/utils" },
  ]);

  // Add keyboard shortcut for toggling chat
  useKeyboardShortcut(
    { key: "b", meta: true, alt: true },
    () => {
      console.log("Chat toggle shortcut triggered");
      setIsOpen((prev) => !prev);
    },
    [setIsOpen]
  );

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

  // Chat window width for animation
  const chatWidth = isOpen ? 384 : 40; // 384px for w-96, 40px for collapsed state

  return (
    <aside
      className="h-full bg-gray-100 dark:bg-white/[0.08] flex flex-col text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out relative"
      style={{
        width: chatWidth,
        minWidth: isOpen ? 384 : 40,
      }}
    >
      {isOpen ? (
        <>
          <div className="p-4 flex-1 flex flex-col">
            {/* Close button */}
            <div className="w-full flex justify-end mb-2">
              <Tooltip
                id="close-chat-tooltip"
                content="Close chat"
                shortcut={["⌘", "⌥", "B"]}
                place="left-end"
              >
                <button
                  className="p-1.5 hover:bg-slate-200 rounded-lg dark:hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <PanelRight
                    size={22}
                    className="text-slate-500 dark:text-white/60"
                  />
                </button>
              </Tooltip>
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
              <div className="relative bg-white dark:bg-[#1a1919] rounded-2xl">
                {/* Top Bar */}
                <div className="flex items-centers space-x-2 p-3 pb-2">
                  <Tooltip
                    id="add-context-tooltip"
                    content="Add context folder"
                  >
                    <button
                      type="button"
                      className="bg-white dark:bg-[#212020] rounded-full border-gray-300 dark:border-white/5 text-xs p-1 h-fit px-1.5"
                      title="Add context folder"
                    >
                      @
                    </button>
                  </Tooltip>

                  {/* Context Folders */}
                  {contextFolders.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {contextFolders.map((folder) => (
                        <div
                          key={folder.id}
                          className="flex dark:text-white/80 items-center gap-1 px-2 py-1 bg-white dark:bg-[#212020] rounded-full  border-gray-300 dark:border-white/5 text-xs"
                        >
                          <span>{folder.name}</span>
                          <Tooltip
                            id={`remove-folder-${folder.id}`}
                            content="Remove folder"
                          >
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
                          </Tooltip>
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
                  className="w-full h-12 text-sm px-3 placeholder:text-white/30 bg-transparent focus:outline-none resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />

                {/* Bottom Bar */}
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <Tooltip id="add-resources-tooltip" content="Add resources">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 dark:text-white/50"
                      title="Add resources"
                    >
                      <Plus size={22} />
                    </button>
                  </Tooltip>

                  <Tooltip id="send-message-tooltip" content="Send message">
                    <button
                      type="submit"
                      className={`
                        size-7 rounded-full flex items-center justify-center
                        bg-blue-500 text-white
                        dark:bg-white/20 dark:text-black/70
                        hover:opacity-90 active:opacity-70
                        hover:bg-blue-600 dark:hover:bg-white
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        transition-all
                      `}
                    >
                      <ArrowUp size={20} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <Tooltip
          id="open-chat-tooltip"
          content="Open chat"
          shortcut={["⌘", "⌥", "B"]}
        >
          <button
            className="h-screen flex items-center justify-center w-10 bg-white dark:bg-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
          >
            <PanelRight
              className="text-slate-500 dark:text-white/60"
              size={22}
            />
          </button>
        </Tooltip>
      )}
    </aside>
  );
};

export default ChatWindow;
