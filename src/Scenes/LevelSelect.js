class Select extends Phaser.Scene {
    constructor() {
        super("select");
        this.my = {text: {}};
    }
    create() {
        let my = this.my;
        
        const width = 1520
        my.text.a = this.add.bitmapText(width/2, 120, "rocketSquare", "Press Space to go to \"Level1\"").setOrigin(.5, 0); 
        my.text.b = this.add.bitmapText(width/2, 160, "rocketSquare", "Press M to go to \"mountains\"").setOrigin(.5, 0);
        my.text.c = this.add.bitmapText(width/2, 200, "rocketSquare", "Press N to go to \"Mushrooms\"").setOrigin(.5, 0);
        my.text.d = this.add.bitmapText(width/2, 240, "rocketSquare", "Press 0 to go to \"volcano\"").setOrigin(.5, 0);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.nKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("level1");
        }
        if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
            this.scene.start("mountain");
        }
        if (Phaser.Input.Keyboard.JustDown(this.nKey)) {
            this.scene.start("mushroomlevel");
        }
        if (Phaser.Input.Keyboard.JustDown(this.zeroKey)) {
            this.scene.start("volcano");
        }
    }
}