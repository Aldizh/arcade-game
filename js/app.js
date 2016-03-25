// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

//Reset enemy's psotion to the start
Enemy.prototype.reset = function(){
    if (this.x > (500)){
        this.x -= (500);
        this.y = Math.random() * 300
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    this.reset();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.lives = 3;
    this.sprite = "images/char-boy.png";
}

Player.prototype.update = function() {
    //First we need to check for collisions
    this.checkCollisions();

    // Her we make sure player doesn't go out of bounds
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > 400) {
        this.x = 400;
    } else if (this.y === 0) {
        this.y = 400;
    } else if (this.y < 0) {
        this.y = 0;
    } else if (this.y > 400) {
        this.y = 400;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = '25px serif';
    if (this.lives > 0)
        ctx.fillStyle = 'green';
    else
        ctx.fillStyle = 'red';
    ctx.fillText('Lives: ' + this.lives, 400, 40);
}

Player.prototype.handleInput = function(key){
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

//Check to see whether the player has collided
//with an enemy reset the player's position if so.
Player.prototype.checkCollisions = function() {
    for (i=0; i < allEnemies.length; i++) {
        if ( Math.abs(this.x - allEnemies[i].x) < 30 && Math.abs(this.y - allEnemies[i].y) < 30) {
            this.lives--;
            if (this.lives > 0)
                alert("Collided: " + this.lives + " lives left");
            else
                alert("Ouch, Game over");
            this.x = 200;
            this.y = 400;
            this.render();
        }
    }
}

Player.prototype.reset = function(){
    this.x = 200;
    this.y = 400;
}

var player = new Player(200, 400);

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i=0; i<=3; i++ ){
    enemy = new Enemy(Math.random()*(-300),Math.random()*300,Math.floor(Math.random()*100)+20);
    allEnemies.push(enemy);
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});