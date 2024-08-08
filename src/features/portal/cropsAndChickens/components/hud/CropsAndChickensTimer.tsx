import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { GAME_SECONDS } from "../../CropsAndChickensConstants";
import { Label } from "components/ui/Label";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";

const _endAt = (state: PortalMachineState) => state.context.endAt;

export const CropsAndChickensTimer: React.FC = () => {
  useUiRefresher({ delay: 100 });

  const { portalService } = useContext(PortalContext);

  const endAt = useSelector(portalService, _endAt);

  const secondsLeft = !endAt
    ? GAME_SECONDS
    : Math.max(endAt - Date.now(), 0) / 1000;

  return (
    <Label
      className="absolute"
      icon={SUNNYSIDE.icons.stopwatch}
      type={
        secondsLeft <= 0 ? "danger" : secondsLeft <= 10 ? "warning" : "info"
      }
      style={{
        top: `${PIXEL_SCALE * 3}px`,
        right: `${PIXEL_SCALE * 3}px`,
      }}
    >
      {secondsToString(secondsLeft, {
        length: "full",
      })}
    </Label>
  );
};
