import { useEffect } from "react";

export const useDisableZoom = () => {
  useEffect(() => {
    // Function to prevent zooming
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Function to prevent double tap zoom
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;

      if (now - lastTap < DOUBLE_TAP_DELAY) {
        e.preventDefault();
      }

      lastTap = now;
    };

    // Function to prevent pinch zoom
    const preventPinchZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Variables to track touch events
    let lastTap = 0;
    let initialTouchDistance = 0;

    // Function to calculate distance between two touch points
    const getTouchDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Function to prevent pinch zoom
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialTouchDistance = getTouchDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialTouchDistance;

        if (scale !== 1) {
          e.preventDefault();
        }
      }
    };

    // Add event listeners
    document.addEventListener("touchstart", preventZoom, { passive: false });
    document.addEventListener("touchstart", preventDoubleTapZoom, {
      passive: false,
    });
    document.addEventListener("touchmove", preventZoom, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("wheel", preventPinchZoom, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    // Cleanup function
    return () => {
      document.removeEventListener("touchstart", preventZoom);
      document.removeEventListener("touchstart", preventDoubleTapZoom);
      document.removeEventListener("touchmove", preventZoom);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("wheel", preventPinchZoom);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);
};
