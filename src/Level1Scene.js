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
        // TODO add to group

        this.towerGroup.create(
          pointer.x,
          pointer.y,
          'tower-simple'
        );
        // this.add.image(pointer.x, pointer.y, 'tower-simple');
      }
    }, this);


    // enemy
    this.enemy = this.add.sprite(-50, 200, 'enemy');
    this.anims.create({
      key: 'enemy-move',
      frames: this.anims.generateFrameNumbers('enemy', {start: 0, end: 3}),
      frameRate: 5,
      repeat: -1
    });
    this.enemy.anims.play('enemy-move', true);

  },

  update: function (time, delta) {
    this.moveEnemies();

    // TODO check towers if in range

  },

  //// HELPERS

  inGridBoundaries: function(x, y) {
    return x > 50 && x < 550 && y > 50 && y < 350;
  },

  enemyCollision: function () {

  },
  moveEnemies: function() {
    this.enemy.x += 1;
    if (this.enemy.x > 650) {
      this.enemy.x = -50;
    }
  },

  hitEnemy: function (bullet, enemy) {
    // removing both sprites for now - maybe trigger explosion
    bullet.destroy();
    enemy.destroy();
  }
});
