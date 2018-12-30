import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import Image = Phaser.GameObjects.Image;

export class Enemy extends Sprite {
    private currentScene: Phaser.Scene;
    health: number;
    maxHealth: number;
    speed: number;
    reward: number;

    healthBarSize: number = 20;
    backgroundBar: Image;
    healthBar: Image;

    constructor(scene: Scene, x: number, y: number, speed: number, health: number, reward: number) {
        super(scene, x, y, 'enemy1');
        this.currentScene = scene;
        this.health = health;
        this.maxHealth = health;
        this.speed = speed;
        this.reward = reward;
        this.currentScene.add.existing(this);
        this.prepareAnimations();

        // health bar
        this.backgroundBar = this.currentScene.add.image(x - 10, y - 16, 'healthbar-red').setOrigin(0, 0.5);
        this.backgroundBar.displayWidth = this.calculateHealthBarSize();

        this.healthBar = this.currentScene.add.image(x - 10, y - 16, 'healthbar-green').setOrigin(0, 0.5);
        this.healthBar.displayWidth = this.calculateHealthBarSize();
    }

    prepareAnimations() {
        this.currentScene.anims.create({
            key: 'enemy1-move',
            frames: this.currentScene.anims.generateFrameNumbers('enemy1', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.play('enemy1-move', true);
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
