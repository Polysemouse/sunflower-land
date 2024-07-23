import React, { useContext } from "react";

import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";

import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import lock from "assets/skills/lock.png";
import sfl from "assets/icons/sfl.webp";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import {
  DAILY_ATTEMPTS,
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
} from "../../CropsAndChickensConstants";
import { purchase } from "features/portal/lib/portalUtil";

const _sflBalance = (state: PortalMachineState) => state.context.state?.balance;

export const CropsAndChickensNoAttemptsPanel: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const sflBalance = useSelector(portalService, _sflBalance);

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES["chicken farmer"]}>
      <div className="p-1">
        <div className="flex gap-1 justify-between items-center mb-2">
          <Label icon={lock} type="danger">
            {t("crops-and-chickens.noAttemptsRemaining")}
          </Label>
          <Label
            icon={sfl}
            type={sflBalance?.lt(RESTOCK_ATTEMPTS_SFL) ? "danger" : "default"}
          >
            {t("crops-and-chickens.sflRequired")}
          </Label>
        </div>

        <p className="text-sm mb-2">
          {t("crops-and-chickens.youHaveRunOutOfAttempts")}
        </p>
        <p className="text-sm mb-2">
          {t("crops-and-chickens.wouldYouLikeToUnlock")}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <Button onClick={() => portalService.send("CANCEL_PURCHASE")}>
          {t("back")}
        </Button>
        <Button
          disabled={sflBalance?.lt(RESTOCK_ATTEMPTS_SFL)}
          onClick={() =>
            purchase({
              sfl: RESTOCK_ATTEMPTS_SFL,
              items: {},
            })
          }
        >
          {t("crops-and-chickens.buyAttempts", {
            attempts: DAILY_ATTEMPTS,
            sfl: RESTOCK_ATTEMPTS_SFL,
          })}
        </Button>
        <Button
          disabled={sflBalance?.lt(UNLIMITED_ATTEMPTS_SFL)}
          onClick={() =>
            purchase({
              sfl: UNLIMITED_ATTEMPTS_SFL,
              items: {},
            })
          }
        >
          {t("crops-and-chickens.unlockAttempts", {
            sfl: UNLIMITED_ATTEMPTS_SFL,
          })}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};
