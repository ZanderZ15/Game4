class Title extends Phaser.Scene {
    constructor() {
        super("title");
        //WORKERS:x = -1000
        //nets and bananas: x = -2000
        this.my = {text: {}};
    }
    create() {
        let my = this.my;
        
        //TITLE AND CONTROLS
        this.dir ="";
        const width = 1520
        my.text.wt = this.add.bitmapText(width/2, 120, "rocketSquare", "Welcome to").setOrigin(.5, 0); 
        my.text.ze = this.add.bitmapText(width/2, 180, "rocketSquare", "Zoo Escape!").setOrigin(.5, 0);
        my.text.ptp = this.add.bitmapText(width/2, 520, "rocketSquare", "Press P to play").setOrigin(.5, 0);
        //my.text.wt.setAlign("center");
        console.log("Level1");
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
    }
    update() {
        //if reset, go back to scene 1
        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.scene.start("level1");
        }
        if (Phaser.Input.Keyboard.JustDown(this.zeroKey)) {
            this.scene.start("end");
        }
    }
}