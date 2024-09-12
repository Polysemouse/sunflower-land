import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import { ButtonPanel } from "components/ui/Panel";
import { CONFIG } from "lib/config";
import letter from "assets/icons/letter.png";
import { CropsAndChickensMail } from "./CropsAndChickensMail";

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

export const CropsAndChickensMailbox: React.FC<Props> = ({ onBack }) => {
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
              <div className="grow mb-3 text-lg">{t("mailbox")}</div>
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
            {/* mails */}
            {mails.map((mail, index) => (
              <ButtonPanel
                key={index}
                onClick={() => {
                  button.play();
                  setMailId(mail.id);
                }}
              >
                <div className="flex items-center justify-start gap-1 w-full">
                  <div className="mr-1">
                    <SquareIcon icon={mail.icon} width={16} />
                  </div>
                  <span className="text-sm">{mail.title}</span>
                </div>
              </ButtonPanel>
            ))}
          </div>

          <span className="text-xs">
            {`${t("last.updated")} ${CONFIG.CLIENT_VERSION}`}
          </span>
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
