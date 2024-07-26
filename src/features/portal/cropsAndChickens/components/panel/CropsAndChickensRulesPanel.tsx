import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { CropsAndChickensMission } from "./CropsAndChickensMission";
import { CropsAndChickensDonations } from "./CropsAndChickensDonations";

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
      bumpkinParts={NPC_WEARABLES["cluck e cheese"]}
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        {
          icon: SUNNYSIDE.icons.plant,
          name: t("crops-and-chickens.mission"),
        },
        {
          icon: SUNNYSIDE.icons.heart,
          name: t("donate"),
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
        {tab === 1 && <CropsAndChickensDonations />}
      </>
    </CloseButtonPanel>
  );
};
