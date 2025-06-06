class End extends Phaser.Scene {
    constructor() {
        super("end");
        this.my = {text: {}};
    }
    create() {
        let my = this.my;

        const width = 1520;
        
        this.add.text(width/2, 120, "YAY YOU DID IT", {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 180, "WAHOOO", {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 240, "Thanks for playing!", {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 520, "Press Space", {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("title");
        }
    }
}