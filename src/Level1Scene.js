var Level1Scene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function MainMenuScene() {
      Phaser.Scene.call(this, {key: 'Level1Scene'});
    },

  preload: function () {
  },

  create: function () {
    var that = this;
    this.gridSize = 32;
    this.gridX = 18 * this.gridSize;
    this.gridY = 12 * this.gridSize; // 576x384

    this.grid = [
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

    // draw level background
    this.background = this.add.image(this.gridX / 2, this.gridY / 2, 'level1');

    // init health, money
    this.health = 10;
    this.add.image(340, 25, 'health');
    this.healthText = this.add.text(340, 16, this.health, {fontFamily: 'Arial', fontSize: 16, color: '#333'});

    this.money = 20;
    this.add.image(240, 25, 'money');
    this.moneyText = this.add.text(240, 16, this.money, {fontFamily: 'Arial', fontSize: 16, color: '#333'});

    this.wave = 1;
    this.add.image(60, 25, 'wave');
    this.waveText = this.add.text(40, 16, 'W ' + this.wave, {fontFamily: 'Arial', fontSize: 16, color: '#333'});

    // prepare tower, UI
    this.activeTower = null;

    this.towerGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
    this.bulletGroup = this.physics.add.group();

    var buttonTower1 = this.add.sprite(this.gridX - 70, this.gridY - 25, 'button-tower1').setInteractive();
    var buttonTower2 = this.add.sprite(this.gridX - 25, this.gridY - 25, 'button-tower2').setInteractive();

    buttonTower1.on('pointerdown', function (pointer) {
      buttonTower2.setFrame(0);
      if (that.activeTower !== 'tower1') {
        that.activeTower = 'tower1';
        buttonTower1.setFrame(1);
      } else {
        that.activeTower = null;
        buttonTower1.setFrame(0);
      }
    });

    buttonTower2.on('pointerdown', function (pointer) {
      buttonTower1.setFrame(0);
      if (that.activeTower !== 'tower2') {
        that.activeTower = 'tower2';
        buttonTower2.setFrame(1);
      } else {
        that.activeTower = null;
        buttonTower2.setFrame(0);
      }
    });

    // tower placing
    this.input.on('pointerdown', function (pointer) {
      if (that.activeTower == null) {
        console.log('Cant place tower, no tower selected!');
      } else if (!that.inGridBoundaries(pointer.x, pointer.y)) {
        console.log('Cant place tower, not in boundaries!');
      } else {
        console.log('Placing tower!');
        this.placeTower(pointer.x, pointer.y, that.activeTower);
      }
    }, this);


    // enemy
    var enemy = this.add.sprite(-50, this.gridSize * 8.5, 'enemy1');
    enemy.setData({speed: 0.5, health: 30, maxHealth: 30, reward: 5});
    this.anims.create({
      key: 'enemy1-move',
      frames: this.anims.generateFrameNumbers('enemy1', {start: 0, end: 3}),
      frameRate: 5,
      repeat: -1
    });
    enemy.anims.play('enemy1-move', true);


    // health bar
    var backgroundBar = this.add.image(-50, this.gridSize * 8, 'healthbar-red').setOrigin(0, 0);
    var healthBar = this.add.image(-50, this.gridSize * 8, 'healthbar-green').setOrigin(0, 0);
    backgroundBar.displayWidth = enemy.getData('maxHealth');
    healthBar.displayWidth = enemy.getData('health');
    enemy.backgroundBar = backgroundBar;
    enemy.healthBar = healthBar;

    this.enemyGroup.add(enemy);

    /*

    parent = game.add.sprite(100, 100, 'mushroom');

    parent.addChild(game.make.sprite(-50, -50, 'mummy'));
    parent.addChild(game.make.sprite(100, 0, 'mummy'));
    parent.addChild(game.make.sprite(200, 200, 'mummy'));

    //  This child will move faster because its position is updated as well as the parent
    child = parent.addChild(game.make.sprite(0, 100, 'mummy'));
     */

    //


    // collision detection
    this.physics.add.collider(this.bulletGroup, this.enemyGroup, this.hitEnemy);
  },

  update: function (time, delta) {
    var that = this;

    // move
    this.moveEnemies();
    this.moveBullets();

    // fire bullets automation
    this.towerGroup.getChildren().forEach(function (tower) {
      that.enemyGroup.getChildren().forEach(function (enemy) {
        if (that.inRange(tower, enemy) && tower.getData('lastFired') + 1000 < time) {
          that.fireBullet(tower, enemy);
          tower.setData('lastFired', time);
        }
      });
    });

    // update HUD
    this.moneyText.setText(this.money);
    this.healthText.setText(this.health);
    this.waveText.setText('W ' + this.wave);

    // health bars
    var enemy = this.enemyGroup.getChildren()[0];
    enemy.healthBar.displayWidth = enemy.getData('health');
  },

  //// HELPERS

  placeTower: function (x, y, type) {
    var coordX = (x - (x % this.gridSize)) / this.gridSize;
    var coordY = (y - (y % this.gridSize)) / this.gridSize;

    var towerCost = {
      tower1: 10,
      tower2: 20
    };

    if (this.grid[coordY][coordX] === '.' && this.money >= towerCost[type]) {
      x = coordX * this.gridSize + this.gridSize / 2;
      y = coordY * this.gridSize + this.gridSize / 2;
      var newTower = this.add.sprite(x, y, type);
      newTower.setData('lastFired', 0);
      this.towerGroup.add(newTower);
      this.setTowerInGrid(coordX, coordY);
      this.money -= towerCost[type];
      console.log('Placed tower!');
    } else {
      console.log('Invalid position.');
    }
  },

  setTowerInGrid: function (x, y) {
    var s = this.grid[y];
    this.grid[y] = s.substr(0, x) + 'T' + s.substr(x + 1);
  },

  inRange: function (tower, enemy) {
    var distance = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
    return distance <= 50;
  },

  fireBullet: function (tower, enemy) {
    var bullet = this.physics.add.sprite(tower.x, tower.y, 'bullet');
    bullet.setData({destX: enemy.x, destY: enemy.y, damage: 10});
    this.bulletGroup.add(bullet);
  },

  inGridBoundaries: function (x, y) {
    return x > this.gridSize && x < (this.gridX - this.gridSize) && y > this.gridSize && y < (this.gridY - this.gridSize);
  },

  moveEnemies: function () {
    this.enemyGroup.getChildren().forEach(function (enemy) {
      // TODO follow path

      var speed = enemy.getData('speed');
      enemy.x += speed;
      enemy.backgroundBar.x += speed;
      enemy.healthBar.x += speed;

      if (enemy.x > 650) {
        enemy.x = -50;
      }
    });
  },

  moveBullets: function () {
    var baseSpeed = 2;
    this.bulletGroup.getChildren().forEach(function (bullet) {
      var diffX = Math.abs(bullet.getData('destX') - bullet.x);
      var diffY = Math.abs(bullet.getData('destY') - bullet.y);
      var signX = bullet.getData('destX') - bullet.x < 0 ? -1 : 1;
      var signY = bullet.getData('destY') - bullet.y < 0 ? -1 : 1;

      bullet.x += signX * baseSpeed * diffX / (diffX + diffY);
      bullet.y += signY * baseSpeed * diffY / (diffX + diffY);

      if (diffX < 5) {
        bullet.destroy();
      }
    });
  },

  updateMoney: function (addAmount) {
    this.money += addAmount;
  },

  hitEnemy: function (bullet, enemy) {
    var that = this;
    console.log('hitEnemy! enemy health:', enemy.getData('health'), 'bullet damage:', bullet.getData('damage'));
    // removing sprite for now - maybe trigger explosion
    console.log('enemy.getData(\'health\'):', enemy.getData('health'));
    console.log('bullet.getData(\'damage\'):', bullet.getData('damage'));

    var newHealth = enemy.getData('health') - bullet.getData('damage');
    console.log('newHealth:', newHealth);

    enemy.setData('health', newHealth);
    if (enemy.getData('health') <= 0) {
      //console.log('enemy reward:', enemy.getData('reward'));
      //console.log('old money:', that.money);
      //that.money += enemy.getData('reward');
      //console.log('new money:', that.money);
      that.updateMoney(enemy.getData('reward'));
      enemy.destroy();
    }

    bullet.destroy();
  }
});
