import React, { useContext } from "react";

import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";

import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import flowerIcon from "assets/icons/flower_token.webp";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import {
  DAILY_ATTEMPTS,
  RESTOCK_ATTEMPTS_FLOWER,
  UNLIMITED_ATTEMPTS_FLOWER,
} from "../../CropsAndChickensConstants";
import { purchase } from "features/portal/lib/portalUtil";
import { SUNNYSIDE } from "assets/sunnyside";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";

const _sflBalance = (state: PortalMachineState) =>
  state.context.state?.balance ?? new Decimal(0);

export const CropsAndChickensNoAttemptsPanel: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const sflBalance = useSelector(portalService, _sflBalance);

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES["cluck e cheese"]}>
      <div className="p-2">
        <div className="flex gap-1 justify-between items-center mb-2">
          <Label icon={SUNNYSIDE.icons.lock} type="danger">
            {t("crops-and-chickens.noAttemptsRemaining")}
          </Label>
          <Label
            icon={flowerIcon}
            type={sflBalance.lt(RESTOCK_ATTEMPTS_FLOWER) ? "danger" : "default"}
          >
            {t("crops-and-chickens.flowerRequired")}
          </Label>
        </div>

        <p className="text-sm mb-2">
          {t("crops-and-chickens.youHaveRunOutOfAttempts")}
        </p>
        <p className="text-sm mb-2">
          {t("crops-and-chickens.wouldYouLikeToUnlock")}
        </p>

        <div className="flex items-center space-x-1 relative">
          <p className="balance-text">{setPrecision(sflBalance).toString()}</p>
          <img
            src={flowerIcon}
            alt="SFL"
            style={{
              width: `${PIXEL_SCALE * 9}px`,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button onClick={() => portalService.send("CANCEL_PURCHASE")}>
          {t("back")}
        </Button>
        <Button
          disabled={sflBalance.lt(RESTOCK_ATTEMPTS_FLOWER)}
          onClick={() =>
            purchase({
              sfl: RESTOCK_ATTEMPTS_FLOWER,
              items: {},
            })
          }
        >
          {t("crops-and-chickens.buyAttempts", {
            attempts: DAILY_ATTEMPTS,
            flower: RESTOCK_ATTEMPTS_FLOWER,
          })}
        </Button>
        <Button
          disabled={sflBalance.lt(UNLIMITED_ATTEMPTS_FLOWER)}
          onClick={() =>
            purchase({
              sfl: UNLIMITED_ATTEMPTS_FLOWER,
              items: {},
            })
          }
        >
          {t("crops-and-chickens.unlockAttempts", {
            flower: UNLIMITED_ATTEMPTS_FLOWER,
          })}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};
