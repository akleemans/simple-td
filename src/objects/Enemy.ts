import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import Image = Phaser.GameObjects.Image;

export enum EnemyType {
    simple = 'enemy1',
    boss = 'enemy2'
}

export class Enemy extends Sprite {
    private currentScene: Phaser.Scene;
    health: number;
    maxHealth: number;
    speed: number;
    reward: number;

    healthBarSize: number = 20;
    backgroundBar: Image;
    healthBar: Image;

    constructor(scene: Scene, x: number, y: number, type: EnemyType) {
        super(scene, x, y, type);

        if (type === EnemyType.simple) {
            this.speed = 0.5;
            this.health = 50;
            this.maxHealth = 50;
            this.reward = 3;
        } else if (type === EnemyType.boss) {
            this.speed = 0.2;
            this.health = 300;
            this.maxHealth = 300;
            this.reward = 20;
        }

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
        this.x += this.speed;
        this.backgroundBar.x += this.speed;
        this.healthBar.x += this.speed;

        // TODO replace
        if (this.x > 650) {
            this.x = -50;
        }
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
