class Mushroom extends Phaser.Scene {
    constructor() {
        super("mushroomlevel")
    }
   
    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = config.width / 720;
        this.coinsCollected = 0;
        this.amountOfCoins = 30; 
        this.jumps = false;
        this.powerUp = false; 
        this.maxvx = 300;
        this.maxvy = 1000;
    }

    create() 
    {
        //Load in sounds
        this.coinSound = this.sound.add("coinBoing", {volume: 0.3});
        this.powerUpSound = this.sound.add("powerUpAudio", {volume: 0.2}); 

        //load in background music
    
        if(!this.sound.get("backgroundMush"))
        {
            this.backGroundMusic = this.sound.add("backgroundMush", {loop: true, volume: 0.2});
            this.backGroundMusic.play();
        }
        
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 90 tiles wide and 20 tiles tall.
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
            collision: true
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
            frames: [
                { key: 'tilemap_sheet', frame: 33 },
                { key: 'tilemap_sheet', frame: 53 }
            ],
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
        });

        this.powerUps = this.map.createFromObjects("powerUp", {
            name: "doublejump",
            key: "doubleJump_sheet",
            frame: 0
        });

        this.powerUps.forEach(doublejump => {
            doublejump.anims.play('bounce-powerUp')
        });

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
        this.physics.world.enable(this.powerUps, Phaser.Physics.Arcade.STATIC_BODY);


        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        this.endGroup = this.add.group(this.endFlags);
        this.waterGroup = this.add.group(this.waters); 
        this.powerUpGroup = this.add.group(this.powerUps); 

        // set up player avatar have them spawn at the start 
        this.spawnPoint = this.map.findObject("start-end", obj => obj.name === "start");
        my.sprite.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y-10, "frog", "idle");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setSize(18, 18).setOffset(1,1);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.mush);

        //Coin VFX
        my.vfx.coinParticles = this.add.particles(0, 0, "star",
            {
                scale: {start: 5, end: 0.1},
                lifespan: 350,
                gravityY: -400,
                alpha: {start: 1, end: 0.1},
            }
        );
        my.vfx.coinParticles.stop();


        // Handle collision detection with coins, water, and the powerUp
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => { 
            obj2.destroy(); // remove coin on overlap
            this.coinsCollected += 1; 
            my.text.score.setText('Coins Collected: ' + this.coinsCollected + '/' + this.amountOfCoins);
            my.vfx.coinParticles.explode(12, obj2.x, obj2.y);
            this.coinSound.play();
            
        });

        this.physics.add.overlap(my.sprite.player, this.waterGroup, (obj1, obj2) => {
            my.sprite.player.body.setVelocityX(0);
            my.sprite.player.body.setVelocityY(0);
            obj1.x = this.spawnPoint.x; 
            obj1.y = this.spawnPoint.y - 10;
        });

        //TODO: make a collision handle for when you pick up the power up activate double jump
        this.physics.add.overlap(my.sprite.player, this.powerUpGroup, (obj1, obj2) => { 
            obj2.destroy(); // remove powerUP on overlap
            this.powerUp = true; 
            this.powerUpSound.play(); 
            
        });

        //collison detection with end flag
        if(this.physics.add.overlap(my.sprite.player, this.endGroup, () =>
            {
                //need to add an if statement for if the coins collected == the amount of coins, which i can do rn!
                if(this.coinsCollected == this.amountOfCoins)
                {
                    
                    if(this.sound.get("backgroundMush"))
                    {
                        this.backGroundMusic.destroy();
                    }
                    this.scene.stop("mushroomlevel");
                    this.scene.start("mountain");
                }
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
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", 
        {
            frame: ['flame_05.png', 'flame_06.png'],
            random: false, //Ranodmizes sprites shown
            scale: {start: 0.03, end: 0.2},
            maxAliveParticles: 10, //Limits total particles
            lifespan: 200,
            gravityY: -500, //Makes float up
            alpha: {start: 1, end: 0.1}, 
            frequency: 100
        });
        my.vfx.walking.stop();

        //Add a jump VFX
        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['slash_02.png'],
            random: false, //Ranodmizes sprites shown
            scale: {start: 0.06, end: 0.12},
            rotaion: 0,
            scaleX: .25,
            scaleY: .5,
            maxAliveParticles: 1, //Limits total particles
            lifespan: 500,
            duration: 500,
            gravityY: 0, //Makes float up
            alpha: {start: 1, end: 0.2}, 
            repeat:0
        });

        //camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        //update on screan text to update when coins collected
        my.text.score = this.add.text(355, 180, 'Coins Collected: ' + this.coinsCollected + '/' + this.amountOfCoins, {
            font: '16px Arial',
            fill: '#000000',
            resolution: 10
        });
        my.text.score.setScrollFactor(0);
       
        
    }

    update() {
        //yay movement
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('hop', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('hop', true);
            // particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, true);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            if (my.sprite.player.body.blocked.down) 
            {
                my.sprite.player.anims.play('idle');
            }
            // vfx stop playing
            my.vfx.walking.stop();
        }

    
        
        // Cap the velocity
        let currentvx = my.sprite.player.body.velocity.x;
        if (currentvx > this.maxvx) {
            my.sprite.player.setVelocityX(this.maxvx);
        } 
        else if (currentvx < -this.maxvx) {
            my.sprite.player.setVelocityX(-this.maxvx);
        }
        let currentvy = my.sprite.player.body.velocity.y;
        
        if (currentvy > 1000) {
            my.sprite.player.setVelocityY(this.maxvy);
        } 
        else if (currentvy < -this.maxvy) {
            my.sprite.player.setVelocityY(-this.maxvy);
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down) {
            this.jumps = true;
            if(Phaser.Input.Keyboard.JustDown(cursors.up)) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                my.sprite.player.anims.play('jump');
                my.vfx.jumping.explode(10, my.sprite.player.x, my.sprite.player.y + my.sprite.player.height / 2);
            }
        } else {
            //my.sprite.player.anims.play('jump');
            if(Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumps == true && this.powerUp == true) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.jumps = false;
                my.vfx.jumping.explode(10, my.sprite.player.x, my.sprite.player.y + my.sprite.player.height / 2); 
            }
        }
       
        //funny reset to make it easy for me to test
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

    }
}
