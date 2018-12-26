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

    // UI tower choice
    this.activeTower = null;
    this.background = this.add.image(0, 0, 'background');

    this.towerGroup = this.add.group();
    this.enemyGroup = this.add.group();
    this.bulletGroup = this.add.group();

    var buttonTower = this.add.sprite(570, 370, 'button-tower').setInteractive();

    buttonTower.on('pointerdown', function (pointer) {
      if (that.activeTower == null) {
        that.activeTower = 'simple-tower';
        buttonTower.setFrame(1);
        console.log('Setting active tower!');
      } else {
        that.activeTower = null;
        buttonTower.setFrame(0);
        console.log('Resetting active tower.');
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
        var newTower = that.add.sprite(pointer.x, pointer.y, 'tower-simple');
        newTower.setData('lastFired', 0);
        this.towerGroup.add(newTower);
      }
    }, this);


    // enemy
    this.enemy = this.add.sprite(-50, 200, 'enemy');
    this.enemyGroup.add(this.enemy);

    this.anims.create({
      key: 'enemy-move',
      frames: this.anims.generateFrameNumbers('enemy', {start: 0, end: 3}),
      frameRate: 5,
      repeat: -1
    });
    this.enemy.anims.play('enemy-move', true);

  },

  update: function (time, delta) {
    var that = this;
    this.moveEnemies();
    this.moveBullets();

    // TODO check towers if in range
    this.towerGroup.getChildren().forEach(function(tower) {
      that.enemyGroup.getChildren().forEach(function(enemy) {
        if (that.inRange(tower, enemy) && tower.getData('lastFired') + 1000 < time) {
          that.fireBullet(tower, enemy);
          tower.setData('lastFired', time);
        }
      });
    });

  },

  //// HELPERS

  inRange: function(tower, enemy) {
    var distance = Phaser.Math.Distance.Between(tower.x,tower.y,enemy.x,enemy.y);
    return distance <= 50;
  },

  fireBullet: function(tower, enemy) {
    var bullet = this.add.sprite(tower.x, tower.y, 'bullet');
    bullet.setData({ destX: enemy.x, destY: enemy.y });
    this.bulletGroup.add(bullet);
  },

  inGridBoundaries: function(x, y) {
    return x > 50 && x < 550 && y > 50 && y < 350;
  },

  enemyCollision: function () {

  },
  moveEnemies: function() {
    this.enemyGroup.getChildren().forEach(function(enemy) {
      enemy.x += 0.5;
      if (enemy.x > 650) {
        enemy.x = -50;
      }
    });
  },

  moveBullets: function() {
    var baseSpeed = 4;
    this.bulletGroup.getChildren().forEach(function(bullet) {
      var diffX = Math.abs(bullet.getData('destX') - bullet.x);
      var diffY = Math.abs(bullet.getData('destY') - bullet.y);
      var signX =  bullet.getData('destX') - bullet.x < 0 ? -1 : 1;
      var signY =  bullet.getData('destY') - bullet.y < 0 ? -1 : 1;

      bullet.x += signX * baseSpeed * diffX / (diffX + diffY);
      bullet.y += signY * baseSpeed * diffY / (diffX + diffY);

      if (diffX < 5) {
        bullet.destroy();
      }
    });


  },

  hitEnemy: function (bullet, enemy) {
    // removing both sprites for now - maybe trigger explosion
    bullet.destroy();
    enemy.destroy();
  }
});
