export default class Snake {
    constructor(scene) {
        this.scene = scene;
        this.lastMoveTime = 0;
        this.moveInterval = 100; // ms
        this.tileSize = 16;
        this.direction = Phaser.Math.Vector2.DOWN; // [x, y]: um vetor que vai indicar a direção
        this.body = [];
        this.body.push(
            this.scene.add  
                .rectangle(
                    this.scene.game.config.width / 2,
                    this.scene.game.config.height / 2,
                    this.tileSize,
                    this.tileSize,
                    0xff0000)
                .setOrigin(0) 
        );
        this.apple = this.scene.add
            .rectangle(0, 0, this.tileSize, this.tileSize, 0x00ff00)
            .setOrigin(0);
            

        this.positionApple();

        scene.input.keyboard.on('keydown', e => {
            this.keydown(e);
        });
    }

    positionApple() {
        /* Math.random() gera numeros de 0 a 1 */
        /* Math.floor() garante que eh um numero inteiro */
        this.apple.x = Math.floor(
            (Math.random() * this.scene.game.config.width / this.tileSize)
        ) * this.tileSize;

        this.apple.y = Math.floor(
            (Math.random() * this.scene.game.config.height / this.tileSize)
        ) * this.tileSize;

        /* Desse modo tanto a cobra quanto as maças vão se manter em um "grid" do jogo
        e conseguir se encaixar tanto uma na outra quanto na tela do jogo */
    }

    keydown(event) {
        switch (event.keyCode) {
            case 37: // left (só pode ir se nao tiver indo pra direita)
                if(this.direction !== Phaser.Math.Vector2.RIGHT) {
                    this.direction = Phaser.Math.Vector2.LEFT;  
                }
                break;
            
            case 38: // up (só pode ir se nao tiver indo pra baixo)
                if(this.direction !== Phaser.Math.Vector2.DOWN) {
                    this.direction = Phaser.Math.Vector2.UP;
                }
                break;
            
            case 39: // right (só pode ir se nao tiver indo pra esquerda)
                if(this.direction !== Phaser.Math.Vector2.LEFT) {
                    this.direction = Phaser.Math.Vector2.RIGHT;
                } 
                break;
            
            case 40: // down (só pode ir se nao tiver indo pra cima)
                if(this.direction !== Phaser.Math.Vector2.UP) {
                    this.direction = Phaser.Math.Vector2.DOWN;
                } 
                break;
        }
    }

    update(time) {
        if(time >= this.lastMoveTime + this.moveInterval) {
            this.lastMoveTime = time;
            this.move();
        }
    }
    
    move() {
        let x = this.body[0].x + this.direction.x * this.tileSize;
        let y = this.body[0].y + this.direction.y * this.tileSize;

        if(this.apple.x === x && this.apple.y === y) {
            // comendo a maça
            this.body.push(this.scene.add.rectangle(0, 0, this.tileSize, this.tileSize, 0xffffff).setOrigin(0));
            this.positionApple();
        }


        for(let index = this.body.length - 1; index > 0; index--) {
            this.body[index].x = this.body[index-1].x;
            this.body[index].y = this.body[index-1].y;
        }

        this.body[0].x = x; 
        this.body[0].y = y;

        // morte saindo da tela
        if(
            this.body[0].x < 0 ||
            this.body[0].x >= this.scene.game.config.width ||
            this.body[0].y < 0 ||
            this.body[0].y >= this.scene.game.config.height
        ) {
            this.scene.scene.restart();
        }

        // morte comendo o proprio corpo
        let tail = this.body.slice(1); // slice() pega um pedaço do vetor que comecao na posção 1 e termina nmo fim
        /* o some() eh como se fosse um forEach() -> vai retornar verdadeiro se algum retangulos cumprir a comdição */
        if(tail.some(s => s.x === this.body[0].x && s.y === this.body[0].y)) {
            this.scene.scene.restart();
        }
        
    }
}