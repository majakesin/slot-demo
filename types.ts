import { Container, Texture } from "pixi.js";

export type SymbolId =
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "S7"
  | "S8"
  | "S9";


export type SYMBOL_TEXTURE = {
    symbolKey: SymbolId,
    texture: Texture,
}

export type WINLINES = {
    amount: string,
    type: string,
    positions: {
        reel: string,
        row: string,
    }[]
}

export type WIN = {
    amount: string,
    type: string,
    winLines: WINLINES[]
}

export type REELS = {
    container: Container,
    symbols: SYMBOL_TEXTURE[],
    activeSymbols?: SymbolId[],
    win: WIN | null
}

export type Reels =  {
    reels: SymbolId[][],
    win: WIN
}