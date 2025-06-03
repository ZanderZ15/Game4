class Title extends Phaser.Scene {
    constructor() {
        super("title");
        this.my = {text: {}};
    }
    create() {
        let my = this.my;
        
        const width = 1520
        my.text.wt = this.add.bitmapText(width/2, 120, "rocketSquare", "Leap!").setOrigin(.5, 0); 
        my.text.ze = this.add.bitmapText(width/2, 180, "rocketSquare", "Frog?").setOrigin(.5, 0);
        my.text.ptp = this.add.bitmapText(width/2, 520, "rocketSquare", "Press SPACE to play").setOrigin(.5, 0);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("level1");
        }
        if (Phaser.Input.Keyboard.JustDown(this.zeroKey)) {
            this.scene.start("end");
        }
        if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
            this.scene.start("mountain");
        }
    }
}