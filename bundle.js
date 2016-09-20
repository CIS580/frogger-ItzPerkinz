(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Monster = require('./monster.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var monsters = [];
var logs = [];


// ADDED BY JOEY
var bgroundWater = new Image();
bgroundWater.src = "assets/water.jpg";

var bgroundGrass = new Image();
bgroundGrass.src = "assets/grass.png";

var bgroundSand = new Image();
bgroundSand.src = "assets/sand.png";

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  monsters.forEach(function(monster) { monster.update(elapsedTime); });
  logs.forEach(function(log) { log.update(elapsedTime); });
  //TODO: Update the game objects


}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  //ctx.fillStyle = "lightblue";
  //ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgroundSand,0,0);
  ctx.drawImage(bgroundWater,370,0);
  ctx.drawImage(bgroundGrass,72,0);
  ctx.fillRect(72,0,2,480);
  ctx.fillRect(297,0,2,480);
  ctx.fillRect(370,0,2,480);
  ctx.fillRect(595,0,2,480);
  ctx.fillRect(675,0,2,480);
  ctx.fillStyle="Green";

  ctx.fillText("LEVEL = " + player.level, 4, 20);
  ctx.fillText("LIVES = " + player.lives, 4, 50);
  ctx.font="15px Impact";
  ctx.fillStyle="Green";

  // CODE ALMOST DIRECTLY FROM https://newspaint.wordpress.com/2014/05/22/writing-rotated-text-on-a-javascript-canvas/
  ctx.save();
  ctx.translate (0,0);
  ctx.rotate(Math.PI / 2);
  ctx.font = "30px Impact";
  ctx.fillStyle="Green";
  ctx.textAlight = "left";
  ctx.fillText ("---------- NEXT LEVEL ----------", 80, -710);
  ctx.restore();
  //

  player.render(elapsedTime, ctx);
  monsters.forEach(function(monster) { monster.render(elapsedTime, ctx); });
  logs.forEach(function(log) { log.render(elapsedTime, ctx); });
}

},{"./game.js":2,"./log.js":3,"./monster.js":4,"./player.js":5}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";

module.exports = exports = Log;

function Log(position) {
  this.timer = 0;
  this.x = position.x;
  this.y = position.y;
  this.width = 60;
  this.height = 81;
  this.cell;
}

var logSprite = new Image();
logSprite.src = "assets/log.png";

Log.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;

}

Log.prototype.render = function(time, ctx) {
  ctx.drawImage(
    logSprite, this.x, this.y
  );

}

},{}],4:[function(require,module,exports){
"use strict";

module.exports = exports = Monster;

function Monster(position) {
  this.timer = 0;
  this.x = position.x;
  this.y = position.y;
  this.width = 49;
  this.height = 75;
  this.cell;
}

var monsterSprite = new Image();
monsterSprite.src = "assets/monster.png";

Monster.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;

}

Monster.prototype.render = function(time, ctx) {
  ctx.drawImage(
    monsterSprite, this.x, this.y
  );

}

},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

var input =
{
  up : false,
  down: false,
  right: false,
  left: false
}

var buzz = new Audio("assets/buzzer.wav");
var drown = new Audio("assets/drowning.wav");
var jump = new Audio("assets/jump.wav");
var click = new Audio("assets/click.wav");
var grass = [1,2,3,10,11,12,19,20,21,28,29,30,37,38,39,46,47,48];
var water = [5,6,7,14,15,16,23,24,25,32,33,34,41,42,43,50,51,52];

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;
  // ADDED BY JOEY
  this.lives = 3;
  this.level = 1;
  var self = this;
  this.cell = 27

  // Identifies the directional key being pressed
  window.onkeydown = function(event) {
    event.preventDefault();
    switch(event.keyCode){
      // up
      case 38:
      case 87:
        self.state = "moving";
        input.up = true;
        console.log("UP");
      break;
      // left
      case 37:
      case 65:
        self.state = "moving";
        input.left = true;
        console.log("LEFT");
      break;
      // right
      case 39:
      case 68:
        self.state = "moving";
        input.right = true;
        console.log("RIGHT");
      break;
      // down
      case 40:
      case 83:
        self.state = "moving";
        input.down = true;
        console.log("DOWN");
      break;
    }
  }
}





/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  // TODO: Implement your player's update by state
  //if (this.state == "idle") {console.log("Player updating. State is " + this.state);}

  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    case "moving":
      //jump.play(); // DISABLED BECAUSE TOO ANNOYING WHILE TESTING. May make it back into the game?
      // Currently handles movement. Restricts the frog from jumping off the screen. Keeps track of current cell.
      if (input.up) {
        if (this.y - 80 >= 0) {
          this.y = this.y - 80; this.cell-=9; }
          input.up = false; }
      else if (input.down) {
        if (this.y+80 < 480) {
          this.y = this.y + 80; this.cell+=9; }
          input.down = false; }
      else if (input.right) {
        this.x = this.x + 75; this.cell+=1;
        input.right = false;
        if (this.x+75 >= 700) { this.level++; this.x = 0; this.y = 240; this.cell=27; }  }
      else if (input.left) {
        if (this.x-75 >= 0) {
          this.x = this.x - 75; this.cell-=1; }
          input.left = false; }
      this.timer += time;
      this.frame += 0;
      console.log("moving " + this.x + " " + this.y + " " + this.cell);
      self.state = "idle";
    break;
    case "dead":
    if (grass.includes(this.cell)) { /*buzzer.play();*/}
    else if (water.includes(this.cell)) { /*drown.play();*/ }
    break;

  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );

      break;
    // TODO: Implement your player's rendering according to state
    case "moving":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      this.state = "idle";
    break;
    case "dead":
    break;
  }
}

},{}]},{},[1]);
