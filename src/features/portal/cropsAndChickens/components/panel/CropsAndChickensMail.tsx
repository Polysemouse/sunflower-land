import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { Button } from "components/ui/Button";

type Props = {
  title: string;
  content: string[];
  onBack: () => void;
};

export const CropsAndChickensMail: React.FC<Props> = ({
  title,
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
      <div className="flex flex-col gap-5 overflow-y-auto scrollable p-1">
        {/* mails */}
        {content.map((line) => (
          <span key={line} className="text-sm">
            {line}
          </span>
        ))}
      </div>

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
