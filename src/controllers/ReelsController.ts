import { REELS, WIN, SymbolId } from "../../types";
import { slot } from "../../globals";
import { EventEmitter, Sprite } from "pixi.js";
import { REELS_UPDATE } from "../../constants";

class ReelsController extends EventEmitter {

    // Rezultat od jsona :) ostavila sam sve public zbog developmenta u fazi ciscenja bih proverila da li ima smisla da bude public
    // Mozda sma i mogla da sve bude private i da radim sa getterima i setterima
    public reels?: SymbolId[][];
    public win?: WIN;
    //koristimo za animaciju
    public spiningSpeed: number;
    public delta: number;
    public spinDuration?: number;
    public spinStartTime?: number;
    public isSpinning: boolean;

    constructor() {
        super();
        //prvo bindovanje
        this.initializeSymbols = this.initializeSymbols.bind(this);
        this.spin = this.spin.bind(this);
        this.runSpinAnimation = this.runSpinAnimation.bind(this);
        this.stopSpin = this.stopSpin.bind(this);

        // Mora biti manje od velicine cella :) bar difoltno
        this.spiningSpeed = 10;
        this.delta = 0.5;
        //difoltno sam stavila da je 10 sekundi
        this.spinDuration = 10000;
        this.isSpinning = false;
    }

    public async initializeSymbols() {
        this.reels = await slot.reelsEngine?.fetchInitialDefaultReels();
    }

    public async getSpinResult() {
        //Napravicu emiter da mi se svaki put ponovo iscrta grid kad dobijem rezultat.
        //Moze mozda i neki obsevrer patern ali vec sam radila sa emiterom pa cisto da nastavim sa istom logikom 
        const res = await slot.reelsEngine?.fetchSpinResult();
        this.reels = res!.reels;
        this.win = res!.win;
    }

    public spin() {
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.initReelsForSpin();
        //back to basic sto bi se reklo :) 
        this.spinDuration = 10000;
        this.spinStartTime = performance.now();

        this.addSpinAnimationOnTicker();
    }

    public  stopSpin() {
        this.isSpinning = false;
        slot.pixiApp?.ticker.remove(this.addSpinAnimationOnTicker);
        this.getSpinResult();
        this.restartReelsAfterSpin();
        this.emit(REELS_UPDATE);
    }

    public initReelsForSpin() {
    //Ovde cemo sad da dodamo sve symbole zbog animacije i kasnije brisemo kad je stop i ponovo koristimo creategrid :)
        const reels = slot.globalGui!.reelsCreator.reels!;
        const BASE_SYMBOL_SIZE = slot.globalGui?.reelsCreator!.BASE_SYMBOL_SIZE!;

        // Za test jer nigde ne cuvam nikakva prethodna stanja o ubrzanju
        this.setDelta(0.5);

        for(let i=0; i < reels.length; i++) {
              reels[i].container.removeChildren();
              reels[i].activeSymbols = [];
            for(let j = 0; j < reels[i].symbols.length; j++) {
                    const sprite = new Sprite(reels[i].symbols[j].texture);
                    sprite.anchor.set(0.5);
                    sprite.position.set(BASE_SYMBOL_SIZE / 2, j * BASE_SYMBOL_SIZE + BASE_SYMBOL_SIZE / 2);
                    reels[i].container.addChild(sprite)
                    reels[i].activeSymbols?.push(reels[i].symbols[j].symbolKey)
            }
        }
    }

    public restartReelsAfterSpin()
    {
        const reels = slot.globalGui!.reelsCreator.reels!;

        for(let i=0; i < reels.length; i++) {
              reels[i].container.removeChildren();
              reels[i].activeSymbols = [];
              //setuje nazad na 0 jer se y promenio zbog loop-a
              reels[i].container.position.y = 0;
        }

    }

    public runSpinAnimation = () => {
        if (!this.isSpinning) return;

        const reels = slot.globalGui!.reelsCreator.reels!;
        const symbolSize = slot.globalGui!.reelsCreator.BASE_SYMBOL_SIZE;

        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];

            reel.container.y += this.spiningSpeed * this.delta;

            this.loopReel(reel, symbolSize);
        }
    }

    private loopReel(reel: REELS, symbolSize: number) {
        const container = reel.container;
        const now = performance.now();

        //Zbog tickera u pixijs i paralelnosti izvrsavanja
        if(!this.isSpinning) {
            return;
        }

        for (let i = 0; i < container.children.length; i++) {
            const sprite = container.children[i] as Sprite;

            const globalY = sprite.y + container.y;

            // ako je izašao dole iz maske
            if (globalY >= symbolSize * reel.symbols.length) {
                sprite.y -= symbolSize * reel.symbols.length;
            }
        }

        if (now - this.spinStartTime! >= this.spinDuration!) {
            this.stopSpin();
        }
    }


    public addSpinAnimationOnTicker() {
        slot.reelsEngine!.spinOnTicker(this.runSpinAnimation)
    }

    public setDelta(newDelta: number) {

        // Ovde sam dodala provere kako bi otprilike edge case-ovi izgledali na pravom projektu
        if(newDelta > 1 ) {
            console.warn("Setting delta to be grater then 1 will cause issues. Please fix this.");
        }

        if(this.delta === newDelta) {
            return;
        }

        this.delta = newDelta;
    }

    public setSpinDuration(newDuration: number) {
        if(this.spinDuration === newDuration) {
            return;
        }
        this.spinDuration = newDuration;
    }

}

export default ReelsController;