import React from "react";
import { createPortal } from "react-dom";

type Props = {
  zIndex?: number;
};

/**
 * Heads up display container which portals all Hud Components out to the body and applies safe area styling - should be used for all game Hud components
 */
export const HudContainer: React.FC<Props> = ({ zIndex = 10, children }) => {
  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className="fixed inset-safe-area pointer-events-none"
          style={{
            zIndex: zIndex,
          }}
        >
          <div className="pointer-events-auto">{children}</div>
        </div>,
        document.body,
      )}
    </>
  );
};
