import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { Button } from "components/ui/Button";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";

type Props = {
  title: string;
  icon: string;
  content: string[];
  onBack: () => void;
};

export const CropsAndChickensMail: React.FC<Props> = ({
  title,
  icon,
  content,
  onBack,
}) => {
  const { t } = useAppTranslation();

  const button = useSound("button");

  return (
    <div className="flex flex-col gap-2 max-h-[75vh]">
      {/* title */}
      <div className="flex text-center">
        <div className="grow text-lg">{title}</div>
      </div>

      {/* content */}
      <div className="flex flex-col items-center gap-5 overflow-y-auto scrollable p-1">
        {/* icon */}
        <div
          style={{
            height: `${PIXEL_SCALE * 16}px`,
          }}
        >
          <SquareIcon icon={icon} width={16} />
        </div>

        {/* messages */}
        {content.map((line) => (
          <span key={line} className="text-sm">
            {line}
          </span>
        ))}
      </div>

      {/* back button */}
      <Button
        onClick={() => {
          button.play();
          onBack();
        }}
      >
        {t("ok")}
      </Button>
    </div>
  );
};
