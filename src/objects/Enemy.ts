import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;
import {Level1Scene} from "../scenes/level1.scene";

export enum EnemyType {
    simple = 'enemy1',
    boss = 'enemy2'
}

export class Enemy extends Sprite {
    private currentScene: Level1Scene;
    health: number;
    maxHealth: number;
    speed: number;
    reward: number;
    pathSegment: number;

    healthBarSize: number = 20;
    backgroundBar: Image;
    healthBar: Image;

    constructor(scene: Level1Scene, x: number, y: number, type: EnemyType) {
        super(scene, x, y, type);
        // super.setOrigin(0.5, 0.5);

        if (type === EnemyType.simple) {
            this.speed = 0.5;
            this.health = 50;
            this.maxHealth = 50;
            this.reward = 3;
        } else if (type === EnemyType.boss) {
            this.speed = 0.3;
            this.health = 300;
            this.maxHealth = 300;
            this.reward = 20;
        }

        this.pathSegment = 0;
        this.currentScene = scene;
        this.currentScene.add.existing(this);
        this.anims.play(type + '-move', true);

        // health bar
        this.backgroundBar = this.currentScene.add.image(x - 10, y - 16, 'healthbar-red').setOrigin(0, 0.5);
        this.backgroundBar.displayWidth = this.calculateHealthBarSize();

        this.healthBar = this.currentScene.add.image(x - 10, y - 16, 'healthbar-green').setOrigin(0, 0.5);
        this.healthBar.displayWidth = this.calculateHealthBarSize();
    }

    calculateHealthBarSize() {
        return this.health / this.maxHealth * this.healthBarSize;
    }

    move() {
        let direction = this.currentScene.getPathDirection(this);
        this.x += this.speed * direction[0];
        this.y += this.speed * direction[1];
        this.backgroundBar.x += this.speed * direction[0];
        this.backgroundBar.y += this.speed * direction[1];
        this.healthBar.x += this.speed * direction[0];
        this.healthBar.y += this.speed * direction[1];
    }

    damage(amount: number) {
        this.health -= amount;
        this.healthBar.displayWidth = this.calculateHealthBarSize();
    }

    destroy() {
        this.healthBar.destroy();
        this.backgroundBar.destroy();
        super.destroy();
    }

}
