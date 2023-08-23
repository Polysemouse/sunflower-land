export const ERRORS = {
  NO_WEB3: "NO_WEB3",
  WALLET_INITIALISATION_FAILED: "WALLET_INITIALISATION_FAILED",
  NO_WEB3_PHANTOM: "NO_WEB3_PHANTOM",
  NO_WEB3_CRYPTO_COM: "NO_WEB3_CRYPTO_COM",
  WRONG_CHAIN: "WRONG_CHAIN",
  NO_FARM: "NO_FARM",
  FAILED_REQUEST: "FAILED_REQUEST",
  REJECTED_TRANSACTION: "REJECTED_TRANSACTION",
  BLOCKED: "BLOCKED",
  NETWORK_CONGESTED: "NETWORK_CONGESTED",

  // Blockchain session has changed - they are doing something sneaky refreshing the browser
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Server errors
  DISCORD_USER_EXISTS: "DISCORD_USER_EXISTS",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  MAINTENANCE: "MAINTENANCE",
  MULTIPLE_DEVICES_OPEN: "MULTIPLE_DEVICES_OPEN",

  // Server Errors (Named after API endpoint)
  AUTOSAVE_SERVER_ERROR: "AS-001",
  AUTOSAVE_CLOCK_ERROR: "AS-002",
  SYNC_SERVER_ERROR: "SY-001",
  SYNC_DAILY_SFL_MINT_EXCEEDED: "SY-002",
  SESSION_SERVER_ERROR: "SE-001",
  EXPAND_LAND_SERVER_ERROR: "EX-001",
  MINT_SERVER_ERROR: "MI-001",
  WITHDRAW_SERVER_ERROR: "WD-001",
  MINT_COLLECTIBLE_SERVER_ERROR: "MC-001",
  WISHING_WELL_SERVER_ERROR: "WW-001",
  CREATE_ACCOUNT_SERVER_ERROR: "CR-001",
  LOGIN_SERVER_ERROR: "LO-001",
  OAUTH_SERVER_ERROR: "OA-001",
  RESET_SERVER_ERROR: "RE-001",
  AUCTIONEER_SERVER_ERROR: "AU-001",
  BANS_SERVER_ERROR: "BA-001",
  MIGRATED_SERVER_ERROR: "MG-001",
  DISCORD_ROLE_SERVER_ERROR: "DI-001",
  CANCEL_TRADE_SERVER_ERROR: "CT-001",
  LIST_TRADE_SERVER_ERROR: "LT-001",
  PURCHASE_TRADE_SERVER_ERROR: "PT-001",
  ONRAMP_SERVER_ERROR: "ON-001",
  BUMPKINS_METADATA_ERROR: "BM-001",

  // Wishing well errors
  NO_TOKENS: "NO_TOKENS",

  // Sequence
  SEQUENCE_NOT_CONNECTED: "SEQUENCE_NOT_CONNECTED",
};

export type ErrorCode = keyof typeof ERRORS;
