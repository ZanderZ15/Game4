class Mushroom extends Phaser.Scene {
    constructor() {
        super("mushroomlevel")
    }
   
    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = config.width / 720;
        this.coinsCollected = 0;
    }

    create() 
    {
        //Load in sounds
        this.coinSound = this.sound.add("coinBoing");

        //load in background music to be changedddd
        /*
        if(!this.sound.get("background"))
        {
            this.backGroundMusic = this.sound.add("background", {loop: true, volume: 0.5});
            this.backGroundMusic.play();
        }
        */

        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("mushroom", 18, 18, 90, 20);
       

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap-base", "tiles");
        this.tilesetBG = this.map.addTilesetImage("bg-grasslands", "level-1-bg");
        this.doubleJump = this.map.addTilesetImage("double-jump", "double-jump");
        

        // Create a the tilemap layers
        this.bg = this.map.createLayer("background", this.tilesetBG, 0, 0);
        this.mush = this.map.createLayer("mushrooms", this.tileset, 0, 0);
        this.groundLayer = this.map.createLayer("platforms", this.tileset, 0, 0); 
        this.decor = this.map.createLayer("decoration", this.tileset, 0, 0);
        

        this.animatedTiles.init(this.map);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collision: true,
        });

         this.mush.setCollisionByProperty({
            collision: true
        });

        //Add all my annimations
        this.anims.create({
            key: 'coin-spin',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', {
                start: 151,  // starting frame of coin animation
                end: 152     // ending frame (adjust based on tileset animation)
            }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'flag-wave',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', {
                start: 112,
                end: 111
            }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'water-move',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', {
                start: 33,
                end: 53
            }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'bounce-powerUp',
            frames: this.anims.generateFrameNumbers('doubleJump_sheet', {
                start: 0,
                end: 1
            }),
            frameRate: 6,
            repeat: -1
        });

        //create all the objects and have there annimations play
        this.coins = this.map.createFromObjects("coins", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
        
        this.coins.forEach(coin => {
            coin.anims.play('coin-spin');  // play animation for coins
        });

        this.theStart = this.map.createFromObjects("start-end", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 112
        });

        this.theStart.forEach(flag => {
            flag.anims.play('flag-wave');
        });

        this.waters = this.map.createFromObjects("death", {
            name: "water",
            key: "tilemap_sheet",
            frame: 33
        });

        this.waters.forEach(water => {
            water.anims.play('water-move'); 
        })

        this.theStart = this.map.createFromObjects("start-end", {
            name: "start",
            key: "tilemap_sheet",
            frame: 131
        });

        this.endFlags = this.map.createFromObjects("start-end", {
            name: "end",
            key: "tilemap_sheet",
            frame: 131
        });

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.endFlags, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.waters, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        this.endGroup = this.add.group(this.endFlags);
        this.waterGroup = this.add.group(this.waters); 

        // set up player avatar have them spawn at the start 
        this.spawnPoint = this.map.findObject("start-end", obj => obj.name === "start");
        my.sprite.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, "frog", "idle");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.mush);

        //need to change this to whatever partticle effect we will have for our coin collection
        my.vfx.coinParticles = this.add.particles(0, 0, "star",
            {
                scale: {start: 5, end: 0.1},
                lifespan: 350,
                gravityY: -400,
                alpha: {start: 1, end: 0.1},
            }
        );
        my.vfx.coinParticles.stop();

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => { 
            obj2.destroy(); // remove coin on overlap
            my.vfx.coinParticles.explode(12, obj2.x, obj2.y);
            this.coinSound.play();
            
        });

        //collison detection with end flag
        if(this.physics.add.overlap(my.sprite.player, this.endGroup, () =>
            {
                /*
                if(this.sound.get("background"))
                {
                    this.backGroundMusic.destroy();
                }
                */
                this.scene.stop("mushroomlevel");
                this.scene.start("mountain");
            }
        ));
       
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

        //RESET DEBUG
        this.physics.world.drawDebug = false;
        this.physics.world.debugGraphic.clear();

       // movement vfx here
        my.vfx.walking = this.add.particles(0, -5, 'runVFX', {
            lifespan: 350,
            gravityY: -400,
            alpha: { start: 1, end: 0.1 },
            scale: { start: 1.2, end: 0.1 },
            speedX: { min: -20, max: 20 },
            speedY: { min: 10, max: 40 },
            maxAliveParticles: 5,
            frequency: 100
        });
        my.vfx.walking.stop();  

        my.vfx.jump = this.add.particles(0, -10, 'whoosh', 
            {
                lifespan: 350,
                gravityY: -400,
                alpha: { start: 1, end: 0.1 },
                scale: { start: 1.5, end: 0.1 },
                speedX: { min: -20, max: 20 },
                speedY: { min: 10, max: 40 },
                maxAliveParticles: 1,
                frequency: 100
            }
        );
        my.vfx.jump.stop(); 

        
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        //camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        /*this.events.on('postupdate', () => {
            const cam = this.cameras.main;
            //cam.scrollY = Math.round(cam.scrollY / 2) * 2;
        });*/
       
        console.log(this.map.widthInPixels/2 * this.SCALE - this.map.widthInPixels/2 + 10);
        console.log(this.map.widthInPixels/2 * this.SCALE);
        console.log(this.SCALE);
        console.log(this.map.widthInPixels/2);
        console.log(window.innerWidth);
        console.log(config.width);

        console.log("L");
        console.log(this.map.widthInPixels / (window.innerWidth - 50) * (window.innerHeight - 20));

        let aspectRatio = (this.map.heightInPixels * SCALE / 4) / (this.map.widthInPixels * SCALE);

        this.timerText = this.add.text(
            (this.map.widthInPixels/2 * this.SCALE - this.map.widthInPixels/2)/*Align to left edge*/ + 15, 
            (this.map.heightInPixels/8 * this.SCALE - this.map.heightInPixels/8)/*Align to top edge*/ + 5,
            'Time: 0.00', 
            {
                fontSize: '25px',
                fill: '#ffffff',
                fontFamily: 'monospace'
            }
        );
        this.timerText.setOrigin(0, 0);
        this.timerText.setScrollFactor(0);
        this.timerText.setDepth(1);

        this.timerBG = this.add.rectangle(
            (this.map.widthInPixels/2 * this.SCALE - this.map.widthInPixels/2), 
            (this.map.heightInPixels/8 * this.SCALE - this.map.heightInPixels/8),
            this.timerText.width + 30,         // add padding
            this.timerText.height + 10,
            0x000000               // black color in hex
        ).setOrigin(0, 0).setDepth(0).setScrollFactor(0);  // behind text
       
        
    }

    update() {
        
    }
}
