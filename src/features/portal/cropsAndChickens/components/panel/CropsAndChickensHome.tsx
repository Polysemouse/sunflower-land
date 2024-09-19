import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { CropsAndChickensAttempts } from "./CropsAndChickensAttempts";
import {
  getAttemptsLeft,
  getDailyHighscore,
  getHolidayEvent,
  getPersonalHighscore,
} from "../../lib/cropsAndChickensUtils";
import { goHome } from "features/portal/lib/portalUtil";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { CropsAndChickensAchievementsList } from "./CropsAndChickensAchievementsList";
import { CropsAndChickensGuide } from "./CropsAndChickensGuide";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { formatNumber } from "lib/utils/formatNumber";
import { CropsAndChickensMailbox } from "./CropsAndChickensMailbox";
import { CropsAndChickensMissions } from "./CropsAndChickensMissions";
import { getHolidayAsset } from "../../lib/CropsAndChickensHolidayAsset";
import { CropsAndChickensHomeNavigationButtons } from "./CropsAndChickensHomeNavigationButtons";

export type CropsAndChickensPage =
  | "main"
  | "mailbox"
  | "missions"
  | "achievements"
  | "guide";

const _minigame = (state: PortalMachineState) =>
  state.context.state?.minigames.games["crops-and-chickens"];
const _score = (state: PortalMachineState) => state.context.score;

interface Props {
  mode: "introduction" | "success" | "failed";
  showScore: boolean;
  showExitButton: boolean;
  confirmButtonText: string;
  onConfirm: () => void;
}

export const CropsAndChickensHome: React.FC<Props> = ({
  mode,
  showScore,
  showExitButton,
  confirmButtonText,
  onConfirm,
}) => {
  const { t } = useAppTranslation();

  const { portalService } = useContext(PortalContext);

  const minigame = useSelector(portalService, _minigame);
  const attemptsLeft = getAttemptsLeft(minigame);
  const score = useSelector(portalService, _score);

  const holidayEvent = getHolidayEvent();

  const dailyHighscore = getDailyHighscore(minigame);
  const personalHighscore = getPersonalHighscore(minigame);

  const [page, setPage] = React.useState<CropsAndChickensPage>("main");

  return (
    <>
      {page === "main" && (
        <div className="flex flex-col gap-1 max-h-[75vh]">
          <div className="flex flex-col gap-1 overflow-x-hidden overflow-y-auto scrollable px-1">
            {/* header */}
            <div className="flex justify-between gap-2 items-center mb-1 py-1 pl-1">
              {mode === "introduction" && (
                <Label
                  type="default"
                  className="text-center"
                  icon={getHolidayAsset("game_title_icon", holidayEvent)}
                  secondaryIcon={getHolidayAsset(
                    "game_title_secondary_icon",
                    holidayEvent,
                  )}
                >
                  <div className="px-0.5">
                    {getHolidayAsset("game_title", holidayEvent)}
                  </div>
                </Label>
              )}
              {mode === "success" && (
                <Label
                  type="success"
                  className="text-center"
                  icon={SUNNYSIDE.icons.confirm}
                >
                  {t("crops-and-chickens.missionComplete")}
                </Label>
              )}
              {mode === "failed" && (
                <Label
                  type="danger"
                  className="text-center"
                  icon={SUNNYSIDE.icons.death}
                >
                  {t("crops-and-chickens.missionFailed")}
                </Label>
              )}
              <CropsAndChickensAttempts attemptsLeft={attemptsLeft} />
            </div>

            {/* navigation buttons */}
            <CropsAndChickensHomeNavigationButtons setPage={setPage} />

            {/* Scores */}
            <Label
              type="chill"
              className="flex flex-col gap-1 items-center p-1 !w-full"
              style={{
                marginBottom: `${PIXEL_SCALE * 1}px`,
              }}
            >
              {showScore && (
                <div className="flex flex-col items-center w-1/2">
                  <span className="text-sm">
                    {t("crops-and-chickens.score")}
                  </span>
                  <span className="text-lg">{formatNumber(score)}</span>
                </div>
              )}
              <div className="flex justify-between gap-2 w-full">
                <div className="flex flex-col items-center w-1/2">
                  <span className="text-xs text-center">
                    {t("crops-and-chickens.todaysBest")}
                  </span>
                  <span className="text-sm text-center">
                    {formatNumber(dailyHighscore)}
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/2">
                  <span className="text-xs text-center">
                    {t("crops-and-chickens.personalBest")}
                  </span>
                  <span className="text-sm text-center">
                    {formatNumber(personalHighscore)}
                  </span>
                </div>
              </div>
            </Label>
          </div>

          {/* play and exit buttons */}
          <div className="flex gap-1">
            {showExitButton && <Button onClick={goHome}>{t("exit")}</Button>}
            <Button onClick={onConfirm}>{confirmButtonText}</Button>
          </div>
        </div>
      )}
      {page === "mailbox" && (
        <CropsAndChickensMailbox onBack={() => setPage("main")} />
      )}
      {page === "missions" && (
        <CropsAndChickensMissions onBack={() => setPage("main")} />
      )}
      {page === "achievements" && (
        <CropsAndChickensAchievementsList onBack={() => setPage("main")} />
      )}
      {page === "guide" && (
        <CropsAndChickensGuide onBack={() => setPage("main")} />
      )}
    </>
  );
};
