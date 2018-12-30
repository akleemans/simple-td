import Sprite = Phaser.GameObjects.Sprite;
import {Enemy} from "../objects/Enemy";
import Group = Phaser.Physics.Arcade.Group;

export class Level1Scene extends Phaser.Scene {
    private gridSize = 32;
    private gridX = 18 * this.gridSize;
    private gridY = 12 * this.gridSize;
    private grid = [
        'XXXXXXXXXXXXXXXXXX',
        'XX...........XXXXX',
        'XX...............X',
        'XX..PPPPPPP......X',
        'XX..P.....P..PPPPZ',
        'X...P.....P..P...X',
        'X...P..PPPP..P...X',
        'X...P..P.....P..XX',
        'XPPPP..P.....P..XX',
        'X......PPPPPPP..XX',
        'X...............XX',
        'XXXXXXXXXXXXXXXXXX'
    ];

    // HUD
    private health = 10;
    private money = 20;
    private wave = 0;
    private healthText: Phaser.GameObjects.Text;
    private moneyText: Phaser.GameObjects.Text;
    private waveText: Phaser.GameObjects.Text;

    private activeTower = null;

    // sprites
    private towerGroup: Group;
    private enemyGroup: Group;
    private bulletGroup: Group;

    constructor() {
        super({
            key: "Level1Scene"
        });
    }

    preload(): void {
    }

    create(): void {
        // draw level background
        let background = this.add.image(this.gridX / 2, this.gridY / 2, 'level1');

        // init health, money
        this.add.image(340, 25, 'health');
        this.healthText = this.add.text(340, 16, this.health.toString(), {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#333'
        });
        this.add.image(240, 25, 'money');
        this.moneyText = this.add.text(240, 16, this.money.toString(), {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#333'
        });
        this.add.image(60, 25, 'wave');
        this.waveText = this.add.text(40, 16, 'W ' + this.wave, {fontFamily: 'Arial', fontSize: 16, color: '#333'});

        this.towerGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.bulletGroup = this.physics.add.group();

        let buttonTower1 = this.add.sprite(this.gridX - 70, this.gridY - 25, 'button-tower1');
        buttonTower1.setInteractive();
        let buttonTower2 = this.add.sprite(this.gridX - 25, this.gridY - 25, 'button-tower2');
        buttonTower2.setInteractive();

        buttonTower1.on('pointerdown', (pointer) => {
            buttonTower2.setFrame(0);
            if (this.activeTower !== 'tower1') {
                this.activeTower = 'tower1';
                buttonTower1.setFrame(1);
            } else {
                this.activeTower = null;
                buttonTower1.setFrame(0);
            }
        });

        buttonTower2.on('pointerdown', (pointer) => {
            buttonTower1.setFrame(0);
            if (this.activeTower !== 'tower2') {
                this.activeTower = 'tower2';
                buttonTower2.setFrame(1);
            } else {
                this.activeTower = null;
                buttonTower2.setFrame(0);
            }
        });

        // tower placing
        this.input.on('pointerdown', (pointer) => {
            if (this.activeTower == null) {
                console.log('Cant place tower, no tower selected!');
            } else if (!this.inGridBoundaries(pointer.x, pointer.y)) {
                console.log('Cant place tower, not in boundaries!');
            } else {
                console.log('Placing tower!');
                this.placeTower(pointer.x, pointer.y, this.activeTower);
            }
        }, this);


        // enemy
        let enemy = new Enemy(this, -50, this.gridSize * 8.5, 0.5, 30, 5);
        this.enemyGroup.add(enemy);

        // collision detection
        this.physics.add.collider(this.bulletGroup, this.enemyGroup, this.hitEnemy);
    }

    update(time, delta): void {
        // move
        this.enemyGroup.getChildren().forEach((enemy: Enemy) => {
            enemy.move();
        });
        this.moveBullets();

        // fire bullets automation
        this.towerGroup.getChildren().forEach((tower) => {
            this.enemyGroup.getChildren().forEach((enemy) => {
                if (Level1Scene.inRange(tower, enemy) && tower.getData('lastFired') + 1000 < time) {
                    this.fireBullet(tower, enemy);
                    tower.setData('lastFired', time);
                }
            });
        });

        // update HUD
        this.moneyText.setText(this.money.toString());
        this.healthText.setText(this.health.toString());
        this.waveText.setText('W ' + this.wave);
    }

    placeTower(x, y, type) {
        let coordX = (x - (x % this.gridSize)) / this.gridSize;
        let coordY = (y - (y % this.gridSize)) / this.gridSize;

        let towerCost = {
            tower1: 10,
            tower2: 20
        };

        if (this.grid[coordY][coordX] === '.' && this.money >= towerCost[type]) {
            x = coordX * this.gridSize + this.gridSize / 2;
            y = coordY * this.gridSize + this.gridSize / 2;
            let newTower = this.add.sprite(x, y, type);
            newTower.setData('lastFired', 0);
            this.towerGroup.add(newTower);
            this.setTowerInGrid(coordX, coordY);
            this.money -= towerCost[type];
            console.log('Placed tower!');
        } else {
            console.log('Invalid position.');
        }
    }

    private setTowerInGrid(x, y) {
        let s = this.grid[y];
        this.grid[y] = s.substr(0, x) + 'T' + s.substr(x + 1);
    }

    private static inRange(tower, enemy) {
        let distance = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
        return distance <= 50;
    }

    fireBullet(tower, enemy) {
        let bullet = this.physics.add.sprite(tower.x, tower.y, 'bullet');
        bullet.setData({destX: enemy.x, destY: enemy.y, damage: 10}, null);
        this.bulletGroup.add(bullet);
    }

    inGridBoundaries(x, y) {
        return x > this.gridSize && x < (this.gridX - this.gridSize) && y > this.gridSize && y < (this.gridY - this.gridSize);
    }

    private moveBullets() {
        let baseSpeed = 2;
        this.bulletGroup.getChildren().forEach((bullet: Sprite) => {
            let diffX = Math.abs(bullet.getData('destX') - bullet.x);
            let diffY = Math.abs(bullet.getData('destY') - bullet.y);
            let signX = bullet.getData('destX') - bullet.x < 0 ? -1 : 1;
            let signY = bullet.getData('destY') - bullet.y < 0 ? -1 : 1;

            bullet.x += signX * baseSpeed * diffX / (diffX + diffY);
            bullet.y += signY * baseSpeed * diffY / (diffX + diffY);

            if (diffX < 5) {
                bullet.destroy();
            }
        });
    }

    private hitEnemy(bullet, enemy) {
        enemy.damage(bullet.getData('damage'));

        if (enemy.health <= 0) {
            this.money += enemy.reward;
            enemy.destroy();
        }

        bullet.destroy();
    }
}
