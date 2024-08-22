import React, { useContext, useEffect } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { HudContainer } from "components/ui/HudContainer";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import { CropsAndChickensTimer } from "./CropsAndChickensTimer";
import { CropsAndChickensSettings } from "./settings/CropsAndChickensSettings";
import { CropsAndChickensTravel } from "./CropsAndChickensTravel";
import { CropsAndChickensScores } from "./CropsAndChickensScores";
import classNames from "classnames";
import { useAchievementToast } from "../../providers/AchievementToastProvider";
import { CropsAndChickensTarget } from "./CropsAndChickensTarget";
import { MinigameAchievement } from "features/game/types/game";

const _isJoystickActive = (state: PortalMachineState) =>
  state.context.isJoystickActive;
const _achievements = (state: PortalMachineState) =>
  state.context.state?.minigames.games["crops-and-chickens"]?.achievements ??
  {};
const _compareAchievements = (
  prev: Record<string, MinigameAchievement>,
  next: Record<string, MinigameAchievement>,
) => JSON.stringify(prev) === JSON.stringify(next);

export const CropsAndChickensHud: React.FC = () => {
  const { portalService } = useContext(PortalContext);

  const isJoystickActive = useSelector(portalService, _isJoystickActive);
  const achievements = useSelector(
    portalService,
    _achievements,
    _compareAchievements,
  );

  // achievement toast provider
  const { showAchievementToasts } = useAchievementToast();

  // show new achievements
  const [existingAchievementNames, setExistingAchievements] = React.useState(
    Object.keys(achievements),
  );
  useEffect(() => {
    const achievementNames = Object.keys(achievements);
    const newAchievementNames = achievementNames.filter(
      (achievement) => !existingAchievementNames.includes(achievement),
    );

    if (newAchievementNames.length > 0) {
      showAchievementToasts(newAchievementNames);
      setExistingAchievements(achievementNames);
    }
  }, [achievements]);

  return (
    <>
      <HudContainer>
        <div
          className={classNames({
            "pointer-events-none": isJoystickActive,
          })}
        >
          <div
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 3}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          >
            <CropsAndChickensTarget />
            <CropsAndChickensScores />
          </div>

          <CropsAndChickensTimer />
          <CropsAndChickensTravel />
        </div>
      </HudContainer>
      <HudContainer zIndex={99999}>
        <div
          className={classNames({
            "pointer-events-none": isJoystickActive,
          })}
        >
          <CropsAndChickensSettings />
        </div>
      </HudContainer>
    </>
  );
};
