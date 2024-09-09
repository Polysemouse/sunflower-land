export default [
  {
    inputs: [
      {
        internalType: "contract SunflowerLandSessionManager",
        name: "_session",
        type: "address",
      },
      {
        internalType: "contract SunflowerLandInventory",
        name: "_inventory",
        type: "address",
      },
      {
        internalType: "contract SunflowerLandToken",
        name: "_token",
        type: "address",
      },
      {
        internalType: "contract SunflowerLand",
        name: "_farm",
        type: "address",
      },
      {
        internalType: "contract BumpkinWearables",
        name: "_bumpkinWearables",
        type: "address",
      },
      {
        internalType: "address",
        name: "_syncFeeWallet",
        type: "address",
      },
      { internalType: "address", name: "_signer", type: "address" },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "sessionId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "farmId",
        type: "uint256",
      },
    ],
    name: "SessionChanged",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_game", type: "address" }],
    name: "addGameRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "bumpkinWearables",
    outputs: [
      {
        internalType: "contract BumpkinWearables",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "destroy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "executed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "farm",
    outputs: [
      {
        internalType: "contract SunflowerLand",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_game", type: "address" }],
    name: "gameAddGameRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_game", type: "address" }],
    name: "gameRemoveGameRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "gameRoles",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256[]", name: "_ids", type: "uint256[]" }],
    name: "getMaxItemAmounts",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "inventory",
    outputs: [
      {
        internalType: "contract SunflowerLandInventory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintAllowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintedAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_game", type: "address" }],
    name: "removeGameRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "session",
    outputs: [
      {
        internalType: "contract SunflowerLandSessionManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "sessions",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "_amounts", type: "uint256[]" },
    ],
    name: "setMaxItemAmounts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "setMaxSessionSFL",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "_amounts", type: "uint256[]" },
    ],
    name: "setMaxWearableAmounts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "setMintAllowance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes", name: "signature", type: "bytes" },
          { internalType: "uint256", name: "farmId", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bytes32", name: "sessionId", type: "bytes32" },
          {
            internalType: "bytes32",
            name: "nextSessionId",
            type: "bytes32",
          },
          { internalType: "uint256", name: "fee", type: "uint256" },
          {
            components: [
              {
                internalType: "uint256[]",
                name: "mintIds",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "mintAmounts",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "burnIds",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "burnAmounts",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "wearableIds",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "wearableAmounts",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "wearableBurnIds",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "wearableBurnAmounts",
                type: "uint256[]",
              },
              { internalType: "int256", name: "tokens", type: "int256" },
            ],
            internalType: "struct SunflowerLandGame.ProgressData",
            name: "progress",
            type: "tuple",
          },
        ],
        internalType: "struct SunflowerLandGame.SyncProgressData",
        name: "data",
        type: "tuple",
      },
    ],
    name: "syncProgress",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "syncedAt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract SunflowerLandToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_signer", type: "address" }],
    name: "transferSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_team", type: "address" }],
    name: "transferSyncFeeWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;