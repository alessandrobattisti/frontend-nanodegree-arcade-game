const height_px = 83;
const width_px = 101;
const points_tab = document.getElementById( "points" );
const lives_tab = document.getElementById( "lives" );
const items_tab = document.getElementById( "c_items" );
const score_tab = document.getElementById( "tot_score" );
const score_div = document.getElementById( "best_score_div" );
const best_score = document.getElementById( "best_score" );

//test for collisions between two objects return True or False
function test_collision(obj1, obj2){
    let p_x = obj1.x;
    let p_y = obj1.y;
    let en_x = obj2.x;
    let en_y = obj2.y;
    let get_x = (p_x-75) < en_x && en_x < (p_x+75)
    if( get_x && en_y == p_y ){
        return true;
    }else{
        return false;
    }
}

// Enemies our player must avoid
var Enemy = function(x, y, vel) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x * width_px;
    this.y = y * height_px;
    this.vel = vel;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.vel * width_px * dt;
    if ( this.x > 505 ){
        this.x = 0 * width_px;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Item to be collected class
var Item = function(x, y, img) {
    this.x = x * width_px;
    this.y = y * height_px;
    this.sprite = img;
    this.time = item_vel;
};

Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Item.prototype.update = function() {
    this.time -= 1;
    if(this.time < 0){//it time ends change item position and reset time
        this.x = Math.floor(Math.random() * 5) * width_px;
        this.y = (Math.floor(Math.random() * 3) + 1) * height_px ;
        this.time = item_vel;
    }
    //if player get this item change item position, reset time and add one to Player's collected items
    if(test_collision(this, player)){
        this.x = Math.floor(Math.random() * 5) * width_px;
        this.y = (Math.floor(Math.random() * 3) + 1) * height_px ;
        this.time = item_vel;
        player.items += 1;
    };
}

const item_vel = 5 * 40;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.x = x * width_px;
    this.y = y * height_px;
    this.sprite = 'images/char-boy.png';
    this.lives = 3;
    this.points = 0;
    this.items = 0;
};

Player.prototype.update = function() {
    //check Player's position, it can be outside the screen
    if ( this.y < 0 ){
        this.y = 5 * height_px;
        this.points += 1;
    }else if( this.y > 5 * height_px ){
        this.y = 5 * height_px;
    }
    if ( this.x > 404 ){
        this.x = 0 * width_px;
    }else if ( this.x < 0 ){
        this.x = 4 * width_px;
    }

    //check collision for each Enemy
    for(let i = 0; i < allEnemies.length; i++){
        if( test_collision( this, allEnemies[i] ) ){
            this.x = 2 * width_px;
            this.y = 5 * height_px;
            this.lives -= 1;
        }
    }

    // update score
    points_tab.innerHTML=this.points;
    lives_tab.innerHTML=this.lives;
    items_tab.innerHTML=this.items;
    score_tab.innerHTML=this.points-(3 - this.lives)+this.items*0.5;

    // restart if lives == 0
    if( this.lives == 0 ){
        restart();
    }

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if( key == "left" ){
        this.x -= 1 * width_px;
    }else if( key == "right" ){
        this.x += 1 * width_px;
    }else if( key == "up" ){
        this.y -= 1 * height_px;
    }else if( key == "down" ){
        this.y += 1 * height_px;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let player = new Player(2,5);
let allEnemies = [new Enemy(0, 1, 1), new Enemy(0, 2, 3), new Enemy(0, 3, 2), new Enemy(-1, 3, 1)];
let item = new Item(2,2, 'images/Star.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if(e.keyCode in allowedKeys){
        e.preventDefault();
        player.handleInput( allowedKeys[e.keyCode] );
    }
});


//function to restart the game
function restart(){
    let score = score_tab.innerHTML;
    score_div.style.display = 'block';
    if( score > parseInt( best_score.innerHTML ) ){
        best_score.innerHTML = score;
        if( score > 0 ){
            score_div.style.background = 'green';
        }
    }

    alert( "You loose.\nYour score is "+ score );

    //restart the game
    player.points = 0;
    player.lives = 3;
    player.items = 0;
    points_tab.innerHTML = 0;
    lives_tab.innerHTML = 3;
    items_tab.innerHTML = 0;
    score_tab.innerHTML = 0;
}
