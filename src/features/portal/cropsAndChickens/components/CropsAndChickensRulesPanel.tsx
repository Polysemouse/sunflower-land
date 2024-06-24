import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import chores from "assets/icons/chores.webp";
import { CropsAndChickensMission } from "./CropsAndChickensMission";
import { CropsAndChickensInstructions } from "./CropsAndChickensInstructions";
import { CropsAndChickensLegend } from "./CropsAndChickensLegend";

interface Props {
  mode: "introduction" | "success" | "failed";
  showScore: boolean;
  showExitButton: boolean;
  confirmButtonText: string;
  onConfirm: () => void;
}
export const CropsAndChickensRulesPanel: React.FC<Props> = ({
  mode,
  showScore,
  showExitButton,
  confirmButtonText,
  onConfirm,
}) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["chicken farmer"]}
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        {
          icon: SUNNYSIDE.icons.plant,
          name: t("crops-and-chickens.mission"),
        },
        { icon: chores, name: t("crops-and-chickens.rules") },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("crops-and-chickens.legend"),
        },
      ]}
    >
      <>
        {tab === 0 && (
          <CropsAndChickensMission
            mode={mode}
            showScore={showScore}
            showExitButton={showExitButton}
            confirmButtonText={confirmButtonText}
            onConfirm={onConfirm}
          />
        )}
        {tab === 1 && <CropsAndChickensInstructions />}
        {tab === 2 && <CropsAndChickensLegend />}
      </>
    </CloseButtonPanel>
  );
};
