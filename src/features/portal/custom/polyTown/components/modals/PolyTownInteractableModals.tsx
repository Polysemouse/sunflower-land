import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { POLY_TOWN_MESSAGES } from "../../lib/consts/messages";
import { PolyTownInteractableName } from "../../lib/consts/nameTypes";

class PolyTownInteractableModalManager {
  private listener?: (name: PolyTownInteractableName, isOpen: boolean) => void;

  public open(name: PolyTownInteractableName) {
    if (this.listener) {
      this.listener(name, true);
    }
  }

  public listen(cb: (name: PolyTownInteractableName, isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const polyTownInteractableModalManager =
  new PolyTownInteractableModalManager();

interface Props {
  id: number;
}

export const PolyTownInteractableModals: React.FC<Props> = ({ id }) => {
  const [interactable, setInteractable] = useState<PolyTownInteractableName>();

  useEffect(() => {
    polyTownInteractableModalManager.listen((interactable, open) => {
      setInteractable(interactable);
    });
  }, []);

  const closeModal = () => {
    setInteractable(undefined);
  };

  const message = interactable
    ? POLY_TOWN_MESSAGES[interactable]
    : [{ text: "" }];

  return (
    <Modal centered show={!!interactable} onHide={closeModal}>
      <SpeakingModal onClose={closeModal} message={message} />
    </Modal>
  );
};
