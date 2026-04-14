import { Sprite, Text, Container, TextStyle } from "pixi.js";
import { slot } from "../../globals";

class InteractivePanel {
    public container: Container;
    public sprite: Sprite;
    public explenatoryText: Text;
    public valueText: Text;
    public EMIT_EVENT_KEY?: string;

    //Napravila sam ovo da mi je potencijalno lakse manipulisati sa vrednostima
    constructor(sprite: Sprite, e_text: string, v_text: string, EMIT_EVENT_KEY?: string) {

        //prvo bajndovanje za this
        this.setValueText = this.setValueText.bind(this);

        //vizuelni prikaz
        this.container = new Container();
        this.sprite = sprite;
        this.explenatoryText = new Text({text: e_text, style:new TextStyle({fontSize: 266,fill: 0xffffff,fontWeight: "bold"})});
        this.valueText = new Text({text: v_text, style: new TextStyle({fontSize:266,fill: 0xffffff,fontWeight: "bold"})});

        //pomeranje vrednosti u desno vizuelno, fyi: ne bih koristila hardcoded vrednosti na pravom projektu
        this.explenatoryText.x +=50;
        this.valueText.x += 2*this.sprite.width/3;

        this.container.addChild(sprite);
        this.container.addChild(this.explenatoryText);
        this.container.addChild(this.valueText);

        if(EMIT_EVENT_KEY) {
            this.EMIT_EVENT_KEY = EMIT_EVENT_KEY;
            slot.panelController?.on(EMIT_EVENT_KEY, this.setValueText)
        }
    }

    setValueText(value: number) {
        this.valueText.text = value.toString();
    }
}

export default InteractivePanel;