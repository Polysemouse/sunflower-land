import React, { useContext } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import { PortalContext } from "../../lib/PortalProvider";
import { useSelector } from "@xstate/react";
import { CropsAndChickensMission } from "./CropsAndChickensMission";

const _dailyHighscore = (state: PortalMachineState) => {
  const dateKey = new Date().toISOString().slice(0, 10);
  const minigame = state.context.state?.minigames.games["crops-and-chickens"];
  const history = minigame?.history ?? {};

  return history[dateKey]?.highscore ?? 0;
};
const _prize = (state: PortalMachineState) => {
  return state.context.state?.minigames.prizes["crops-and-chickens"];
};

type Props = {
  onBack: () => void;
};

export const CropsAndChickensMissions: React.FC<Props> = ({ onBack }) => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const dailyPrize = useSelector(
    portalService,
    _prize,
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next),
  );
  const dailyHighscore = useSelector(portalService, _dailyHighscore);

  const isDailyMissionCompleted = dailyPrize
    ? dailyHighscore > dailyPrize.score
    : false;

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
            {t("crops-and-chickens.missions")}
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

      {/* content */}
      <div className="flex flex-col gap-1 overflow-y-auto scrollable px-1">
        {/* missions */}

        {dailyPrize && (
          <CropsAndChickensMission
            itemPrizes={dailyPrize?.items}
            wearablePrizes={dailyPrize?.wearables}
            coinPrizes={dailyPrize?.coins}
            isCompleted={isDailyMissionCompleted}
            targetScore={dailyPrize?.score}
            endAt={dailyPrize?.endAt}
          />
        )}
      </div>
    </div>
  );
};
