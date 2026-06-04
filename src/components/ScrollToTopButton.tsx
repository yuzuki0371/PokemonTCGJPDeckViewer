import { useState, useEffect } from "react";
import { UI_CONFIG } from "../constants";

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(prev => {
        const next = window.scrollY > UI_CONFIG.SCROLL_TO_TOP_THRESHOLD;
        return prev === next ? prev : next;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-blue-500 p-3 text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="ページトップへ戻る"
    >
      <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M8 12a.75.75 0 0 0 .75-.75V5.56l2.72 2.72a.75.75 0 1 0 1.06-1.06L8.53 3.22a.75.75 0 0 0-1.06 0L3.47 7.22a.75.75 0 0 0 1.06 1.06L7.25 5.56v5.69c0 .414.336.75.75.75z"
        />
      </svg>
    </button>
  );
};
