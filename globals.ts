import { Application } from "pixi.js"
import GlobalCreator from "./src/gui/GlobalCreator";
import PanelController from "./src/controllers/PanelController";
import ReelsController from "./src/controllers/ReelsController";
import ReelsEngine from "./src/engine/ReelsEngine";

//Odlucila sam se da radim po singelton principu i globalnim objektima zbog pristupa
interface SLOT  {
    pixiApp?: Application;
    
    //GUI
    globalGui?: GlobalCreator,

    //LOGIKA
    panelController?: PanelController,
    reelsController?: ReelsController,

    //KOMUNIKACIJA SA "SERVEROM"
    reelsEngine?: ReelsEngine,
}

export const slot: SLOT =  {}