import React, { useContext } from "react";

import { useActor } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { PortalContext, PortalProvider } from "./lib/PortalProvider";
import { CropsAndChickensHud } from "features/portal/examples/cropsAndChickens/components/CropsAndChickensHud";
import { CropsAndChickensPhaser } from "./CropsAndChickensPhaser";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { secondsToString } from "lib/utils/time";
import {
  authorisePortal,
  goHome,
} from "features/portal/examples/cropBoom/lib/portalUtil";
import { CropsAndChickensRules } from "./components/CropsAndChickensRules";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import { SquareIcon } from "components/ui/SquareIcon";

export const CropsAndChickensApp: React.FC = () => {
  return (
    <PortalProvider>
      <CropsAndChickens />
    </PortalProvider>
  );
};

export const CropsAndChickens: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);
  const { t } = useAppTranslation();

  return (
    <div>
      {portalState.matches("error") && (
        <Modal show>
          <Panel>
            <div className="p-2">
              <Label type="danger">{t("error")}</Label>
              <span className="text-sm my-2">{t("error.wentWrong")}</span>
            </div>
            <Button onClick={() => portalService.send("RETRY")}>
              {t("retry")}
            </Button>
          </Panel>
        </Modal>
      )}

      {portalState.matches("loading") && (
        <Modal show>
          <Panel>
            <span className="loading">{t("loading")}</span>
          </Panel>
        </Modal>
      )}

      {portalState.matches("unauthorised") && (
        <Modal show>
          <Panel>
            <div className="p-2">
              <Label type="danger">{t("error")}</Label>
              <span className="text-sm my-2">{t("session.expired")}</span>
            </div>
            <Button onClick={authorisePortal}>{t("welcome.login")}</Button>
          </Panel>
        </Modal>
      )}

      {portalState.matches("idle") && (
        <Modal show>
          <Panel>
            <Button onClick={() => portalService.send("START")}>
              {t("start")}
            </Button>
          </Panel>
        </Modal>
      )}

      {portalState.matches("introduction") && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.chicken}>
            <CropsAndChickensRules
              onAcknowledged={() => portalService.send("CONTINUE")}
            />
          </Panel>
        </Modal>
      )}

      {portalState.matches("gameOver") && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.chicken}>
            <div className="p-2">
              <Label
                className="mb-2"
                type="danger"
                icon={SUNNYSIDE.icons.death}
              >
                {t("crops-and-chickens.gameOver")}
              </Label>
              <div className="flex items-center">
                <span className="mr-2">
                  {`${t("crops-and-chickens.scoreInfo")}`.replace(
                    "{{score}}",
                    `${portalState.context.depositedScore}`
                  )}
                </span>
                <SquareIcon
                  icon={ITEM_DETAILS["Pirate Bounty"].image}
                  width={16}
                />
              </div>
            </div>
            <div className="flex">
              <Button
                onClick={() => portalService.send("CLAIM")}
                className="mr-1"
              >
                {t("crops-and-chickens.exitAndClaimRewards")}
              </Button>
              <Button onClick={() => portalService.send("RETRY")}>
                {t("retry")}
              </Button>
            </div>
          </Panel>
        </Modal>
      )}

      {portalState.matches("claiming") && (
        <Modal show>
          <Panel>
            <p className="loading">{t("loading")}</p>
          </Panel>
        </Modal>
      )}

      {portalState.matches("completed") && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.chicken}>
            <div className="p-2">
              <p className="mb-3">
                {t("crops-and-chickens.challengeCompleted")}
              </p>
              <p className="text-sm mb-3">
                {t("crops-and-chickens.comeBackLater")}
              </p>
              <Label type="info" icon={SUNNYSIDE.icons.timer}>
                {secondsToString(secondsTillReset(), { length: "medium" })}
              </Label>
            </div>
            <div className="flex">
              <Button onClick={goHome} className="mr-1">
                {t("go.home")}
              </Button>
              <Button onClick={() => portalService.send("CONTINUE")}>
                {t("play.again")}
              </Button>
            </div>
          </Panel>
        </Modal>
      )}

      {portalState.context.state && (
        <>
          <CropsAndChickensHud />
          <CropsAndChickensPhaser />
        </>
      )}
    </div>
  );
};
