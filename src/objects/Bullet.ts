import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import {Enemy} from "./Enemy";

export class Bullet extends Sprite {
    private currentScene: Phaser.Scene;
    damage: number;
    speed: number;
    target: Enemy;

    constructor(scene: Scene, x: number, y: number, speed: number, damage: number, target: Enemy) {
        super(scene, x, y, 'bullet');
        this.currentScene = scene;
        this.speed = speed;
        this.damage = damage;
        this.target = target;
        this.currentScene.add.existing(this);
        this.prepareAnimations();
    }

    prepareAnimations() {
        // no animations for now
    }

    move() {
        let diffX = Math.abs(this.target.x - this.x);
        let diffY = Math.abs(this.target.y - this.y);
        let signX = this.target.x - this.x < 0 ? -1 : 1;
        let signY = this.target.y - this.y < 0 ? -1 : 1;

        this.x += signX * this.speed * diffX / (diffX + diffY);
        this.y += signY * this.speed * diffY / (diffX + diffY);
    }

}
