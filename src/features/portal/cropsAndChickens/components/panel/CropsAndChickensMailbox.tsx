import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import { CONFIG } from "lib/config";
import { CropsAndChickensMail } from "./CropsAndChickensMail";
import { CROPS_AND_CHICKEN_MAILS } from "../../hooks/useMailRead";
import { CropsAndChickensMailList } from "./CropsAndChickensMailList";

type Props = {
  onBack: () => void;
};

export const CropsAndChickensMailbox: React.FC<Props> = ({ onBack }) => {
  const { t } = useAppTranslation();

  const button = useSound("button");

  const [mailId, setMailId] = React.useState<number>();

  const selectedMail = CROPS_AND_CHICKEN_MAILS.find(
    (mail) => mail.id === mailId,
  );
  const selectedMailTitle = selectedMail ? selectedMail.title : "";
  const selectedMailIcon = selectedMail ? selectedMail.icon : "";
  const selectedMailContent = selectedMail ? selectedMail.content : [];
  const selectedMailId = selectedMail ? selectedMail.id : 0;

  return (
    <>
      {!selectedMail && (
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
          <CropsAndChickensMailList setMailId={setMailId} />

          <span className="text-xs">
            {`${t("last.updated")} ${CONFIG.CLIENT_VERSION}`}
          </span>
        </div>
      )}
      {selectedMail && (
        <CropsAndChickensMail
          title={selectedMailTitle}
          icon={selectedMailIcon}
          content={selectedMailContent}
          id={selectedMailId}
          onBack={() => setMailId(undefined)}
        />
      )}
    </>
  );
};
