import { TickerCallback } from "pixi.js";
import { slot } from "../../globals";
import { Reels, SymbolId } from "../../types";

//Za fetchovanje i za setovanje animacija na reelove :) 
//Dvoumim se zbog solid principa da li je trebalo da bude samo fetchovanje i da odvojim, ali test je primer pa oke. 
class ReelsEngine {

  public async fetchInitialDefaultReels(): Promise<SymbolId[][]> {
    const res = await fetch('/results.json');
    const data = await res.json();

    return data.default.reels;
  }

  public async fetchSpinResult(): Promise<Reels> {
    const res = await fetch('/results.json');
    const data = await res.json();
    const index = Math.floor(Math.random() * data.spins.length);
    return data.spins[index];
  }

  public spinOnTicker(updateSpin: TickerCallback<this>) {
    const ticker = slot.pixiApp!.ticker;

    //da ne dodje do dupliciranja
    ticker.remove(updateSpin, this);
    ticker.add(updateSpin, this);
  }

  public winOnTicker(animateWin: TickerCallback<this>) {
    const ticker = slot.pixiApp!.ticker;

    //da ne dodje do dupliciranja
    ticker.remove(animateWin, this);
    ticker.add(animateWin, this);
  }

  public removeWinOnTicker(animateWin: TickerCallback<this>)
  {
    const ticker = slot.pixiApp!.ticker;

    //da ne dodje do dupliciranja
    ticker.remove(animateWin, this);
  }
}

export default ReelsEngine;