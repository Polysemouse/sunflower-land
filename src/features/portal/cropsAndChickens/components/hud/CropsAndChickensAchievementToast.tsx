import React from "react";
import {
  AVAILABLE_ACHIEVEMENTS,
  CropsAndChickensAchievementName,
} from "../../CropsAndChickensAchievements";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SquareIcon } from "components/ui/SquareIcon";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  achievementName: CropsAndChickensAchievementName;
};

export const CropsAndChickensAchievementToast: React.FC<Props> = ({
  achievementName,
}) => {
  const { t } = useAppTranslation();

  const achievement = AVAILABLE_ACHIEVEMENTS[achievementName];

  return (
    <div
      className="absolute flex justify-center w-full pointer-events-none"
      style={{
        bottom: `${PIXEL_SCALE * 3}px`,
      }}
    >
      <InnerPanel className="flex flex-col items-center">
        <div className="flex flex-row p-1 items-center">
          <SquareIcon
            className="ml-2 mr-4"
            icon={achievement.icon}
            width={16}
          />
          <div className="flex flex-col gap-1 w-full">
            <div>{t("crops-and-chickens.achievementUnlocked")}</div>
            <div className="text-xs">{achievement.title}</div>
          </div>
        </div>
      </InnerPanel>
    </div>
  );
};
