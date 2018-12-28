var MainMenuScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function MainMenuScene() {
      Phaser.Scene.call(this, {key: 'MainMenuScene'});
    },

  preload: function () {
    // pre-loading assets for game
    /*
    this.load.spritesheet('player', 'assets/img/player.png', {frameWidth: 46, frameHeight: 46});
    this.load.spritesheet('crystal', 'assets/img/save-crystal-animated.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('invader', 'assets/invader.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('spider', 'assets/img/spider.png', {frameWidth: 24, frameHeight: 54});
    this.load.image('heart-full', 'assets/img/heart-full.png', {frameWidth: 6, frameHeight: 7});
    this.load.image('heart-half', 'assets/img/heart-half.png', {frameWidth: 6, frameHeight: 7});
    this.load.image('cog-yellow', 'assets/img/cog-yellow.png', {frameWidth: 15, frameHeight: 15});
    */

    this.load.image('intro', 'assets/img/intro.png');

    this.load.image('level1', 'assets/img/level1.png');
    this.load.image('tower1', 'assets/img/tower1.png');
    this.load.image('tower2', 'assets/img/tower2.png');
    this.load.image('bullet', 'assets/img/bullet.png', {frameWidth: 7, frameHeight: 7});

    this.load.spritesheet('enemy1', 'assets/img/enemy1.png', {frameWidth: 32, frameHeight: 32});

    this.load.image('arrow', 'assets/img/arrow.png', {frameWidth: 21, frameHeight: 5});
    this.load.spritesheet('button-tower1', 'assets/img/button-tower1.png', {frameWidth: 46, frameHeight: 46});
    this.load.spritesheet('button-tower2', 'assets/img/button-tower2.png', {frameWidth: 46, frameHeight: 46});


  },

  create: function () {
    this.choice = 'play';
    this.arrow = this.add.sprite(80, 214, 'arrow');

    this.add.sprite(200, 100, 'intro');

    // this.add.text(40, 40, 'Simple TD', {fontFamily: 'Helvetica', fontSize: 32, color: '#333'});
    this.add.text(100, 200, 'Play', {fontFamily: 'Arial', fontSize: 22, color: '#333'});
    this.add.text(100, 230, 'About', {fontFamily: 'Arial', fontSize: 22, color: '#333'});

    this.cursors = this.input.keyboard.createCursorKeys();
    this.choiceTimer = 0;
  },

  update: function (time, delta) {
    if (this.choiceTimer === 0) {
      this.choiceTimer = time + 200;
    }
    if ((this.cursors.up.isDown || this.cursors.down.isDown) && time > this.choiceTimer) {
      this.choiceTimer = time + 200;
      if (this.choice === 'play') {
        this.arrow.setPosition(80, 244);
        this.choice = 'about'
      }
      else {
        this.arrow.setPosition(80, 214);
        this.choice = 'play'
      }
    }

    if (time > this.choiceTimer && (this.cursors.space.isDown || this.cursors.right.isDown)) {
      if (this.choice === 'play') {
        this.scene.start('Level1Scene');
      }
      else {
        this.scene.start('AboutScene');
      }
    }
  }

});
