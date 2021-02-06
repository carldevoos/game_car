var juego = new Phaser.Game(290, 540, Phaser.CANVAS, 'runner'); 

window.PhaserGlobal = {
    disableWebAudio: true
};

juego.state.add('Juego', Juego);
juego.state.add('Terminado', Terminado);
juego.state.start('Juego');