class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        

        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "./Characters/tilemap-characters-packed.png", "./Characters/tilemap-characters-packed.json");

        //Text
        this.load.bitmapFont("rocketSquare", "./Text/KennyRocketSquare_0.png", "./Text/KennyRocketSquare.fnt");
        // Load tilemap information
        
        this.load.image("tiles", "tilemap_packed.png");
        this.load.image("background", "tilemap-backgrounds_packed.png");
        
        
        this.load.tilemapTiledJSON("level1", "Level1_Outside.json");   // Tilemap in JSON
        // Load the tilemap as a spritesheet
        this.load.spritesheet("bg_sheet", "tilemap-backgrounds_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        
        this.load.setPath("./assets/Particles/");
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
        
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "/Text/KennyRocketSquare_0.png", "/Text/KennyRocketSquare.fnt");

        this.load.audio("coin", "Audio/impactBell_heavy_000.ogg");

        
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("title");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}