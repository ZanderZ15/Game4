class Volcano extends Phaser.Scene {
    constructor() {
        super("volcano")
    }
    preload() {
        this.load.image("volcanoBG", "assets/free_volcano_tileset/images/Background.png");
    }
    create() {
        console.log("test worked");
        this.add.image(0, -800, "volcanoBG").setOrigin(0);
    }
    update() {
        
    }
}