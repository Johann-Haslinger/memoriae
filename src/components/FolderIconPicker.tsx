import React, { useEffect, useRef } from "react";
import Tooltip from "./Tooltip";

interface FolderIconPickerProps {
  iconOptions: string[];
  selectedIcon: string;
  onSelect: (icon: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  coverImage?: string;
}

const ICON_SIZE_PX = 72;

const FolderIconPicker: React.FC<FolderIconPickerProps> = ({
  iconOptions,
  selectedIcon,
  onSelect,
  show,
  setShow,
  coverImage,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const hasCover = !!coverImage;
  const iconBottomOffset = ICON_SIZE_PX / 2;

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
    <div
      className={hasCover ? "relative" : "mt-10"}
      style={hasCover ? {} : undefined}
    >
      <div
        style={
          hasCover
            ? {
                position: "relative",
                bottom: iconBottomOffset,
                marginTop: 0,
                marginBottom: -iconBottomOffset,
                zIndex: 10,
              }
            : undefined
        }
        className="w-fit"
      >
        <Tooltip
          place="right"
          id="change-icon-tooltip"
          content="Change folder icon"
        >
          <button
            className={
              "text-7xl ml-2 focus:outline-none hover:scale-110 transition-transform" +
              (hasCover ? "" : " mb-2")
            }
            onClick={() => setShow(!show)}
          >
            {selectedIcon || "📁"}
          </button>
        </Tooltip>
      </div>
      {show && (
        <div
          ref={menuRef}
          className="absolute pt-5 top-10 left-0 bg-[#333333] dark:bg-[#222222] border border-[#404040] dark:border-[#2a2a2a] rounded-lg shadow-lg p-3 z-20 w-80"
        >
          <div className="grid grid-cols-4 gap-2">
            {iconOptions.map((icon) => (
              <button
                className={`text-2xl p-1 rounded hover:bg-[#404040] dark:hover:bg-[#2a2a2a] transition-colors ${
                  selectedIcon === icon ? "ring-2 ring-white" : ""
                }`}
                onClick={() => {
                  onSelect(icon);
                  setShow(false);
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderIconPicker;
