var config = {
    type: Phaser.AUTO,
	width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game_area',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0},
			debug: false
		}
	},
    scene: [ GameScene ]
};

var game = new Phaser.Game(config);

