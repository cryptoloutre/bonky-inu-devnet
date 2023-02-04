export type BonkyInu = {
  "version": "0.1.0",
  "name": "bonky_inu",
  "instructions": [
    {
      "name": "initializeVault",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeUpdateAuthority",
      "accounts": [
        {
          "name": "updateAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeStatePda",
      "accounts": [
        {
          "name": "statepda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeBonkVault",
      "accounts": [
        {
          "name": "tokenpda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "statepda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeBurnCounter",
      "accounts": [
        {
          "name": "burncounter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializePlayer",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "newGame",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenpda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "statepda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "burncounter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "revive",
      "accounts": [
        {
          "name": "tokenpda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "burncounter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "newHighscore",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newHighscore",
          "type": "u16"
        }
      ]
    },
    {
      "name": "unlockAchievement",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "updateAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "achievement",
          "type": "string"
        }
      ]
    },
    {
      "name": "withdrawVault",
      "accounts": [
        {
          "name": "withdrawer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountOfLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawBonkVault",
      "accounts": [
        {
          "name": "withdrawer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenpda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "statepda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gamePlayed",
            "type": "u16"
          },
          {
            "name": "highscore",
            "type": "u16"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "a1IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a2IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a3IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a4IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a5IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a6IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a7IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a8IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a9IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a10IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a11IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a12IsUnlocked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawer",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "state",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "burnCounter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "counter",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "NewGamePlayed",
      "fields": [
        {
          "name": "gamePlayed",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "Revived",
      "fields": []
    },
    {
      "name": "NewHighscoreSet",
      "fields": [
        {
          "name": "highscore",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "AchievementUnlocked",
      "fields": [
        {
          "name": "a1IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a2IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a3IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a4IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a5IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a6IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a7IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a8IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a9IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a10IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a11IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a12IsUnlocked",
          "type": "bool",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidNumberGame",
      "msg": "you have not played enough games"
    },
    {
      "code": 6001,
      "name": "InvalidHighscore",
      "msg": "you have not score enough points"
    },
    {
      "code": 6002,
      "name": "InvalidUnlocked",
      "msg": "you have not unlock the others achievements"
    }
  ]
};

export const IDL: BonkyInu = {
  "version": "0.1.0",
  "name": "bonky_inu",
  "instructions": [
    {
      "name": "initializeVault",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeUpdateAuthority",
      "accounts": [
        {
          "name": "updateAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeStatePda",
      "accounts": [
        {
          "name": "statepda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeBonkVault",
      "accounts": [
        {
          "name": "tokenpda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "statepda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeBurnCounter",
      "accounts": [
        {
          "name": "burncounter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializePlayer",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "newGame",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenpda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "statepda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "burncounter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "revive",
      "accounts": [
        {
          "name": "tokenpda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "burncounter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "newHighscore",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newHighscore",
          "type": "u16"
        }
      ]
    },
    {
      "name": "unlockAchievement",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "updateAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "achievement",
          "type": "string"
        }
      ]
    },
    {
      "name": "withdrawVault",
      "accounts": [
        {
          "name": "withdrawer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountOfLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawBonkVault",
      "accounts": [
        {
          "name": "withdrawer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenpda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "statepda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gamePlayed",
            "type": "u16"
          },
          {
            "name": "highscore",
            "type": "u16"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "a1IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a2IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a3IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a4IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a5IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a6IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a7IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a8IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a9IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a10IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a11IsUnlocked",
            "type": "bool"
          },
          {
            "name": "a12IsUnlocked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawer",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "state",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "burnCounter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "counter",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "NewGamePlayed",
      "fields": [
        {
          "name": "gamePlayed",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "Revived",
      "fields": []
    },
    {
      "name": "NewHighscoreSet",
      "fields": [
        {
          "name": "highscore",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "AchievementUnlocked",
      "fields": [
        {
          "name": "a1IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a2IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a3IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a4IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a5IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a6IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a7IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a8IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a9IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a10IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a11IsUnlocked",
          "type": "bool",
          "index": false
        },
        {
          "name": "a12IsUnlocked",
          "type": "bool",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidNumberGame",
      "msg": "you have not played enough games"
    },
    {
      "code": 6001,
      "name": "InvalidHighscore",
      "msg": "you have not score enough points"
    },
    {
      "code": 6002,
      "name": "InvalidUnlocked",
      "msg": "you have not unlock the others achievements"
    }
  ]
};
