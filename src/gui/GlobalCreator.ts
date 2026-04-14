import { Sprite } from "pixi.js";
import { slot } from "../../globals";
import PanelCreator from "./PanelCreator";
import ReelsCreator from "./ReelsCreator";

//Sadrzi sve vizuelne prikaze na jednom mestu. Htela sam da layering imam na jednom mestu
class GlobalCreator {

    public panelCreator: PanelCreator;
    public reelsCreator: ReelsCreator

    constructor() {
        this.setBackground();
        this.panelCreator = new PanelCreator();
        this.reelsCreator = new ReelsCreator();
    }

    public setBackground() {
      const background = Sprite.from("backgrounds/background.jpg");
      const logo = Sprite.from("backgrounds/logo.png");
      const branch = Sprite.from("backgrounds/branch.png");
    
      background.width = slot.pixiApp!.canvas.width;
      background.height = slot.pixiApp!.canvas.height;
    
      logo.x += 800;
      logo.y += 100;

      background.addChild(branch);
      background.addChild(logo);
      slot.pixiApp!.stage.addChild(background);
    } 

}

export default GlobalCreator;