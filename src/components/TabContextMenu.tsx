import React from "react";
import type { Tab, TabType } from "../types/tabs";

interface TabContextMenuProps {
  availableTabs: Tab[];
  onSelect: (tab: TabType) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const TabContextMenu: React.FC<TabContextMenuProps> = ({
  availableTabs,
  onSelect,
  onClose,
  position,
}) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".tab-context-menu")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="tab-context-menu fixed z-50 bg-gray-900 rounded-lg shadow-lg border border-gray-800 py-1 min-w-[200px]"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      {availableTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            onSelect(tab.id);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2"
        >
          <tab.icon className={`size-4 ${tab.iconColor}`} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabContextMenu;
