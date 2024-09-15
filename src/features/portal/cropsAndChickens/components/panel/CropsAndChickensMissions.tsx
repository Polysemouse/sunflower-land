import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import letter from "assets/icons/letter.png";
import { CropsAndChickensMail } from "./CropsAndChickensMail";
import { CropsAndChickensPrize } from "./CropsAndChickensPrize";

const mails = [
  {
    title: "Mailbox is here!",
    content: [
      "The mailbox has arrived! You can check the mail for the latest minigame updates.",
    ],
    icon: letter,
    id: 0,
  },
];

type Props = {
  onBack: () => void;
};

export const CropsAndChickensMissions: React.FC<Props> = ({ onBack }) => {
  const { t } = useAppTranslation();

  const button = useSound("button");

  const [mailId, setMailId] = React.useState<number>();

  return (
    <>
      {mailId === undefined && (
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
              <div className="grow mb-3 text-lg">
                {t("crops-and-chickens.missions")}
              </div>
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

          {/* content */}
          <div className="flex flex-col gap-1 overflow-y-auto scrollable px-1">
            {/* missions */}

            <CropsAndChickensPrize />
          </div>
        </div>
      )}
      {mailId !== undefined && (
        <CropsAndChickensMail
          {...mails[mailId]}
          onBack={() => setMailId(undefined)}
        />
      )}
    </>
  );
};
