class Volcano extends Phaser.Scene {
    constructor() {
        super("volcano")
    }
    init() {
        this.timer = 0;
        this.ACCELERATION = 400;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -425;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2;
        this.maxvx = 300;
        this.maxvy = 1000;
        this.score = 0;
        this.done = false;
        this.jumps = false;
        this.checkpoint = { //30, 500
            x: 30,
            y: 500
        };
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
        this.spd_tiles = this.map.addTilesetImage("speedboost", "spd_tiles");
        
        this.deathLayer = this.map.createLayer("Death", this.g_tiles, 0, 0);
        this.groundLayer = this.map.createLayer("Ground", this.g_tiles, 0, 0);
        this.pLayer = this.map.createLayer("Passables", this.i_tiles, 0, 0);

        this.animatedTiles.init(this.map);

        
        //Collision Properties
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        /*
        this.platLayer.setCollisionByProperty({
            oneWay: true
        });
        */

        //Player
        my.sprite.player = this.physics.add.sprite(30, 270, "frog-base", "idle");
        my.sprite.player.setCollideWorldBounds(false);
        my.sprite.player.setSize(18, 18).setOffset(1,1);
        
        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        
        //Power Up: Speed Boost
        this.powerup = this.map.createFromObjects("Collectibles", {
            name: "speedboost",
            key: "spd_tiles",
            frame: 0
        });
        this.anims.create({
            key: 'speedboost', // Animation key
            frames: this.anims.generateFrameNumbers('spd_tiles', 
                {start: 0, end: 1}
            ),
            frameRate: 1,  // Higher is faster
            repeat: -1      // Loop the animation indefinitely
        });
        this.physics.world.enable(this.powerup, Phaser.Physics.Arcade.STATIC_BODY);
        this.powerupGroup = this.add.group(this.powerup);
        
        //Death Clouds
        this.clouds = this.map.createFromObjects("Death Cloud", {
            name: "cloud",
            key: "I1",
            frame: 42
        });
        this.physics.world.enable(this.clouds, Phaser.Physics.Arcade.STATIC_BODY);
        this.cloudGroup = this.add.group(this.clouds);

        
        // Camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
    }   
    update() {
        for (let cloud of this.cloudGroup.getChildren()) {
            cloud.x += 1;
        }
    }
}