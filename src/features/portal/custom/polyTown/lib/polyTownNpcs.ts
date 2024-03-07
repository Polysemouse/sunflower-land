import { PolyTownNpcName } from "./consts/nameTypes";

const acknowledgedPolyTownNPCsKey = "acknowledgedPolyTownNPCs";

type AcknowledgedNPCs = Partial<Record<PolyTownNpcName, number>>;
export function acknowedlgedPolyTownNpcs(): AcknowledgedNPCs {
  const item = localStorage.getItem(acknowledgedPolyTownNPCsKey);

  if (!item) {
    return {};
  }

  return JSON.parse(item as any) as AcknowledgedNPCs;
}

export function acknowledgePolyTownNpc(npcName: PolyTownNpcName) {
  const previous = acknowedlgedPolyTownNpcs();

  localStorage.setItem(
    acknowledgedPolyTownNPCsKey,
    JSON.stringify({
      ...previous,
      [npcName]: Date.now().toString(),
    })
  );
}

export function isPolyTownNpcAcknowledged(npcName: PolyTownNpcName) {
  const acknowledged = acknowedlgedPolyTownNpcs();

  return acknowledged[npcName] != null;
}
