class Mountain extends Phaser.Scene {
    constructor() {
        super("mountain");
    }
    preload() {
        this.load.tilemapTiledJSON("platformer-level-1", "assets/Mountain/platformer-level-1.tmj");
        this.load.image("tilemap_tiles", "assets/Mountain/tilemap_packed.png");
        this.load.image("frogGlide", "assets/Mountain/frogGlide.png");
        this.load.audio("mountainMusic", "assets/Mountain/Mountain.mp3");
        this.load.image("volcanoBG", "assets/Volcano/images/Background.png");
    }

    init() {
        // variables and settings
        this.MAX_VELOCITY = 400;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = config.width / 720;
        this.onLadderNow = false;

        this.ACCELERATION = 400;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 200;
        this.JUMP_VELOCITY = -150;
        this.PARTICLE_VELOCITY = 50;
        this.elaspedTime = 0;
        this.timerActive = false;
    }

    create() {
        this.sound.add("mountainMusic", {
            loop: true,
            volume: 0.5   // Optional: set volume from 0.0 to 1.0
        }).play();


        this.add.image(0, 500, "volcanoBG").setOrigin(0);

        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 144 tiles wide and 25 tiles tall.
        
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 144, 144);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Create a layer
        // Add background layer (should be drawn first)
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0);
        this.bluePlatformLayer = this.map.createLayer("BluePlatform", this.tileset, 0, 0);

        // Add ladder layer
        this.ladderLayer = this.map.createLayer("Ladder", this.tileset, 0, 0);

        // Add moveable (e.g. pushable blocks, platforms)
        this.moveableLayer = this.map.createLayer("Moveable", this.tileset, 0, 0);

        // Add button layer (e.g. floor switches)
        this.buttonLayer = this.map.createLayer("Button", this.tileset, 0, 0);
        this.flagLayer = this.map.createLayer("Flag", this.tileset, 0, 0);
        this.coinLayer = this.map.createLayer("Coins", this.tileset, 0, 0);

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);




        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.groundLayer.setCollisionByProperty({ collides: true });
        this.bluePlatformLayer.setCollisionByProperty({ bluePlatform: true });
        this.moveableLayer.setCollisionByProperty({ isMoveable: true });
        this.buttonLayer.setCollisionByProperty({ isButton: true });
        this.ladderLayer.setCollisionByProperty({ isLadder: true }); 
        this.coinLayer.setCollisionByProperty({ isCoin: true }); 
        this.flagLayer.setCollisionByProperty({ isFlag: true });

        // Start invisible and not collidable
        this.bluePlatformLayer.setVisible(false);
        this.bluePlatformLayer.setCollisionByProperty({ bluePlatform: false });

        

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 2450, "platformer_characters", "tile_0000.png");
        my.sprite.player.body.setSize(12, 12);
        my.sprite.player.body.setOffset(5, 5);
        // my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.physics.add.overlap(my.sprite.player, this.ladderLayer, this.onLadder, null, this);


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        this.sprite = {};
        

        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        

    }

    collectCoin(player, tile) {
        this.coinLayer.removeTileAt(tile.x, tile.y);
        // Optional: play sound, increment score, animate, etc.
        console.log("coin collected");
        return false; // Return false to stop collision from happening again
    }

    onLadder(player, tile) {
        this.onLadderNow = true;
    }

    update() {

        let tileBelow = this.ladderLayer.getTileAtWorldXY(
            my.sprite.player.x,
            my.sprite.player.y + my.sprite.player.height / 2,
            true
        );
        
        if (tileBelow && tileBelow.properties.isLadder) {
            // Player is on ladder tile
            my.sprite.player.body.setAllowGravity(false);
        
            if (cursors.up.isDown) {
                my.sprite.player.setVelocityY(-100);
            } else if (cursors.down.isDown) {
                my.sprite.player.setVelocityY(100);
            } else {
                my.sprite.player.setVelocityY(0);
            }
        } else {
            my.sprite.player.body.setAllowGravity(true);
        }

        let coinTile = this.coinLayer.getTileAtWorldXY(
            my.sprite.player.x,
            my.sprite.player.y,
            true
        );
        
        if (coinTile && coinTile.properties.isCoin) {
            this.collectCoin(my.sprite.player, coinTile);
        }

        let flagTile = this.flagLayer.getTileAtWorldXY(
            my.sprite.player.x,
            my.sprite.player.y + my.sprite.player.height / 2,
            true
        );
        
        if (flagTile && flagTile.properties.isFlag) {
            this.scene.start("volcano"); // change to your actual volcano scene key
        }


        let playerBottom = my.sprite.player.body.y + my.sprite.player.body.height;

        let playerTile = this.buttonLayer.getTileAtWorldXY(
            my.sprite.player.x,
            playerBottom - 1,
            true
        );

        let isButtonPressed = false;

        // If either object is on a button, set to true
        if (playerTile && playerTile.properties.isButton) {
            isButtonPressed = true;
        }

        if (isButtonPressed) {
            this.bluePlatformLayer.setVisible(true);
            this.bluePlatformLayer.setCollisionByProperty({ bluePlatform: true });

            // Add collider once
            if (!this.bluePlatformCollider) {
                this.bluePlatformCollider = this.physics.add.collider(my.sprite.player, this.bluePlatformLayer);
            }
        }


        //if player falls into void
        if (my.sprite.player.y > 2650) { // Adjust 600 depending on how deep the void is
            my.sprite.player.setVelocity(0, 0);
            my.sprite.player.setAcceleration(0, 0);  
            my.sprite.player.setPosition(30, 2500);
        }


        const TURN_BOOST = 2.5 * this.ACCELERATION; // Boost factor for quick turnarounds

        if (cursors.left.isDown) {
            // Detect if turning from right to left
            if (my.sprite.player.body.velocity.x > 0) {
                // Apply quick turn boost
                my.sprite.player.setAccelerationX(-TURN_BOOST);
            } else if (my.sprite.player.body.velocity.x > -this.MAX_VELOCITY) {
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
            } else {
                my.sprite.player.setAccelerationX(0);
            }
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('hop', true);

            // Particle effect setup
            my.vfx.walking.startFollow(
                my.sprite.player,
                my.sprite.player.displayWidth / 2 - 10,
                my.sprite.player.displayHeight / 2 - 5,
                false
            );
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if (cursors.right.isDown) {
            // Detect if turning from left to right
            if (my.sprite.player.body.velocity.x < 0) {
                // Apply quick turn boost
                my.sprite.player.setAccelerationX(TURN_BOOST);
            } else if (my.sprite.player.body.velocity.x < this.MAX_VELOCITY) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);
            } else {
                my.sprite.player.setAccelerationX(0);
            }

            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('hop', true);

            // Particle effect setup
            my.vfx.walking.startFollow(
                my.sprite.player,
                my.sprite.player.displayWidth / 2 - 10,
                my.sprite.player.displayHeight / 2 - 5,
                false
            );
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            // No directional input — apply drag
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        } else {
            // If airborne, use frogGlide
            if (my.sprite.player.texture.key !== "frogGlide") {
                my.sprite.player.setTexture("frogGlide");
            }
            my.sprite.player.anims.stop(); // stop any running animation
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}