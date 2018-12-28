var config = {
  type: Phaser.CANVAS, // CANVAS | WEBGL
  width: 576,
  height: 384,
  pixelArt: true,
  backgroundColor: '#fff', // or: 4488AA
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
