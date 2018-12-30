/// <reference path="./phaser.d.ts"/>

import "phaser";
import {MainScene} from "./scenes/main.scene";
import {AboutScene} from "./scenes/about.scene";
import {Level1Scene} from "./scenes/level1.scene";

// main game configuration
const config: GameConfig = {
    width: 576,
    height: 384,
    type: Phaser.AUTO, // CANVAS | WEBGL
    // pixelArt: true,
    backgroundColor: '#fff',
    parent: "game",

    scene: [
        MainScene,
        AboutScene,
        Level1Scene
    ],
    physics: {
        default: "arcade",
        arcade: {
            // gravity: {y: 200}
        }
    }
};

// game class
export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.onload = () => {
    let game = new Game(config);
};
