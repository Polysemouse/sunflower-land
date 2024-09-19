import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import factions from "assets/icons/factions.webp";

import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import trophy from "assets/icons/trophy.png";
import { SquareIcon } from "components/ui/SquareIcon";
import { hasFeatureAccess } from "lib/flags";
import letter from "assets/icons/letter.png";
import { useMailRead } from "../../hooks/useMailRead";
import { CropsAndChickensPage } from "./CropsAndChickensHome";
import {
  getDailyHighscore,
  getWeeklyHighscore,
} from "../../lib/cropsAndChickensUtils";
import { WEEKLY_MISSION_EXTRA_ATTEMPTS_GOAL } from "../../CropsAndChickensConstants";

interface Props {
  setPage: (page: CropsAndChickensPage) => void;
}

const _dailyHighscore = (state: PortalMachineState) => {
  const minigame = state.context.state?.minigames.games["crops-and-chickens"];
  return getDailyHighscore(minigame);
};
const _weeklyHighscore = (state: PortalMachineState) => {
  const minigame = state.context.state?.minigames.games["crops-and-chickens"];
  return getWeeklyHighscore(minigame);
};
const _dailyPrize = (state: PortalMachineState) => {
  return state.context.state?.minigames.prizes["crops-and-chickens"];
};
const _state = (state: PortalMachineState) => state.context.state;

export const CropsAndChickensHomeNavigationButtons: React.FC<Props> = ({
  setPage,
}) => {
  const { portalService } = useContext(PortalContext);

  const state = useSelector(portalService, _state);

  const hasBetaAccess = state
    ? hasFeatureAccess(state, "CROPS_AND_CHICKENS_BETA_TESTING")
    : false;

  const { unreadMailCount } = useMailRead();

  const dailyPrize = useSelector(
    portalService,
    _dailyPrize,
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next),
  );

  const dailyHighscore = useSelector(portalService, _dailyHighscore);
  const isDailyMissionCompleted = dailyPrize
    ? dailyHighscore >= dailyPrize.score
    : false;
  const weeklyHighscore = useSelector(portalService, _weeklyHighscore);
  const isWeeklyMissionCompleted =
    weeklyHighscore >= WEEKLY_MISSION_EXTRA_ATTEMPTS_GOAL;

  const incompleteMissionCount = [
    isDailyMissionCompleted,
    isWeeklyMissionCompleted,
  ].filter((completed) => !completed).length;

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      <div className="relative">
        <Button
          className="whitespace-nowrap capitalize w-[48px] h-[50px]"
          onClick={() => setPage("mailbox")}
        >
          <SquareIcon className="mt-0.5" icon={letter} width={9} />
        </Button>
        {unreadMailCount > 0 && (
          <Label
            type="default"
            className="absolute pointer-events-none -top-3 -right-1"
          >
            {unreadMailCount}
          </Label>
        )}
      </div>
      <div className="relative">
        <Button
          className="whitespace-nowrap capitalize w-[48px] h-[50px]"
          onClick={() => setPage("missions")}
        >
          <SquareIcon className="mt-0.5" icon={factions} width={8} />
        </Button>
        {incompleteMissionCount > 0 && (
          <Label
            type="default"
            className="absolute pointer-events-none -top-3 -right-1"
          >
            {incompleteMissionCount}
          </Label>
        )}
      </div>
      {hasBetaAccess && (
        <Button
          className="whitespace-nowrap capitalize w-[48px] h-[50px]"
          onClick={() => setPage("achievements")}
        >
          <SquareIcon className="mt-0.5" icon={trophy} width={9} />
        </Button>
      )}
      <Button
        className="whitespace-nowrap capitalize w-[48px] h-[50px]"
        onClick={() => setPage("guide")}
      >
        <SquareIcon
          className="mt-0.5"
          icon={SUNNYSIDE.icons.expression_confused}
          width={7.5}
        />
      </Button>
    </div>
  );
};
