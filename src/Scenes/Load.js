class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {

        this.load.setPath("./assets/");

        // Load mr.froggy spritesheet
        this.load.atlas("frog-base", "./Characters/FrogNPC.png", "./Characters/FrogNPC.json"); 

        //Text
        this.load.bitmapFont("rocketSquare", "./Text/KennyRocketSquare_0.png", "./Text/KennyRocketSquare.fnt");
        
        // Load tilemap information
        this.load.image("tiles", "tilemap_packed.png");
        this.load.image("background", "tilemap-backgrounds_packed.png");
        this.load.image("level-1-bg", "bg_grasslands.png"); 

        //load in extra particle effects, sprites, power ups ext...
        this.load.image("double-jump", "double-jump.png"); 

        //load in level 1 tilemap
        this.load.tilemapTiledJSON("mushroom", "./Level-1/mushroom.tmj");
        
        //Zanders past project tile map
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
        this.load.spritesheet("level1-bgSheet", "bg-grasslands.png", {
            frameWidth: 18,
            frameHeight: 18
        }); 
        this.load.spritesheet("doubleJump_sheet", "double-jump.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        
        //load in kennies particles and such
        this.load.setPath("./assets/Particles/");
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
        
        //load in the font
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "/Text/KennyRocketSquare_0.png", "/Text/KennyRocketSquare.fnt");

        //load in audio
        this.load.audio("coin", "Audio/impactBell_heavy_000.ogg");

        
    }

    create() {
        //loading in the frong idle annimation
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'frog-base', frame: 'idle' }],
            repeat: -1
        });

        //load in the frog jump annimation
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'frog-base', frame: 'jump' }]
        });

        //load in the mid jump annimation to make it look more fluid
        this.anims.create({
            key: 'midJump',
            frames: [{ key: 'frog-base', frame: 'midJump' }]
        });

        //make a hop animation by putting everything together
        this.anims.create({
            key: 'hop',
            frames: [
                { key: 'frog-base', frame: 'idle' },
                { key: 'frog-base', frame: 'jump' },
                { key: 'frog-base', frame: 'midJump' },
                { key: 'frog-base', frame: 'idle' }
            ],
            frameRate: 10,
            repeat: -1
        });

         // ...and pass to the next Scene
         this.scene.start("title");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}