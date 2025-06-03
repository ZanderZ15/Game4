class Mountain extends Phaser.Scene {
    constructor() {
        super("mountain");
    }
    preload() {
        this.load.tilemapTiledJSON("platformer-level-1", "assets/Mountain/platformer-level-1.tmj");
        this.load.image("tilemap_tiles", "assets/Mountain/tilemap_packed.png");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.MAX_VELOCITY = 300;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = config.width / 720;
        this.onLadderNow = false;

        this.ACCELERATION = 400;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.elaspedTime = 0;
        this.timerActive = false;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 144 tiles wide and 25 tiles tall.
        
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 144, 25);

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
        this.shipLayer = this.map.createLayer("Ship", this.tileset, 0, 0);
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
        this.shipLayer.setCollisionByProperty({ isShip: true });

        // Start invisible and not collidable
        this.bluePlatformLayer.setVisible(false);
        this.bluePlatformLayer.setCollisionByProperty({ bluePlatform: false });

        

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");
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

        this.sprite.crate = this.physics.add.sprite(265, 170, "platformer_characters", "tile_0011.png");
        this.sprite.crate.setImmovable(false);         // Allow it to be pushed
        this.sprite.crate.setCollideWorldBounds(true); // Stop it from falling off-screen
        this.sprite.crate.body.setBounce(0);           // No bounce
        this.sprite.crate.body.setFriction(20, 20); 
        this.sprite.crate.body.setDrag(400, 400);         // Horizontal drag
        this.sprite.crate.body.setMass(2);

        this.physics.add.collider(my.sprite.player, this.sprite.crate, (player, crate) => {
            if (!player.body.blocked.down) {
                crate.setVelocityX(0); // prevent midair pushing
            }
        });

        this.physics.add.collider(my.sprite.player, this.sprite.crate);
        this.physics.add.collider(this.sprite.crate, this.groundLayer);
        

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

    collectShip(player, tile) {
        this.shipLayer.removeTileAt(tile.x, tile.y);
        // Optional: play sound, increment score, animate, etc.
        this.shipPieces += 1;
        console.log("ship piece collected");
        if (this.shipPieces >= 3) {
            this.scene.start('EndScene'); // Switch to EndScene
        }
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

        let shipTile = this.shipLayer.getTileAtWorldXY(
            my.sprite.player.x,
            my.sprite.player.y,
            true
        );

        if (shipTile && shipTile.properties.isShip) {
            this.collectShip(my.sprite.player, shipTile);
        }


        let playerBottom = my.sprite.player.body.y + my.sprite.player.body.height;
        let boxBottom = this.sprite.crate.body.y + this.sprite.crate.body.height;

        let playerTile = this.buttonLayer.getTileAtWorldXY(
            my.sprite.player.x,
            playerBottom - 1,
            true
        );

        let boxTile = this.buttonLayer.getTileAtWorldXY(
            this.sprite.crate.x,
            boxBottom - 1,
            true
        );

        let isButtonPressed = false;

        // If either object is on a button, set to true
        if ((playerTile && playerTile.properties.isButton) || 
            (boxTile && boxTile.properties.isButton)) {
            isButtonPressed = true;
        }

        if (isButtonPressed) {
            this.bluePlatformLayer.setVisible(true);
            this.bluePlatformLayer.setCollisionByProperty({ bluePlatform: true });

            // Add collider once
            if (!this.bluePlatformCollider) {
                this.bluePlatformCollider = this.physics.add.collider(my.sprite.player, this.bluePlatformLayer);
            }
        } else {
            this.bluePlatformLayer.setVisible(false);
            this.bluePlatformLayer.setCollisionByProperty({ bluePlatform: false });

            // Optionally remove collider (optional for performance)
            if (this.bluePlatformCollider) {
                this.physics.world.removeCollider(this.bluePlatformCollider);
                this.bluePlatformCollider = null;
            }
        }



        //if player falls into void
        if (my.sprite.player.y > 600) { // Adjust 600 depending on how deep the void is
            my.sprite.player.setVelocity(0, 0);
            my.sprite.player.setAcceleration(0, 0);  
            my.sprite.player.setPosition(30, 200);
            this.playerHealth -= 1;
            if (this.playerHealth <= 0) {
                this.scene.start('EndScene');
            }
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

            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

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

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

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
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}