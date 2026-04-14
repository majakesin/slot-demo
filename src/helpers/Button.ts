import { Sprite, Container, FederatedEvent, Graphics, Text, TextStyle } from "pixi.js";

class Button {

    public container: Container;
    public enabled: Boolean;
    public clickCallback?: (event: FederatedEvent) => void;

     public sprite?: Sprite;
     public text?: string;

    constructor(sprite: Sprite | null, text: string | null, enabled: Boolean, clickCallback?:(event?: FederatedEvent) => void) {
        this.container = new Container();
        this.enabled = enabled;

        if(clickCallback) {
            this.clickCallback = clickCallback;
        }

        if(sprite) {
            this.sprite = sprite;
            this.container.addChild(this.sprite);
        }

        //Naknadno sam dodala da imamo i iscrtavanje dugmica jer nisam imala assete za ubrzanje i usporavanje
        if(text) {
            this.text = text;
            const buttonBg = new Graphics().roundRect(0, 0, 300, 260, 10).fill(0x680000).stroke({ width: 20, color: 0xe79e32 });
            const buttonText = new Text({text: this.text, style: new TextStyle({ fill: 0xffffff,fontSize: 180,fontWeight: 'bold'})});

            buttonText.anchor.set(0.5);
            buttonText.x = 150;
            buttonText.y = 130;

            this.container.addChild(buttonBg, buttonText);
        }
      
        this.container.eventMode = "static";
        this.container.cursor = "pointer"
        
        this.container.on('pointerdown', (event: FederatedEvent) => {
            if (this.clickCallback) {
                this.clickCallback(event);
            }
        })
    }
}

export default Button;