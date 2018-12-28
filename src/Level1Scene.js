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
      '..................',
      '.X...........XXXX.',
      '.X................',
      '.X..PPPPPPP.......',
      '.X..P.....P..PPPP.',
      '....P.....P..P....',
      '....P..PPPP..P....',
      '....P..P.....P..X.',
      '.PPPP..P.....P..X.',
      '.......PPPPPPP..X.',
      '................X.'
    ];

    // UI tower choice
    this.activeTower = null;
    this.background = this.add.image(this.gridX / 2, this.gridY / 2, 'level1');

    this.towerGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
    this.bulletGroup = this.physics.add.group();

    var buttonTower1 = this.add.sprite(this.gridX - 70, this.gridY - 25, 'button-tower1').setInteractive();
    var buttonTower2 = this.add.sprite(this.gridX - 25, this.gridY - 25, 'button-tower2').setInteractive();

    buttonTower1.on('pointerdown', function (pointer) {
      if (that.activeTower == null) {
        that.activeTower = 'tower1';
        buttonTower1.setFrame(1);
      } else {
        that.activeTower = null;
        buttonTower1.setFrame(0);
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
        this.placeTower(pointer.x, pointer.y, 'tower1');
      }
    }, this);


    // enemy
    var enemy = this.physics.add.sprite(-50, this.gridSize * 8.5, 'enemy1');
    enemy.setData('health', 100);
    this.anims.create({
      key: 'enemy1-move',
      frames: this.anims.generateFrameNumbers('enemy1', {start: 0, end: 3}),
      frameRate: 5,
      repeat: -1
    });
    enemy.anims.play('enemy1-move', true);
    this.enemyGroup.add(enemy);

    // collision detection
    this.physics.add.collider(this.bulletGroup, this.enemyGroup, this.hitEnemy);
    /*
          this.arrow = this.physics.add.sprite(posX, posY, 'arrow');
      this.arrow.setVelocity(v, 0);
      this.arrow.flipX = flipX;
      this.arrow.body.allowGravity = false;

      // TODO refactor to group
      this.physics.add.collider(this.arrow, this.invader, this.hitEnemy);
     */


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


    // collision detection
  },

  //// HELPERS

  placeTower: function (x, y, type) {
    var coordX = (x - (x % this.gridSize)) / this.gridSize;
    var coordY = (y - (y % this.gridSize)) / this.gridSize;

    if (this.grid[coordY][coordX] === '.') {
      x = coordX * this.gridSize + this.gridSize / 2;
      y = coordY * this.gridSize + this.gridSize / 2;
      var newTower = this.add.sprite(x, y, type);
      newTower.setData('lastFired', 0);
      this.towerGroup.add(newTower);
      console.log('Placed tower!');
    } else {
      console.log('Invalid position.');
    }
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

  enemyCollision: function () {

  },

  moveEnemies: function () {
    this.enemyGroup.getChildren().forEach(function (enemy) {
      enemy.x += 0.5;
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

  hitEnemy: function (bullet, enemy) {
    console.log('hitEnemy! enemy health:', enemy.getData('health'), 'bullet damage:', bullet.getData('damage'));
    // removing sprite for now - maybe trigger explosion
    bullet.destroy();

    var newHealth = enemy.getData('health') - bullet.getData('damage');
    console.log('newHealth:', newHealth);

    enemy.setData('health', newHealth);
    if (enemy.getData('health') <= 0) {
      enemy.destroy();
    }
  }
});
