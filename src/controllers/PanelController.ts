import { EventEmitter } from "pixi.js";
import { BET_CHANGE, REELS_UPDATE, WIN_CHANGE } from "../../constants";
import { slot } from "../../globals";

//Htela sam da prikazem event driven primer sa komunikacijom 
class PanelController extends EventEmitter {

    public betAmount = 10;
    public winAmount = 0;
    public betStep = 10;

    //Mogu i da koristim arrow funkcije jer ona nema svoj this u sklopu scope-a, npr to je u reactu
    constructor() {
        //Zbog EventEmittera
        super();

        this.increaseBet = this.increaseBet.bind(this);
        this.decreaseBet = this.decreaseBet.bind(this);
        this.updateWin = this.updateWin.bind(this);
    }

    public initizalizeUpdateWin() {
        slot.reelsController?.on(REELS_UPDATE, this.updateWin.bind(this));
    }

    public increaseBet() {
        this.betAmount += this.betStep;
         this.emit(BET_CHANGE, this.betAmount);
    }

    public decreaseBet() {
        this.betAmount -= this.betStep;
        this.emit(BET_CHANGE, this.betAmount);
    }

    public updateWin() {
        if(slot.reelsController?.win) {
            //Nije tacna logika, ali sam stavila cisto da bet isto utice na win jer moze da se menja
            this.winAmount += Number(slot.reelsController?.win?.amount) * this.betAmount;
            this.emit(WIN_CHANGE, this.winAmount);
        }
    }

    public fastPlay() {
        //Ovo je test. Za pravi slot bih verovatno napravila neki increment dok ne dostigne maksimum
        if(slot.reelsController?.isSpinning) {
            slot.reelsController?.setDelta(1.4);
            //kao ubrzala sam pa u fazonu i animacija treba manje da traje :)
            //razmisljala sam problem je kad ubrzam pa usporim.. Onda bi trebale kalkulacije vremenske da se rade 
            //to je todo
            slot.reelsController.setSpinDuration(3000)
        }
    }

    public slowPlay() {
        if(slot.reelsController?.isSpinning) {
            slot.reelsController?.setDelta(0.2);
            //usporila i animacija duze traje
            slot.reelsController.setSpinDuration(13000);
        }
    }
}

export default PanelController;