import React, { useContext } from "react";

import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import { SquareIcon } from "components/ui/SquareIcon";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { useSound } from "lib/utils/hooks/useSound";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { formatNumber } from "lib/utils/formatNumber";
import {
  AVAILABLE_BOOSTS,
  AVAILABLE_ABILITIES,
  AVAILABLE_SKILLS,
  CropsAndChickensBoostName,
  CropsAndChickensAbilityName,
  CropsAndChickensSkillName,
} from "../../CropsAndChickensUpgrades";
import { getKeys } from "features/game/types/craftables";
// import goldenSeed from "public/crops-and-chickens/golden_seed.png";
import { UpgradeRequirementsLabel } from "./UpgradeRequirementsLabel";

const _activities = (state: PortalMachineState) =>
  state.context.state?.minigames.games["crops-and-chickens"]?.activities ?? {};

type Props = {
  onBack: () => void;
};

//TODO: Refactor and Localize
export const CropsAndChickensUpgrades: React.FC<Props> = ({ onBack }) => {
  const { t } = useAppTranslation();
  const { portalService } = useContext(PortalContext);

  const button = useSound("button");

  const activities = useSelector(portalService, _activities);

  const [selectedSkillName, setSelectedSkillName] =
    React.useState<CropsAndChickensSkillName>(getKeys(AVAILABLE_BOOSTS)[0]);

  const goldenSeedBalance = (
    activities["Golden Seed Earned"] ?? new Decimal(0)
  ).minus(activities["Golden Seed Spent"] ?? new Decimal(0));

  const selectedSkill =
    AVAILABLE_SKILLS[selectedSkillName as CropsAndChickensSkillName];

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
          <div className="grow mb-3 text-lg">{"Upgrades"}</div>
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
          "NOTE: The upgrades system is currently only visible for beta testers. It is still a work in progress, upgrading abilities will NOT actually upgrade them."
        }
      </Label>

      <Label
        type="chill"
        className="flex flex-col gap-4 items-center p-1 !w-full"
      >
        <div className="flex flex-col items-center w-full">
          <span className="text-sm text-center">
            {t("crops-and-chickens.upgradePoints")}
          </span>
          <div className="flex flex-row items-center gap-2">
            {/* <SquareIcon icon={goldenSeed} width={14} /> */}
            <span className="text-2xl text-center">
              {formatNumber(goldenSeedBalance)}
            </span>
          </div>
        </div>
      </Label>

      <InnerPanel>
        <div className="flex flex-row p-1 items-center">
          <div className="ml-1.5 mr-3">
            <SquareIcon icon={selectedSkill.icon} width={14} />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div>{selectedSkill.title}</div>
            <div className="text-xs">{selectedSkill.description}</div>
          </div>
        </div>
        <div className="border-t border-white w-full mb-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap m-1">
          <UpgradeRequirementsLabel points={0} requirement={1000000} />
        </div>
      </InnerPanel>

      <InnerPanel className="flex flex-col gap-1">
        <Label type="default">{t("crops-and-chickens.boosts")}</Label>
        <div className="flex flex-wrap">
          {Object.keys(AVAILABLE_BOOSTS).map((skillName) => {
            return (
              <Box
                isSelected={skillName === selectedSkillName}
                key={skillName}
                onClick={() =>
                  setSelectedSkillName(skillName as CropsAndChickensBoostName)
                }
                image={
                  AVAILABLE_BOOSTS[skillName as CropsAndChickensBoostName].icon
                }
                count={
                  activities[`${skillName} Effect Upgraded`] ?? new Decimal(0)
                }
              />
            );
          })}
        </div>

        <Label type="default" className="mt-4">
          {t("crops-and-chickens.abilities")}
        </Label>
        <div className="flex flex-wrap">
          {Object.keys(AVAILABLE_ABILITIES).map((skillName) => {
            return (
              <Box
                isSelected={skillName === selectedSkillName}
                key={skillName}
                onClick={() =>
                  setSelectedSkillName(skillName as CropsAndChickensAbilityName)
                }
                image={
                  AVAILABLE_ABILITIES[skillName as CropsAndChickensAbilityName]
                    .icon
                }
                count={
                  activities[`${skillName} Effect Upgraded`] ?? new Decimal(0)
                }
              />
            );
          })}
        </div>
      </InnerPanel>
    </div>
  );
};
