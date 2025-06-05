class Title extends Phaser.Scene {
    constructor() {
        super("title");
        this.my = {text: {}};
    }
    create() {
        let my = this.my;

        const width = 1520;

        this.add.text(width/2, 120, "Leap!", {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 180, "Frog?", {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(.5, 0).setTint(0xffffff);

        this.add.text(width/2, 520, "Press SPACE to Play!", {
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
            this.scene.start("select");
        }
        if (Phaser.Input.Keyboard.JustDown(this.zeroKey)) {
            this.scene.start("volcano");
        }
        if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
            this.scene.start("mountain");
        }
        if (Phaser.Input.Keyboard.JustDown(this.nKey)) {
            this.scene.start("mushroomlevel");
        }
    }
}