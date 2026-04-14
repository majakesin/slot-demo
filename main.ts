import { Application, Assets } from "pixi.js";
import { slot } from "./globals";
import assets from "./assets";
import GlobalCreator from "./src/gui/GlobalCreator";
import PanelController from "./src/controllers/PanelController";
import ReelsController from "./src/controllers/ReelsController";
import ReelsEngine from "./src/engine/ReelsEngine";

const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 600;

(async () =>
{
    
    const app = new Application();
    await app.init({ background: '#2a5f07', resizeTo: window });
    document.body.appendChild(app.canvas);


    app.ticker.add((time) => {});

    Assets.init({basePath: "/assets/images/"})
    // Ucitavanje asseta
    await Assets.load(assets)

    // Nije optimalno resenje, jer inace reelovi ne menjaju svoju velicinu u odnosu na velicinu prozora
    function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    app.stage.width = w;
    app.stage.height = h;
    }

    window.addEventListener('resize', resize);
  
    //Ideja da napravim globalne singelton instance koje mogu koristiti kroz projekat
    //Takodje redosled bitan : engine, controlleri , gui, app

    slot.reelsEngine = new ReelsEngine();

    
    slot.panelController = new PanelController();
    slot.reelsController = new ReelsController();

    slot.panelController.initizalizeUpdateWin();
    

    //Zbog cekanja async/await
    await slot.reelsController.initializeSymbols();

    slot.pixiApp = app;
    slot.globalGui = new GlobalCreator();

    // Za dev verziju za testiranje :) 
    //@ts-ignore
    globalThis.__PIXI_APP__ = app;
})();