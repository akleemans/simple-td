var AboutScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function AboutScene() {
      Phaser.Scene.call(this, {key: 'AboutScene'});
    },

  preload: function () {
  },

  create: function () {
    this.add.text(40, 40, 'About', {fontFamily: 'Helvetica', fontSize: 32, color: '#dddddd'});
    this.add.text(40, 100, 'TBD', {fontFamily: 'Arial', fontSize: 16, color: '#ffffff'});

    this.cursors = this.input.keyboard.createCursorKeys();
    this.backTimer = 0;
  },

  update: function (time, delta) {
    if (this.backTimer === 0) {
      this.backTimer = time + 200;
    }
    if (time > this.backTimer && (this.cursors.space.isDown || this.cursors.right.isDown || this.cursors.left.isDown)) {
      this.scene.start('MainMenuScene');
    }
  }

});
