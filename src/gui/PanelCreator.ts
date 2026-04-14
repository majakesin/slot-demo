import { Container, Sprite } from 'pixi.js';
import { slot } from '../../globals';
import Button from '../helpers/Button';
import InteractivePanel from '../helpers/InteractivePanel';
import { BET_CHANGE, REELS_UPDATE, WIN_CHANGE } from '../../constants';

class PanelCreator {

    //Dodala bih properti za svako dugme cisto zarad potencijalne manipulacija kasnije
    //Ostavila sma opciju da moze da bude undefined jer je test primer inace bih dodala logiku da uvek ovi osnovni dugmici moraju postojati
    private plusButton?: Button;
    private minusButton?: Button;
    private spinButton?: Button;
    private gambleButton?: Button;

    private fastPlay?: Button;
    private slowPlay?: Button;

    private bet?: InteractivePanel;
    private win?: InteractivePanel;
    
    constructor() {
        this.createPanel();
    }

    createPanel() {
        const parentContainer = new Container();

        // buttoni sa assetima
        this.plusButton = new Button(Sprite.from(this.getButtonAssetPath("buttons/plus", true)),null,true, slot.panelController!.increaseBet)
        this.minusButton = new Button(Sprite.from(this.getButtonAssetPath("buttons/minus", true)),null,true, slot.panelController!.decreaseBet);
        this.spinButton = new Button(Sprite.from(this.getButtonAssetPath("buttons/spin",true)),null,true, slot.reelsController?.spin);
        this.gambleButton = new Button(Sprite.from(this.getButtonAssetPath("buttons/gamble", true)), null,true);

        //buttoni sa rect i textom, to sam naknadno dodala jer nisam imala asete za ove dugmice
        this.fastPlay = new Button(null, ">>", true, slot.panelController?.fastPlay);
        this.slowPlay = new Button(null, "<<", true, slot.panelController?.slowPlay);


        //za tekstove ovde se inace u slotovima koriste spritesheetovi fontovi i bitmaptext. Za test primer sam koristila obican text u produkciji ne bih
        this.bet = new InteractivePanel(Sprite.from("buttons/bottom_panel.png"), "BET", slot.panelController!.betAmount.toString(), BET_CHANGE);
        this.bet.container.scale.x = 0.4;
        this.win = new InteractivePanel(Sprite.from("buttons/bottom_panel.png"), "WIN", slot.panelController!.winAmount.toString(), WIN_CHANGE);
        this.win.container.scale.x = 0.5;

        const positioningArray = [
            this.minusButton.container,
            this.bet.container,
            this.plusButton.container,
            this.win.container,
            this.gambleButton.container,
            this.slowPlay.container,
            this.fastPlay.container,
            this.spinButton.container,
        ]

        let currentX = 0;
        const spacing = 5;

        positioningArray.forEach((container) => {
                container.x = currentX;
                container.y = 0;
                currentX += container.width + spacing;
        });

        parentContainer.addChild(this.minusButton.container);
        parentContainer.addChild(this.bet.container);
        parentContainer.addChild(this.plusButton.container);
        parentContainer.addChild(this.win.container);
        parentContainer.addChild(this.gambleButton.container);
        parentContainer.addChild(this.slowPlay.container);
        parentContainer.addChild(this.fastPlay.container);
        parentContainer.addChild(this.spinButton.container);

        parentContainer.scale.set(0.2);
        parentContainer.x = slot.pixiApp!.screen.width / 2 - parentContainer.width / 2;
        parentContainer.y = slot.pixiApp!.screen.height * 0.85;

        slot.pixiApp!.stage.addChild(parentContainer);
    }

    
    //dodati toggle button sutra

    getButtonAssetPath(name: string, enabled: true) {

        // Ovo sam uradila kao primer za prikaz i disabled i enabled dugmeta, a strukturu naziva fajlova sam uskladila
        return enabled ? `${name}.png` : `${name}_disabled.png`
    }
}

export default PanelCreator;