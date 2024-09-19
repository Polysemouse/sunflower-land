import { useState } from "react";

import letter from "assets/icons/letter.png";
import factions from "assets/icons/factions.webp";

export const CROPS_AND_CHICKEN_MAILS = [
  {
    title: "New Weekly Mission",
    content: [
      "A new weekly mission is available! Complete it to earn extra attempts per day for the rest of the week.",
      "Missions have now been moved to their own tab.",
    ],
    icon: factions,
    id: 1,
  },
  {
    title: "Mailbox is here!",
    content: [
      "The mailbox has arrived! You can check the mail for the latest minigame updates.",
    ],
    icon: letter,
    id: 0,
  },
];

const LOCAL_STORAGE_KEY = "cropsAndChickens.mailRead";

export function getReadMails(): number[] {
  const cachedMailIdsString = localStorage.getItem(LOCAL_STORAGE_KEY);

  let mailIds: number[] = [];
  try {
    mailIds = cachedMailIdsString ? JSON.parse(cachedMailIdsString) : [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to parse mail IDs:", error);
  }

  return mailIds;
}

export const useMailRead = () => {
  const [readMailIds, setReadMailIds] = useState(getReadMails());

  const unreadMailCount = CROPS_AND_CHICKEN_MAILS.reduce(
    (acc, mail) => (readMailIds.includes(mail.id) ? acc : acc + 1),
    0,
  );

  const setMailRead = (id: number) => {
    const mailIds = readMailIds;

    const newMailIds = [...mailIds.filter((mailId) => mailId !== id), id];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMailIds));
    setReadMailIds(newMailIds);
  };

  const isMailRead = (id: number) => readMailIds.includes(id);

  return { unreadMailCount, isMailRead, setMailRead };
};
