class Mountain extends Phaser.Scene {
    constructor() {
        super("mountain")
    }
    preload() {
        this.load.image("mountainBG", "assets/free_volcano_tileset/images/Background.png");
    }
    create() {
        console.log("test worked");
        this.add.image(0, -800, "mountainBG").setOrigin(0);
    }
    update() {
        
    }
}