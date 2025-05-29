import { Tooltip as ReactTooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";

interface TooltipProps {
  id: string;
  content: string;
  children: React.ReactNode;
  place?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
  shortcut?: string[];
}

const Tooltip = ({
  id,
  content,
  children,
  place = "top",
  shortcut,
}: TooltipProps) => {
  return (
    <>
      <div data-tooltip-id={id}>{children}</div>
      <ReactTooltip
        id={id}
        place={place}
        className="z-5 text-sm"
        style={{
          backgroundColor: "rgba(0, 0, 0)",
          borderRadius: "10px",
          whiteSpace: "normal",
          maxWidth: "90vw",
          zIndex: 9999,
        }}
      >
        <div className="flex flex-col items-center">
          <p className="font-medium">{content}</p>
          <div className="flex space-x-1 items-center opacity-60">
            {shortcut}
          </div>
        </div>
      </ReactTooltip>
    </>
  );
};

export default Tooltip;
