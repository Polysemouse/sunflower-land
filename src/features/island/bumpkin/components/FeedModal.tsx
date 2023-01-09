import React, { useContext } from "react";

import { getEntries } from "features/game/types/craftables";

import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Feed } from "./Feed";
import { Modal } from "react-bootstrap";
import foodIcon from "src/assets/food/chicken_drumstick.png";
import { CloseablePanel } from "features/game/components/CloseablePanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFeed: (name: ConsumableName) => void;
}
export const FeedModal: React.FC<Props> = ({ isOpen, onFeed, onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const availableFood = getEntries(CONSUMABLES)
    .filter(([name, _]) => !!state.inventory[name]?.gt(0))
    .map(([_, consumable]) => consumable);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <CloseablePanel
        onClose={onClose}
        tabs={[{ icon: foodIcon, name: "Feed Bumpkin" }]}
        bumpkinParts={state.bumpkin?.equipped}
      >
        <Feed food={availableFood} onFeed={onFeed} />
      </CloseablePanel>
    </Modal>
  );
};
