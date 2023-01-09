import React from "react";
import { Modal } from "react-bootstrap";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseablePanel } from "features/game/components/CloseablePanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sealImg: string;
}

export const SealModal: React.FC<Props> = ({ isOpen, onClose, sealImg }) => {
  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <CloseablePanel
        onClose={onClose}
        title="Whoops! This isn't the Community Garden..."
      >
        <div className="flex justify-center items-center gap-6 mb-3">
          <img
            src={sealImg}
            style={{
              width: `${PIXEL_SCALE * 40}px`,
            }}
          />
        </div>
      </CloseablePanel>
    </Modal>
  );
};
