import React, { useContext } from "react";

import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import {
  AVAILABLE_ACHIEVEMENTS,
  CropsAndChickensAchievementName,
} from "../../CropsAndChickensAchievements";
import { SquareIcon } from "components/ui/SquareIcon";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

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

  const achievements = useSelector(portalService, _achievements);
  const inProgressAchievementNames = (
    Object.keys(AVAILABLE_ACHIEVEMENTS) as CropsAndChickensAchievementName[]
  ).filter((achievementName) => !achievements[achievementName]);
  const completedAchievementNames = (
    Object.keys(AVAILABLE_ACHIEVEMENTS) as CropsAndChickensAchievementName[]
  ).filter((achievementName) => achievements[achievementName]);

  return (
    <div className="flex flex-col gap-1">
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
              onClick={onBack}
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

      {/* in progress */}
      <div className="flex flex-col gap-1">
        <Label type="default">{t("in.progress")}</Label>
        <div className="flex flex-col gap-1">
          {inProgressAchievementNames.map((achievementName, index) => {
            const achievement = AVAILABLE_ACHIEVEMENTS[achievementName];

            return (
              <OuterPanel key={index}>
                <div className="flex flex-row p-1 items-center">
                  <SquareIcon
                    className="ml-2 mr-4"
                    icon={achievement.icon}
                    width={16}
                  />
                  <div className="flex flex-col gap-1 w-full">
                    <div>{achievement.title}</div>
                    <div className="text-xs">{achievement.description}</div>
                  </div>
                </div>
              </OuterPanel>
            );
          })}
        </div>
      </div>

      {/* completed */}
      {completedAchievementNames.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          <Label type="default">{t("completed")}</Label>
          <div className="flex flex-col gap-1">
            {completedAchievementNames.map((achievementName, index) => {
              const achievement = AVAILABLE_ACHIEVEMENTS[achievementName];
              const unlockedAt = achievements[achievementName].unlockedAt;

              return (
                <InnerPanel key={index}>
                  <div className="flex flex-row p-1 items-center">
                    <SquareIcon
                      className="ml-2 mr-4"
                      icon={achievement.icon}
                      width={16}
                    />
                    <div className="flex flex-col gap-1 w-full">
                      <div>{achievement.title}</div>
                      <div className="text-xs">{achievement.description}</div>
                    </div>
                  </div>
                  <Label type="success" className="text-xs">
                    {t("crops-and-chickens.achievementUnlockedAt", {
                      time: new Date(unlockedAt).toLocaleString(),
                    })}
                  </Label>
                </InnerPanel>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
