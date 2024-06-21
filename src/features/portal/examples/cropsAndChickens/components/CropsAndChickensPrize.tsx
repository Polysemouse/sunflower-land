import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MinigameHistory, MinigamePrize } from "features/game/types/game";
import { OuterPanel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import coins from "assets/icons/coins.webp";
import { Label } from "components/ui/Label";

interface Props {
  prize?: MinigamePrize;
  history?: MinigameHistory;
}

export const CropsAndChickensPrize: React.FC<Props> = ({ prize, history }) => {
  const { t } = useAppTranslation();
  if (!prize) {
    return (
      <OuterPanel>
        <div className="px-1">
          <Label type="danger" icon={SUNNYSIDE.icons.sad}>
            {t("crops-and-chickens.noPrizeAvailable")}
          </Label>
        </div>
      </OuterPanel>
    );
  }

  const isComplete = history && history.highscore > prize.score;
  const secondsLeft = (prize.endAt - Date.now()) / 1000;

  return (
    <OuterPanel>
      <div className="px-1">
        <span className="text-xs mb-2">
          {t("crops-and-chickens.missionObjectives", {
            targetScore: prize.score,
          })}
        </span>
        <div className="flex justify-between mt-2 flex-wrap">
          {isComplete ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {t("crops-and-chickens.completed")}
            </Label>
          ) : (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {secondsToString(secondsLeft, { length: "medium" })}
            </Label>
          )}
          <div className="flex items-center space-x-2">
            {!!prize.coins && (
              <Label icon={coins} type="warning">
                {prize.coins}
              </Label>
            )}
          </div>
        </div>
      </div>
    </OuterPanel>
  );
};
