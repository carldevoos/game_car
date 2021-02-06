var fondo;
var cursores;
var carro;

// autos
var enemigos;
var timer;
var velocity_enemigo = 200;

// gasolina
var gasolinas;
var timerGasolina;
var velocity_gasolina = 200;

// Contador 
var puntos;
var txtPuntos;

// Vida
var vidas;
var txtVidas;

// Nivel
var nivel = 1;
var txtNivel;

// contador
var contador = 0;

// text nivel
var txtGameOver = null;
var statusLevel = false;

var Juego = {
    preload: function () {
        juego.load.image('bg', 'img/bg.png');
        juego.load.image('carro', 'img/carro.png');
        juego.load.image('carroMalo', 'img/carroMalo.png');
        juego.load.image('gasolina', 'img/gas.png');
        juego.forceSingleUpdate = true;

        juego.load.audio('recharge', 'sound/mixkit-garage-pneumatic.mp3');
        juego.load.audio('breaking', 'sound/car_breaking_skid.mp3');
        juego.load.audio('drive', 'sound/Sports-Car-Driving-Med.mp3');
    },
    create: function () {
        fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');
        juego.physics.startSystem(Phaser.Physics.ARCADE);

        carro = juego.add.sprite(juego.width / 2, 496, 'carro');
        carro.anchor.setTo(0.5);
        //carro.physicsBodyType = Phaser.Physics.ARCADE;
        juego.physics.arcade.enable(carro, true);

        cursores = juego.input.keyboard.createCursorKeys();

        // enemigos
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.createMultiple(20, 'carroMalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.setAll('outOfBoundsKill', true);
        enemigos.setAll('checkWorldBounds', true);

        timer = juego.time.events.loop(1500, this.crearCarroMalo, this);

        // gasolinas
        gasolinas = juego.add.group();
        gasolinas.enableBody = true;
        gasolinas.createMultiple(20, 'gasolina');
        gasolinas.setAll('anchor.x', 0.5);
        gasolinas.setAll('anchor.y', 0.5);
        gasolinas.setAll('outOfBoundsKill', true);
        gasolinas.setAll('checkWorldBounds', true);

        timerGasolina = juego.time.events.loop(2000, this.crearGasolina, this);

        // Puntos
        puntos = 0;
        juego.add.text(20, 20, "Puntos: ", { font: "14px Arial", fill: "#FFF" });
        txtPuntos = juego.add.text(80, 20, "0", { font: "14px Arial", fill: "#FFF" });

        // Vida
        vidas = 3;
        juego.add.text(150, 20, "Vidas:", { font: "14px Arial", fill: "#FFF" });
        txtVidas = juego.add.text(200, 20, "3", { font: "14px Arial", fill: "#FFF" });

        // Sonido
        sound_recharge = juego.add.audio('recharge');
        sound_breaking = juego.add.audio('breaking');

        sound_drive = juego.add.audio('drive');
        sound_drive.loop = true;
    },
    update: function () {
        fondo.tilePosition.y += 3;

        if (cursores.right.isDown && carro.position.x < 245) {
            carro.position.x += 5;
        }
        if (cursores.left.isDown && carro.position.x > 45) {
            carro.position.x -= 5;
        }

        // Colision - Gasolinas
        juego.physics.arcade.overlap(carro, gasolinas, this.colisionGasolina, null, this);

        // Colision - Enemigos
        juego.physics.arcade.overlap(carro, enemigos, this.colisionEnemigo, null, this);

        if (vidas == 0) {
            juego.paused = true;
            txtGameOver = juego.add.text(juego.width / 2 - 103.5, juego.height / 2 - 25, "Game Over", { font: "40px Arial", fill: "#000" });
        }

        if (puntos == 3) {
            //juego.paused = true;
            nivel += 1;
            txtGameOver = juego.add.text(juego.width / 2 - 103.5, juego.height / 2 - 25, "Next Level: " + nivel, { font: "40px Arial", fill: "#000" });

            vidas = 3;
            txtVidas.text = vidas;

            puntos = 0;
            txtPuntos.text = puntos;

            //juego.paused = false;

            velocity_enemigo += 50;
            velocity_gasolina += 25;

            statusLevel = true;


        }

        if (statusLevel) {
            contador += 10;
        }

        if (contador == 700) {
            txtGameOver.kill();
            contador = 0;
            statusLevel = false;
        }
    },
    crearCarroMalo: function () {
        let posicion = Math.floor(Math.random() * 3) + 1;
        let enemigo = enemigos.getFirstDead();
        enemigo.physicsBodyType = Phaser.Physics.ARCADE;
        enemigo.reset(posicion * 73, 0);
        enemigo.body.velocity.y = velocity_enemigo;
        enemigo.anchor.setTo(0.5);
    },
    crearGasolina: function () {
        let posicion = Math.floor(Math.random() * 3) + 1;
        let gasolina = gasolinas.getFirstDead();
        gasolina.physicsBodyType = Phaser.Physics.ARCADE;
        gasolina.reset(posicion * 73, 0);
        gasolina.body.velocity.y = velocity_gasolina;
        gasolina.anchor.setTo(0.5);
    },
    colisionGasolina: function (jugador, gasolina) {
        gasolina.kill();
        puntos++;
        txtPuntos.text = puntos;
        sound_recharge.stop();
        sound_recharge.play();
    },
    colisionEnemigo: function (jugador, enemigo) {
        enemigo.kill();
        vidas--;
        txtVidas.text = vidas;
        sound_breaking.stop();
        sound_breaking.play();
    }
}