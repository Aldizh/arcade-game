'use strict';
class Contestant {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
}

class Enemy extends Contestant {
    constructor(x, y, speed, width, height, sprite) {
        super(x, y, sprite);
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
}

class Player extends Contestant {
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.lives = 3;
        this.score = 0;
        this.time = 60;
    }
}

Contestant.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Constants
var PLAYER_X = 200;
var PLAYER_Y = 400;


//Reset enemy's psotion to the start
Enemy.prototype.reset = function () {
    if (this.x > (500)) {
        this.x -= (500);
        this.y = Math.random() * 300;
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x += this.speed * dt;
    this.reset();
};


Player.prototype.update = function (dt) {
    //First we need to check for collisions
    this.checkCollisions();

    // Here we make sure player doesn't go out of bounds
    var max_bound = 400;
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > max_bound) {
        this.x = max_bound;
    } else if (this.y === 0) {
        this.y = max_bound;
    } else if (this.y < 0) {
        this.score += 1;
        if (this.score >= 10) { this.lives += 1; this.score = 0; }
        this.y = 0;
    } else if (this.y > max_bound) {
        this.y = max_bound;
    }
}

Player.prototype.render = function () {
    //Might be possible to do partial inheritance here
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = '25px serif';
    if (this.lives > 0)
        ctx.fillStyle = 'green';
    else
        ctx.fillStyle = 'red';
    ctx.fillText('Countdown: ' + parseInt(this.time), 100, 40);
    ctx.fillText('Score: ' + this.score, 300, 40);
    ctx.fillText('Lives: ' + this.lives, 400, 40);
}

Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'left':
            this.x = this.x - 100;
            break;
        case 'up':
            this.y = this.y - 85;
            break;
        case 'right':
            this.x = this.x + 100;
            break;
        case 'down':
            this.y = this.y + 85;
            break;
    }
}

//Reset Values
Player.prototype.reset = function () {
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
}

//Check to see whether the player has collided
//with an enemy reset the player's position if so.
Player.prototype.checkCollisions = function () {
    //setting this a little lower than the enemy dimensions
    var width = 40;
    var height = 40;

    for (i = 0; i < allEnemies.length; i++) {
        if (this.x < allEnemies[i].x + allEnemies[i].width &&
            this.x + width > allEnemies[i].x &&
            this.y < allEnemies[i].y + allEnemies[i].height &&
            height + this.y > allEnemies[i].y) {
            // collision detected!
            this.lives--;
            if (this.lives > 0)
                alert("Collided: " + this.lives + " lives left");
            else
                alert("Ouch, Game over");
            this.reset();
            this.render();
        }
    }
}

// Instantiating objects.
var sprite = "images/char-boy.png";
var player = new Player(PLAYER_X, PLAYER_Y, sprite);

var allEnemies = [];
sprite = 'images/enemy-bug.png';
for (var i = 0; i <= 3; i++) {
    var enemy = new Enemy(Math.random() * (-300), Math.random() * 300, Math.floor(Math.random() * 100) + 30, 40, 30, sprite);
    allEnemies.push(enemy);
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
