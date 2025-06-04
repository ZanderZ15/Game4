class Volcano extends Phaser.Scene {
    constructor() {
        super("volcano")
    }
    preload() {
        this.load.image("volcanoBG", "assets/Volcano/images/Background.png");
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }
    create() {
        //BG
        this.add.image(0, -800, "volcanoBG").setOrigin(0);
        //Map
        this.map = this.add.tilemap("volcano", 18, 18, 100, 20);
        
        this.i_tiles = this.map.addTilesetImage("I1", "industry_tiles");
        this.g_tiles = this.map.addTilesetImage("g1", "generated");
        
        this.deathLayer = this.map.createLayer("Death", this.g_tiles, 0, 0);
        this.groundLayer = this.map.createLayer("Ground", this.g_tiles, 0, 0);
        this.pLayer = this.map.createLayer("Passables", this.i_tiles, 0, 0);

        this.animatedTiles.init(this.map);

        //Player
        my.sprite.player = this.physics.add.sprite(10, 10, "frog", "idle");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setSize(18, 18).setOffset(1,1);
    }   
    update() {
        
    }
}