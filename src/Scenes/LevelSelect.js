class Select extends Phaser.Scene {
    constructor() {
        super("select");
        this.my = {text: {}};
    }
    create() {
        let my = this.my;
        
        const width = 1520

         this.add.text(width/2, 120, "Make sure you grab your Power Up! (It'll help you beat the level)", {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 180, "Level 1 DOUBLE JUMP WOOHOOO", { 
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 240, "Level 2 GLIDE ZOOM", { 
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 300, "Level 3 hold space for a SPEED BOOST!", { //Level 2 GLIDE ZOOM, Level 3 hold space for a SPEED BOOST!
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 360, "Collect all the coins to continue past the first checkpoint!", {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 520, "Press SPACE to START!", {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.nKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("mushroomlevel");
        }
        if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
            this.scene.start("mountain");
        }
        if (Phaser.Input.Keyboard.JustDown(this.nKey)) {
            this.scene.start("level1");
        }
        if (Phaser.Input.Keyboard.JustDown(this.zeroKey)) {
            this.scene.start("volcano");
        }
    }
}