import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { REELS_UPDATE, SYMBOLS, SYMBOL_KEYS, SymbolKey } from "../../constants";
import { slot } from "../../globals";
import { SYMBOL_TEXTURE, REELS, WINLINES } from "../../types";

class ReelsCreator {

  public rootReelContainer: Container;

  public reels: REELS[] = [];
  public allSymbolTextures?: SYMBOL_TEXTURE[];

  public winDuration = 0;

  private REELS = 5;
  private ROWS = 3;

   // Pokusaj za skaliranje prilikom resize-a
  private DESIGN_WIDTH = 1920;
  private DESIGN_HEIGHT = 1080;

  public BASE_CELL = 400;
  public BASE_SYMBOL_SIZE = 220;

  constructor() {
    this.rootReelContainer = new Container();

    this.createTextureForEachSymbol();
    this.createReels();
    this.createGrid();
    this.createMask();

    slot.pixiApp!.stage.addChild(this.rootReelContainer);

    // Slusaj kad se reel promeni i opet iscrtaj grid.. 
    slot.reelsController?.on(REELS_UPDATE, this.updateCreateGrid.bind(this));

    // resize
    this.updateLayout();
    this.bindResize();
  }

  // Kesiranje texture.  Ne smem koristiti isti sprite, samo mogu kesirati da bude u memoriji pa svaki put se novi sprite kreira
  public createTextureForEachSymbol() {
    this.allSymbolTextures = [];

    for (const key of SYMBOL_KEYS) {
      this.allSymbolTextures.push({
        symbolKey: key as SymbolKey,
        texture: this.getTexture(key as SymbolKey),
      });
    }
  }

  // Napravila sam da pattern za putanju za simbole bude isti da bih mogla da napraivm genericku  metodu
  private getTexture(symbol: SymbolKey): Texture {
    return Texture.from(`symbols/${SYMBOLS[symbol]}.png`);
  }

  // Incijalno pravljenje reelova. Jedan roditeljski kontejner sa 5 reel kontejnera
  public createReels() {
    for (let i = 0; i < this.REELS; i++) {
      const reelContainer = new Container();
      this.reels.push({
        container: reelContainer,
        symbols: this.allSymbolTextures!,
        win: null,
      });

      this.rootReelContainer.addChild(reelContainer);
    }
  }

  // Metoda za prvu inicijalizaciju grida (reelova)
  public createGrid() {
    for (let reel = 0; reel < this.REELS; reel++) {
      for (let row = 0; row < this.ROWS; row++) {

        const symbol = slot.reelsController!.reels![reel][row];

        const symbolTexture = this.allSymbolTextures!.find(sym => sym.symbolKey === symbol);

        if (!symbolTexture) continue;

        const sprite = new Sprite(symbolTexture.texture);

        sprite.anchor.set(0.5);
        sprite.position.set(this.BASE_SYMBOL_SIZE / 2, row * this.BASE_SYMBOL_SIZE + this.BASE_SYMBOL_SIZE / 2);
        this.reels[reel].container.addChild(sprite);
    
        if(!this.reels[reel].activeSymbols) {
            this.reels[reel].activeSymbols = [];
        }

        this.reels[reel].activeSymbols!.push(symbol);
      }
    }
  }

  // Metodu koristimo posle reel update-a, nakon spina. Kad sa "servera" dobijemo rezultat
  public updateCreateGrid() {
      slot.reelsEngine?.removeWinOnTicker(this.animateWinSymbol.bind(this, null));
      this.winDuration = 0;

       for (let reel = 0; reel < this.REELS; reel++) {
          for (let row = 0; row < this.ROWS; row++) {

            const symbol = slot.reelsController!.reels![reel][row];

            const symbolTexture = this.allSymbolTextures!.find(sym => sym.symbolKey === symbol);

            if (!symbolTexture) continue;

            const sprite = new Sprite(symbolTexture.texture);

            sprite.anchor.set(0.5);
            sprite.position.set(this.BASE_SYMBOL_SIZE / 2, row * this.BASE_SYMBOL_SIZE + this.BASE_SYMBOL_SIZE / 2);
            this.reels[reel].container.addChildAt(sprite, row);
            this.reels[reel].activeSymbols!.push(symbol);
          }
    }

    if(slot.reelsController?.win) {
        this.drawWinFrames(slot.reelsController.win.winLines);
    }
  }

  public drawWinFrames(winLines: WINLINES[]) {
    winLines.forEach(line => {
        line.positions.forEach(pos => {
            const frame = new Sprite(Texture.from("wins/frame.png"));
            const symbol = this.reels[Number(pos.reel)].container.children[Number(pos.row)];
            this.reels[Number(pos.reel)].container.addChild(frame);

            // Da radi typescript treba da extendujem pixijs sprite medjutim mislim da za test primer nije potrebno
            //@ts-ignore
            symbol.winActive = true;

            frame.x = symbol.x;
            frame.y = symbol.y;
            frame.scale.set(0.4, 0.4);

            frame.anchor.set(0.5);
            slot.reelsEngine?.winOnTicker(this.animateWinSymbol.bind(this,symbol))
    })});
  }

  //Ovde cu dodati logiku za animaciju win simbola, dvoumila sam se da li u controlleru ali posto se animira pa mi je to gui
  public animateWinSymbol(symbol: Container | null) {
      this.winDuration+=0.5;
      if(symbol)
      symbol.rotation =  Math.sin(this.winDuration) * 0.2;
  }

  public createMask() {
    // Da mi ne prelazi ivice reela :) 
    const padding = 50;
    const mask = new Graphics();
    //Ove metode su deprecated verovatno postoji noviji nacin za filovanje
    mask.beginFill(0xffffff);
    //Naravno no magic numbers :)
    mask.drawRect(0,0, 5 * this.BASE_CELL, 3 * this.BASE_SYMBOL_SIZE  - padding);
    mask.endFill();

    this.rootReelContainer.mask = mask;
  }


  //Jedino sam skaliranje prekopirala sa chatGPTija posto nisma nikad pixijs radila pa se nisam htela
  //trenutno opterecivati sa tim. To zahteva dublje istrazivanje
  private getScale() {
    const app = slot.pixiApp!;

    const scaleX = app.screen.width / this.DESIGN_WIDTH;
    const scaleY = app.screen.height / this.DESIGN_HEIGHT;

    return Math.min(scaleX, scaleY);
  }

  public updateLayout() {
    const app = slot.pixiApp!;
    const scale = this.getScale();

    this.rootReelContainer.position.set(
      app.screen.width * 0.43,
      app.screen.height * 0.25
    );

    // scale everything together
    this.rootReelContainer.scale.set(scale);

    // position reels relative to center
    const spacing = this.BASE_CELL;

    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i].container.x =(i - (this.REELS - 1) / 2) * spacing;
      this.reels[i].container.y = 0;
    }
  }

  private bindResize() {
    window.addEventListener("resize", () => {
      this.updateLayout();
    });
  }
}

export default ReelsCreator;