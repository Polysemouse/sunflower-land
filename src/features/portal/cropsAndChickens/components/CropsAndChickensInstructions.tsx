import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";

export const CropsAndChickensInstructions: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="p-2">
      <div className="flex items-center mb-3">
        <SquareIcon icon={ITEM_DETAILS["Sunflower"].image} width={12} />
        <p className="text-xs ml-3 flex-1">{t("crops-and-chickens.rules1")}</p>
      </div>

      <div className="flex items-center mb-3">
        <SquareIcon icon={SUNNYSIDE.icons.basket} width={12} />
        <p className="text-xs ml-3 flex-1">{t("crops-and-chickens.rules2")}</p>
      </div>

      <div className="flex items-center mb-3">
        <SquareIcon icon={ITEM_DETAILS["Chicken"].image} width={12} />
        <p className="text-xs ml-3 flex-1">{t("crops-and-chickens.rules3")}</p>
      </div>

      <div className="flex items-center mb-3">
        <SquareIcon icon={SUNNYSIDE.icons.stopwatch} width={12} />
        <p className="text-xs ml-3 flex-1">{t("crops-and-chickens.rules4")}</p>
      </div>
    </div>
  );
};
