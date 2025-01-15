import React from "react";

import { useEffect } from "react";
import { useState } from "react";
import {
  CompetitionLeaderboardResponse,
  CompetitionPlayer,
} from "features/game/types/competitions";
import { MinigameName } from "features/game/types/minigames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getPortalLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { Loading } from "features/auth/components/Loading";
import classNames from "classnames";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import { NPCIcon } from "features/island/bumpkin/components/NPC";

export const PortalLeaderboard: React.FC<{
  name: MinigameName;
  farmId: number;
  jwt: string;
  onBack?: () => void;
  startDate?: Date;
  endDate?: Date;
  formatPoints?: (value: number) => string;
  isAccumulator?: boolean;
}> = ({
  name,
  farmId,
  jwt,
  // onBack,
  startDate,
  endDate,
  formatPoints,
  isAccumulator,
}) => {
  const [data, setData] = useState<CompetitionLeaderboardResponse>();

  const formatDate = (date: Date) => date.toISOString().substring(0, 10);

  // Default 7 days ago
  const from = startDate
    ? formatDate(startDate)
    : formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const to = endDate
    ? formatDate(new Date(Math.min(Date.now(), endDate.getTime())))
    : formatDate(new Date());

  const { t } = useAppTranslation();
  useEffect(() => {
    const load = async () => {
      const data = await getPortalLeaderboard({
        farmId,
        name,
        jwt,
        from,
        to,
      });

      setData(data);
    };

    load();
  }, []);

  if (!data) return <Loading />;

  const { leaderboard, accumulators, miniboard, accumulatorMiniboard, player } =
    data;
  const items = (!!isAccumulator && accumulators?.slice(0, 10)) || leaderboard;
  // const title =
  //   !!isAccumulator && accumulators?.length
  //     ? t("competition.accumulator")
  //     : t("competition.highscore");
  const miniboardItems =
    !!isAccumulator && accumulatorMiniboard?.length
      ? accumulatorMiniboard
      : miniboard;
  return (
    <>
      <div>
        {/* <div className="flex justify-between  items-center mb-2">
          <Label type="default" className="">
            {`${t("competition.leaderboard")} - ${title}`}
          </Label>
        </div> */}

        <p className="font-secondary text-xs mb-2">{`${from} - ${endDate ? endDate.toISOString().substring(0, 10) : to}`}</p>

        <CompetitionTable items={items} formatPoints={formatPoints} />

        {/* Only show miniboard if player isn't in the main leaderboard */}
        {player && !items.find((m) => m.id === player.id) && (
          <>
            <p className="text-center text-xs mb-2">{`...`}</p>
            <CompetitionTable
              items={miniboardItems}
              formatPoints={formatPoints}
            />
          </>
        )}
      </div>

      {/* <Button className="mt-1" onClick={onBack}>
        {t("back")}
      </Button> */}
    </>
  );
};

export const CompetitionTable: React.FC<{
  items: CompetitionPlayer[];
  formatPoints?: (value: number) => string;
}> = ({ items, formatPoints }) => {
  const { t } = useAppTranslation();
  if (items.length === 0) {
    return <p className="text-sm">{t("leaderboard.empty")}</p>;
  }

  return (
    <table className="w-full text-xs table-fixed border-collapse">
      <tbody>
        {items.map(({ username, points, rank, bumpkin }, index) => (
          <tr
            key={index}
            className={classNames("relative", {
              "bg-[#ead4aa]": index % 2 === 0,
            })}
          >
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 text-left w-12"
            >
              {toOrdinalSuffix(rank)}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 text-left pl-8 relative"
            >
              <div className="absolute" style={{ left: "4px", top: "1px" }}>
                <NPCIcon width={24} parts={bumpkin} />
              </div>
              {username}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 truncate text-center"
            >
              {formatPoints?.(points) ?? points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
