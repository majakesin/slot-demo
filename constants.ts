export const BET_CHANGE = "BET_CHANGE";
export const WIN_CHANGE = "WIN_CHANGE";
export const REELS_UPDATE = "REELS_UPDATE";

export const SYMBOLS = {
    S1: "symbol_1_J",
    S2: "symbol_2_Q",
    S3: "symbol_3_K",
    S4: "symbol_4_A",
    S5: "symbol_5_eye",
    S6: "symbol_6_brain",
    S7: "symbol_7_skull",
    S8: "symbol_8_greenzombie",
    S9: "symbol_9_bluezombie"
} as const;

export const SYMBOL_KEYS = Object.keys(SYMBOLS);
export type SymbolKey = keyof typeof SYMBOLS;