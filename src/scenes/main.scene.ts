import {Level1Scene} from "./level1.scene";

export class MainScene extends Phaser.Scene {

    constructor() {
        super({
            key: "MainScene"
        });
    }

    preload(): void {
        this.load.image('intro', 'assets/img/intro.png');
        this.load.image('health', 'assets/img/health.png');
        this.load.image('money', 'assets/img/money.png');
        this.load.image('wave', 'assets/img/wave.png');

        this.load.image('level1', 'assets/img/level1.png');
        this.load.image('tower1', 'assets/img/tower1.png');
        this.load.image('tower2', 'assets/img/tower2.png');
        this.load.image('bullet', 'assets/img/bullet.png');

        this.load.spritesheet('enemy1', 'assets/img/enemy1.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('enemy2', 'assets/img/enemy2.png', {frameWidth: 32, frameHeight: 32});
        this.load.image('healthbar-green', 'assets/img/healthbar-green.png');
        this.load.image('healthbar-red', 'assets/img/healthbar-red.png');

        this.load.spritesheet('button-tower1', 'assets/img/button-tower1.png', {frameWidth: 46, frameHeight: 46});
        this.load.spritesheet('button-tower2', 'assets/img/button-tower2.png', {frameWidth: 46, frameHeight: 46});

        this.load.image('button-start', 'assets/img/button-start.png');
        this.load.image('button-about', 'assets/img/button-about.png');
    }

    create(): void {
        this.add.sprite(300, 100, 'intro');

        let buttonStart = this.add.sprite(300, 250, 'button-start').setInteractive();
        buttonStart.on('pointerdown', () => {
            this.scene.start('Level1Scene');
        });

        let buttonAbout = this.add.sprite(300, 320, 'button-about').setInteractive();
        buttonAbout.on('pointerdown', () => {
            this.scene.start('AboutScene');
        });
    }

    update(time, delta): void {
    }
}
