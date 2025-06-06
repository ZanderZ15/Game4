// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    fps: { forceSetTimeOut: true, target: 60 },
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: 1520,
    height: 670,
    scene: [Load, Title, Select, Level1_Outside, Volcano, Mountain, Mushroom, End],

    plugins: {
        scene: [
            {
                key: 'AnimatedTiles',
                plugin: window.AnimatedTiles, // must match how it's loaded
                mapping: 'animatedTiles'
            }
        ]
    }
    
}
var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};
var score = 0;
const game = new Phaser.Game(config);