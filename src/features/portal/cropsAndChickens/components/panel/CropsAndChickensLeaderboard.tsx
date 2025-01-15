import React, { useContext } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import { PortalLeaderboard } from "features/world/ui/portals/PortalLeaderboard";
import { PortalContext } from "../../lib/PortalProvider";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import { useSelector } from "@xstate/react";
import {
  getEndOfUTCWeek,
  getStartOfUTCWeek,
} from "../../lib/cropsAndChickensUtils";
import { Label } from "components/ui/Label";

type Props = {
  onBack: () => void;
};

const _farmId = (state: PortalMachineState) => state.context.id;
const _jwt = (state: PortalMachineState) => state.context.jwt;

export const CropsAndChickensLeaderboard: React.FC<Props> = ({ onBack }) => {
  const { t } = useAppTranslation();

  const { portalService } = useContext(PortalContext);
  const farmId = useSelector(portalService, _farmId);
  const jwt = useSelector(portalService, _jwt);

  const startOfUTCWeekDate = new Date(getStartOfUTCWeek(new Date()));
  const endOfUTCWeekDate = new Date(getEndOfUTCWeek(new Date()));

  const button = useSound("button");

  return (
    <div className="flex flex-col gap-1 max-h-[75vh]">
      {/* title */}
      <div className="flex flex-col gap-1">
        <div className="flex text-center">
          <div
            className="flex-none"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              marginLeft: `${PIXEL_SCALE * 2}px`,
            }}
          >
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="cursor-pointer"
              onClick={() => {
                button.play();
                onBack();
              }}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
          <div className="grow mb-3 text-lg">
            {t("leaderboard.leaderboard")}
          </div>
          <div className="flex-none">
            <div
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                marginRight: `${PIXEL_SCALE * 2}px`,
              }}
            />
          </div>
        </div>
      </div>

      <Label type="danger">
        {
          "NOTE: The leaderboard display is currently only visible for beta testers."
        }
      </Label>

      {/* content */}
      <PortalLeaderboard
        name="crops-and-chickens"
        farmId={farmId}
        jwt={jwt}
        startDate={startOfUTCWeekDate}
        endDate={endOfUTCWeekDate}
        onBack={() => undefined}
      />
    </div>
  );
};
