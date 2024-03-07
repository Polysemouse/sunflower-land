export type PortalName = "crop-boom" | "poly-town";

export const SUPPORTED_PORTALS: PortalName[] = ["crop-boom", "poly-town"];

export const MAX_TOTAL_ARCADE_TOKENS = 50;

export const DAILY_ARCADE_TOKENS: Record<PortalName, number> = {
  "crop-boom": 1,
  "poly-town": 1,
};
