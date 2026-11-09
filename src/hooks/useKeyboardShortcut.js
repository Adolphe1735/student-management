import { useEffect } from "react";

// Reusable custom hook (Requirement #7)
export default function useKeyboardShortcut(key, callback, options = {}) {
  const { ctrl = false } = options;

  useEffect(() => {
    const handler = (event) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = ctrl ? event.ctrlKey || event.metaKey : true;

      if (keyMatch && ctrlMatch) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, ctrl]);
}