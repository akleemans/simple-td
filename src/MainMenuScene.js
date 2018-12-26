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

    this.load.image('arrow', 'assets/img/arrow.png', {frameWidth: 21, frameHeight: 5});
    this.load.image('background', 'assets/img/green.png');

    //this.load.image('button-tower', 'assets/img/button-tower.png');
    //this.load.image('button-tower-hover', 'assets/img/button-tower-hover.png');
    this.load.spritesheet('button-tower', 'assets/img/button-tower.png', {frameWidth: 43, frameHeight: 46});

    this.load.image('tower-simple', 'assets/img/tower.png');

    this.load.spritesheet('enemy', 'assets/img/invader.png', {frameWidth: 32, frameHeight: 32});

  },

  create: function () {
    this.choice = 'play';
    this.arrow = this.add.sprite(80, 114, 'arrow');

    this.add.text(40, 40, 'Simple TD', {fontFamily: 'Helvetica', fontSize: 32, color: '#dddddd'});
    this.add.text(100, 100, 'Play', {fontFamily: 'Arial', fontSize: 22, color: '#ffffff'});
    this.add.text(100, 130, 'About', {fontFamily: 'Arial', fontSize: 22, color: '#ffffff'});

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
        this.arrow.setPosition(80, 144);
        this.choice = 'about'
      }
      else {
        this.arrow.setPosition(80, 114);
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
