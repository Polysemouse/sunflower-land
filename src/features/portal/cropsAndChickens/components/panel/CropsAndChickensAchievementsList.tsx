import React, { useContext } from "react";

import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import {
  AVAILABLE_ACHIEVEMENTS,
  CropsAndChickensAchievementName,
} from "../../CropsAndChickensAchievements";
import { SquareIcon } from "components/ui/SquareIcon";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { useSound } from "lib/utils/hooks/useSound";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";

const _achievements = (state: PortalMachineState) =>
  state.context.state?.minigames.games["crops-and-chickens"]?.achievements ??
  {};

type Props = {
  onBack: () => void;
};

export const CropsAndChickensAchievementsList: React.FC<Props> = ({
  onBack,
}) => {
  const { t } = useAppTranslation();
  const { portalService } = useContext(PortalContext);

  const button = useSound("button");

  const achievements = useSelector(portalService, _achievements);
  const inProgressAchievementNames = (
    Object.keys(AVAILABLE_ACHIEVEMENTS) as CropsAndChickensAchievementName[]
  ).filter((achievementName) => !achievements[achievementName]);
  const completedAchievementNames = (
    Object.keys(AVAILABLE_ACHIEVEMENTS) as CropsAndChickensAchievementName[]
  ).filter((achievementName) => achievements[achievementName]);

  const [selectedAchievementName, setSelectedAchievementName] =
    React.useState<CropsAndChickensAchievementName>(
      inProgressAchievementNames.length > 0
        ? inProgressAchievementNames[0]
        : completedAchievementNames[0],
    );

  const selectedAchievement = AVAILABLE_ACHIEVEMENTS[selectedAchievementName];
  const selectedAchievementUnlockedAt =
    achievements[selectedAchievementName]?.unlockedAt;

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
          <div className="grow mb-3 text-lg">{t("achievements")}</div>
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
          "NOTE: The achievements system is currently only visible for beta testers. It is still a work in progress, completing achievements will NOT unlock them. However, you are still encouraged to try them out for fun!"
        }
      </Label>

      <InnerPanel>
        <div className="flex flex-row p-1 items-center">
          <div className="ml-1.5 mr-3">
            <SquareIcon icon={selectedAchievement.icon} width={14} />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div>{selectedAchievement.title}</div>
            <div className="text-xs">{selectedAchievement.description}</div>
          </div>
        </div>
        {selectedAchievementUnlockedAt && (
          <Label
            type="success"
            icon={SUNNYSIDE.icons.confirm}
            className="text-xs ml-1"
          >
            {t("crops-and-chickens.achievementUnlockedAt", {
              time: new Date(selectedAchievementUnlockedAt).toLocaleString(),
            })}
          </Label>
        )}
      </InnerPanel>

      <InnerPanel className="flex flex-col gap-1">
        <Label type="default">{t("in.progress")}</Label>
        <div className="flex flex-wrap">
          {inProgressAchievementNames.map((achievementName) => {
            return (
              <Box
                isSelected={achievementName === selectedAchievementName}
                key={achievementName}
                onClick={() => setSelectedAchievementName(achievementName)}
                image={AVAILABLE_ACHIEVEMENTS[achievementName].icon}
                count={
                  completedAchievementNames.includes(achievementName)
                    ? new Decimal(1)
                    : new Decimal(0)
                }
              />
            );
          })}
        </div>
        {completedAchievementNames.length > 0 && (
          <Label type="default" className="mt-4">
            {t("completed")}
          </Label>
        )}
        <div className="flex flex-wrap">
          {completedAchievementNames.map((achievementName) => {
            return (
              <Box
                isSelected={achievementName === selectedAchievementName}
                key={achievementName}
                onClick={() => setSelectedAchievementName(achievementName)}
                image={AVAILABLE_ACHIEVEMENTS[achievementName].icon}
                count={
                  completedAchievementNames.includes(achievementName)
                    ? new Decimal(1)
                    : new Decimal(0)
                }
              />
            );
          })}
        </div>
      </InnerPanel>
    </div>
  );
};
