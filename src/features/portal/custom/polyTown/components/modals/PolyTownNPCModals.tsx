import { SpeakingModal } from "features/game/components/SpeakingModal";
import React, { useContext, useEffect, useState } from "react";

import { ModalContext } from "features/game/components/modal/ModalProvider";
import { SceneId } from "features/world/mmoMachine";
import { isPolyTownNpcAcknowledged } from "../../lib/polyTownNpcs";
import { POLY_TOWN_NPC_DIALOGS } from "../../lib/consts/npcDialogs";
import { PolyTownNpcName } from "../../lib/consts/nameTypes";
import { POLY_TOWN_NPC_WEARABLES } from "../../lib/consts/npcWearables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { translate } from "lib/i18n/translate";
import { Modal } from "components/ui/Modal";

interface ManagerProps {
  npc: PolyTownNpcName;
  changeScene: (scene: SceneId) => void;
}

class PolyTownNpcModalManager {
  private listener?: (props: ManagerProps, isOpen: boolean) => void;

  public open(props: ManagerProps) {
    if (this.listener) {
      this.listener(props, true);
    }
  }

  public listen(cb: (props: ManagerProps, isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const polyTownNpcModalManager = new PolyTownNpcModalManager();

interface Props {
  scene: SceneId;
}

function getInitialPolyTownNpc(scene: SceneId): PolyTownNpcName | undefined {
  if (scene === "poly_town_plaza" && !isPolyTownNpcAcknowledged("poly bear")) {
    return "poly bear";
  }

  return undefined;
}

export const PolyTownNpcModals: React.FC<Props> = ({ scene }) => {
  const [npc, setNpc] = useState<PolyTownNpcName | undefined>(
    getInitialPolyTownNpc(scene)
  );
  const [changeScene, setChangeScene] = useState<(scene: SceneId) => void>();

  const { openModal } = useContext(ModalContext);

  useEffect(() => {
    polyTownNpcModalManager.listen(({ npc, changeScene }, open) => {
      setNpc(npc);
      setChangeScene(() => changeScene);
    });
  }, []);

  const closeModal = () => {
    setNpc(undefined);
  };

  const npcWearables = npc ? POLY_TOWN_NPC_WEARABLES[npc] : undefined;

  if (npc === "burt") {
    return (
      <Modal show={!!npc} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal} bumpkinParts={npcWearables}>
          {translate("yes") + translate("no")}
          <Button onClick={closeModal}>{translate("no")}</Button>
          <Button
            onClick={() => {
              changeScene?.("poly_town_plaza");
              closeModal();
            }}
          >
            {translate("yes")}
          </Button>
        </CloseButtonPanel>
      </Modal>
    );
  }

  if (npc === "wynken") {
    return (
      <Modal show={!!npc} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal} bumpkinParts={npcWearables}>
          {translate("yes") + translate("no")}
          <Button onClick={closeModal}>{translate("no")}</Button>
          <Button
            onClick={() => {
              changeScene?.("poly_town_crop_hunt");
              closeModal();
            }}
          >
            {translate("yes")}
          </Button>
        </CloseButtonPanel>
      </Modal>
    );
  }

  const npcDialog = npc ? POLY_TOWN_NPC_DIALOGS[npc] : [{ text: "" }];

  return (
    <Modal show={!!npc} onHide={closeModal}>
      <SpeakingModal
        onClose={closeModal}
        message={npcDialog}
        bumpkinParts={npcWearables}
      />
    </Modal>
  );
};
