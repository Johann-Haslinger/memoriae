import {
  Apple,
  BookOpen,
  Briefcase,
  Calculator,
  FolderIcon,
  Globe,
  Landmark,
  Languages,
  Leaf,
  Microscope,
  Music,
  PawPrint,
  Star,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Tooltip from "../Tooltip";

interface FolderIconPickerProps {
  selectedIcon: string;
  onSelect: (icon: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}

const ICON_SIZE_PX = 72;

type CategoryName =
  | "Folders & Files"
  | "School Subjects"
  | "Science"
  | "Math"
  | "Languages"
  | "History"
  | "Geography"
  | "Art & Music"
  | "Nature"
  | "Objects"
  | "Symbols"
  | "Animals"
  | "Food";

const CATEGORY_ICONS: Record<CategoryName, React.ElementType> = {
  "Folders & Files": FolderIcon,
  "School Subjects": BookOpen,
  Science: Microscope,
  Math: Calculator,
  Languages: Languages,
  History: Landmark,
  Geography: Globe,
  "Art & Music": Music,
  Nature: Leaf,
  Objects: Briefcase,
  Symbols: Star,
  Animals: PawPrint,
  Food: Apple,
};

// Predefined icon categories
const ICON_CATEGORIES: Record<CategoryName, string[]> = {
  "Folders & Files": [
    "📁",
    "📂",
    "🗂️",
    "📑",
    "📚",
    "📖",
    "📔",
    "📒",
    "📓",
    "📕",
    "📗",
    "📘",
    "📙",
  ],
  "School Subjects": [
    "📐",
    "📏",
    "📊",
    "📈",
    "📉",
    "🧮",
    "🔢",
    "🔤",
    "🔡",
    "🔠",
    "📝",
    "✏️",
    "📌",
  ],
  Science: [
    "🔬",
    "🧪",
    "🔭",
    "⚗️",
    "🧫",
    "🧬",
    "🧪",
    "🔍",
    "🔎",
    "⚛️",
    "🧪",
    "🧫",
    "🧬",
  ],
  Math: [
    "➕",
    "➖",
    "✖️",
    "➗",
    "🔢",
    "📊",
    "📈",
    "📉",
    "🧮",
    "📐",
    "📏",
    "⚖️",
    "🔢",
  ],
  Languages: [
    "🔤",
    "🔡",
    "🔠",
    "📝",
    "✏️",
    "📚",
    "📖",
    "📔",
    "📒",
    "📓",
    "📕",
    "📗",
    "📘",
  ],
  History: [
    "🏛️",
    "🗿",
    "🏺",
    "📜",
    "📚",
    "📖",
    "📔",
    "📒",
    "📓",
    "📕",
    "📗",
    "📘",
    "📙",
  ],
  Geography: [
    "🌍",
    "🗺️",
    "🗾",
    "🌎",
    "🌏",
    "🏔️",
    "🌋",
    "🗻",
    "🏕️",
    "⛰️",
    "🏞️",
    "🌅",
    "🌄",
  ],
  "Art & Music": [
    "🎨",
    "🎭",
    "🎪",
    "🎯",
    "🎲",
    "🎮",
    "🎸",
    "🎹",
    "🎺",
    "🎻",
    "🎼",
    "🎵",
    "🎶",
  ],
  Nature: [
    "🌳",
    "🌲",
    "🌴",
    "🌵",
    "🌸",
    "🌺",
    "🌻",
    "🌹",
    "🍀",
    "🌿",
    "🌱",
    "🌾",
    "🌷",
  ],
  Objects: [
    "💼",
    "🎒",
    "📦",
    "🎁",
    "📮",
    "📫",
    "📪",
    "📬",
    "📭",
    "🗳️",
    "📥",
    "📤",
    "📨",
  ],
  Symbols: [
    "⭐",
    "✨",
    "💫",
    "🌟",
    "💥",
    "🔥",
    "💯",
    "💢",
    "💤",
    "💦",
    "💨",
    "💭",
    "💬",
  ],
  Animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
  ],
  Food: [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
  ],
};

const FolderIconPicker: React.FC<FolderIconPickerProps> = ({
  selectedIcon,
  onSelect,
  show,
  setShow,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const iconBottomOffset = ICON_SIZE_PX / 2;
  const [activeCategory, setActiveCategory] =
    useState<CategoryName>("Folders & Files");

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, setShow]);

  return (
    <div className="relative">
      <div
        style={{
          position: "relative",
          bottom: iconBottomOffset,
          marginTop: 0,
          marginBottom: -iconBottomOffset,
          zIndex: 10,
        }}
        className="w-fit"
      >
        <Tooltip
          place="right"
          id="change-icon-tooltip"
          content="Change folder icon"
        >
          <button
            className="text-7xl ml-2 focus:outline-none hover:scale-110 transition-transform"
            onClick={() => setShow(!show)}
          >
            {selectedIcon || "📁"}
          </button>
        </Tooltip>
      </div>
      {show && (
        <div
          ref={menuRef}
          className="absolute pt-4 top-10 left-0 bg-[#333333] dark:bg-[#222222] border border-[#404040] dark:border-[#2a2a2a] rounded-lg shadow-lg p-3 z-20 w-80"
        >
          {/* Category Tabs */}
          <div className="flex space-x-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
            {Object.keys(ICON_CATEGORIES).map((category) => {
              const Icon = CATEGORY_ICONS[category as CategoryName];
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category as CategoryName)}
                  className={`px-2 py-0.5 rounded text-xs whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1 ${
                    activeCategory === category
                      ? "bg-white text-black dark:bg-white dark:text-black"
                      : "text-gray-300 hover:bg-[#505050] dark:hover:bg-[#3a3a3a]"
                  }`}
                >
                  <Icon size={14} />
                  <span>{category}</span>
                </button>
              );
            })}
          </div>

          {/* Icons Grid */}
          <div className="grid grid-cols-4 gap-2 overflow-y-auto">
            {ICON_CATEGORIES[activeCategory].map((icon: string) => (
              <div className="flex justify-center items-center">
                <button
                  key={icon}
                  className={`text-2xl size-10 p-1 rounded-lg hover:bg-[#404040] dark:hover:bg-[#2a2a2a] transition-colors ${
                    selectedIcon === icon ? "bg-white/10" : ""
                  }`}
                  onClick={() => {
                    onSelect(icon);
                    setShow(false);
                  }}
                >
                  {icon}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderIconPicker;
