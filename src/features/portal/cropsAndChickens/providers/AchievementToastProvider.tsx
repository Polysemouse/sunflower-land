import React, { createContext, useContext, useState } from "react";
import {
  AVAILABLE_ACHIEVEMENTS,
  CropsAndChickensAchievementName,
} from "../CropsAndChickensAchievements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { HudContainer } from "components/ui/HudContainer";
import { SUNNYSIDE } from "assets/sunnyside";
import { isTouchDevice } from "features/world/lib/device";
import classNames from "classnames";

interface AchievementToastContextProps {
  showAchievementToasts: (achievementNames: string[]) => void;
}

const AchievementToastContext = createContext<
  AchievementToastContextProps | undefined
>(undefined);

export const useAchievementToast = () => {
  const context = useContext(AchievementToastContext);
  if (!context) {
    throw new Error(
      "useAchievementToast must be used within an AchievementToastProvider",
    );
  }
  return context;
};

const AchievementToastProvider: React.FC = ({ children }) => {
  const { t } = useAppTranslation();

  const touchDevice = isTouchDevice();

  const [achievementNames, setAchievementNames] = useState<
    CropsAndChickensAchievementName[]
  >([]);

  const showAchievementToasts = (achievementNames: string[]) => {
    const validAchievementNames = achievementNames.filter((name) =>
      Object.keys(AVAILABLE_ACHIEVEMENTS).includes(name),
    ) as CropsAndChickensAchievementName[];
    setAchievementNames(validAchievementNames);
  };

  const hideAchievementToast = (achievementName: string) => {
    setAchievementNames((prev) =>
      prev.filter((name) => name !== achievementName),
    );
  };

  return (
    <AchievementToastContext.Provider value={{ showAchievementToasts }}>
      {children}
      <HudContainer zIndex="z-[99999]">
        <div
          className={classNames(
            "absolute flex justify-center w-full pointer-events-none",
            {
              "bottom-0": touchDevice,
              "top-0": !touchDevice,
            },
          )}
        >
          <div
            className="absolute flex flex-col gap-1 items-center"
            style={{
              bottom: touchDevice ? `${PIXEL_SCALE * 3}px` : undefined,
              top: !touchDevice ? `${PIXEL_SCALE * 3}px` : undefined,
              marginLeft: `${PIXEL_SCALE * 3}px`,
              marginRight: `${PIXEL_SCALE * 3}px`,
            }}
          >
            {achievementNames.map((achievementName, index) => {
              const achievement = AVAILABLE_ACHIEVEMENTS[achievementName];

              return (
                <InnerPanel key={index} className="flex flex-col items-center">
                  <div className="flex flex-row p-1 items-center">
                    <div className="ml-1.5 mr-3">
                      <SquareIcon icon={achievement.icon} width={14} />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <div>{t("crops-and-chickens.achievementUnlocked")}</div>
                      <div className="text-xs">{achievement.title}</div>
                    </div>
                    <img
                      src={SUNNYSIDE.icons.close}
                      className="ml-2 pointer-events-auto cursor-pointer"
                      onClick={() => hideAchievementToast(achievementName)}
                      alt="cancel"
                      style={{
                        width: `${PIXEL_SCALE * 11}px`,
                        height: `${PIXEL_SCALE * 11}px`,
                      }}
                    />
                  </div>
                </InnerPanel>
              );
            })}
          </div>
        </div>
      </HudContainer>
    </AchievementToastContext.Provider>
  );
};

export default AchievementToastProvider;
