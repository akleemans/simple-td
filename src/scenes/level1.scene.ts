import {Enemy, EnemyType} from "../objects/Enemy";
import Group = Phaser.Physics.Arcade.Group;
import {Bullet} from "../objects/Bullet";
import {Util} from "../util";

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
        'X..............XXX',
        'XXXXXXXXXXXXXXXXXX'
    ];

    private waves = [
        'A',
        'A---A',
        'A---A---A',
        'A---A---A---A',
        'A--A--A--A--A--A',
        'B',
        'A--B--A',
        'A--A--A--B--A--A--A',
        'B-------B',
        'A--A--A--B--A--A--A--B'
    ];

    private enemyMap = {
        'A': EnemyType.simple,
        'B': EnemyType.boss
    };

    private waveRunning: boolean = false;
    private waveTick: number = 0;
    private tickLength: number = 20;

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
        this.add.image(this.gridX / 2, this.gridY / 2, 'level1');

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
                Util.log('Cant place tower, no tower selected!');
            } else if (!this.inGridBoundaries(pointer.x, pointer.y)) {
                Util.log('Cant place tower, not in boundaries!');
            } else {
                Util.log('Placing tower!');
                this.placeTower(pointer.x, pointer.y, this.activeTower);

            }
        }, this);

        this.prepareAnimations();

        this.triggerNextWave();

        // collision detection
        this.physics.add.collider(this.bulletGroup, this.enemyGroup, this.hitEnemy, null, this);
    }

    update(time, delta): void {
        // release enemies if wave running
        if (this.waveRunning) {
            this.releaseEnemy();
        }
        // move enemies & bullets
        this.enemyGroup.getChildren().forEach((enemy: Enemy) => {
            enemy.move();
        });
        this.bulletGroup.getChildren().forEach((bullet: Bullet) => {
            bullet.move();
        });

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
        } else {
            Util.log('Invalid position.');
        }
    }

    prepareAnimations() {
        this.anims.create({
            key: 'enemy1-move',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy2-move',
            frames: this.anims.generateFrameNumbers('enemy2', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });

    }

    setTowerInGrid(x, y) {
        let s = this.grid[y];
        this.grid[y] = s.substr(0, x) + 'T' + s.substr(x + 1);
    }

    static inRange(tower, enemy) {
        let distance = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
        return distance <= 50;
    }

    fireBullet(tower, enemy) {
        let bullet = new Bullet(this, tower.x, tower.y, 2, 10, enemy);
        this.bulletGroup.add(bullet);
    }

    inGridBoundaries(x, y) {
        return x > this.gridSize && x < (this.gridX - this.gridSize) && y > this.gridSize && y < (this.gridY - this.gridSize);
    }

    hitEnemy(bullet, enemy) {
        enemy.damage(bullet.damage);

        if (enemy.health <= 0) {
            Util.log('Killing enemy ' + enemy.id);
            this.money += enemy.reward;
            enemy.destroy();

            if (this.enemyGroup.getChildren().length === 0 && this.waveRunning === false) {
                this.triggerNextWave();
            }
        }

        bullet.destroy();
    }

    triggerNextWave() {
        this.wave += 1;
        Util.log('Triggering next wave:' + this.wave);
        this.waveTick = 0;
        this.waveRunning = true;

        if (this.wave === this.waves.length) {
            this.finish();
        }
    }

    releaseEnemy() {
        this.waveTick += 1;
        if (this.waveTick % this.tickLength === 0) {
            const waveString = this.waves[this.wave - 1];
            const enemyChar = waveString[(this.waveTick / this.tickLength) - 1];

            if (enemyChar === '-') {
                return;
            }
            const enemyType = this.enemyMap[enemyChar];

            // create enemy
            Util.log('Releasing enemy:' + enemyType);
            let enemy = new Enemy(this, -50, this.gridSize * 8.5, enemyType);
            this.enemyGroup.add(enemy);

            // if last char in waveString
            if (this.waveTick / this.tickLength >= waveString.length) {
                this.waveRunning = false;
            }
        }
    }

    finish() {
        Util.log('finish!');
    }
}
