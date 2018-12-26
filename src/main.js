var config = {
  type: Phaser.CANVAS, // CANVAS | WEBGL
  width: 600,
  height: 400,
  pixelArt: true,
  backgroundColor: '#404040', // or: 4488AA
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
      // gravity: {y: 1000}
    }
  },
  scene: [
    MainMenuScene,
    AboutScene,
    Level1Scene
  ]
};
var game = new Phaser.Game(config);
