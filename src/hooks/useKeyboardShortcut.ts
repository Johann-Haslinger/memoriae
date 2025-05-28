import type { DependencyList } from "react";
import { useEffect } from "react";

type KeyCombo = {
  key: string;
  meta?: boolean;
  alt?: boolean;
  shift?: boolean;
  ctrl?: boolean;
};

export const useKeyboardShortcut = (
  combo: KeyCombo,
  callback: () => void,
  deps: DependencyList = []
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, meta, alt, shift, ctrl } = combo;

      // Get the base key without modifiers
      const baseKey = key.toLowerCase();
      const pressedKey = event.key.toLowerCase();

      // Check if the key matches, ignoring the Option key modification
      const keyMatches =
        pressedKey === baseKey ||
        (alt && event.altKey && event.code.toLowerCase() === `key${baseKey}`);

      const metaMatches = meta ? event.metaKey : !event.metaKey;
      const altMatches = alt ? event.altKey : !event.altKey;
      const shiftMatches = shift ? event.shiftKey : !event.shiftKey;
      const ctrlMatches = ctrl ? event.ctrlKey : !event.ctrlKey;

      if (
        keyMatches &&
        metaMatches &&
        altMatches &&
        shiftMatches &&
        ctrlMatches
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    combo.key,
    combo.meta,
    combo.alt,
    combo.shift,
    combo.ctrl,
    callback,
    ...deps,
  ]);
};
