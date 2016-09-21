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

// ADDED BY JOEY
var monsters1 = [];
var monsters2 = [];
var monsters3 = [];
var logs1 = [];
var logs2 = [];
var logs3 = [];
var oldPlayerLvl = 1;

var unlock = new Audio("assets/unlock.wav");
unlock.volume = 0.2

var bgroundWater = new Image();
bgroundWater.src = "assets/water.jpg";

var bgroundGrass = new Image();
bgroundGrass.src = "assets/grass.png";

var bgroundSand = new Image();
bgroundSand.src = "assets/sand.png";

var indexM;
var indexL;
var oldM;
var oldL;
var drowning = false;

var timer = 0;
var curIndex = 0;

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
  // Spawn
  //console.log(monsters1.length);


  //console.log(player.newLevel);
  drowning = false;
  timer = timer + player.level/2;
  if (timer >= Math.random()*(3000/player.level)+75)
  {
    console.log ("spawning -- tick is  " + timer );
    spawnM(); if (timer > 125) { spawnM(); }
    spawnL(); spawnL();
    timer = 0;
  }

  // Update
  monsters1.forEach(function(monster) {
    monster.update(elapsedTime);
    if (player.locked && monster.y > 300) { unlock.play(); player.locked = false; }
  });
  monsters2.forEach(function(monster) {
    if (player.locked && monster.y > 300) { unlock.play(); player.locked = false; }
    monster.update(elapsedTime);
  });
  monsters3.forEach(function(monster) {
    if (player.locked && monster.y > 300) { unlock.play(); player.locked = false; }
    monster.update(elapsedTime);
  });
  logs1.forEach(function(log) {
    if (player.locked && log.y > 300) { unlock.play(); player.locked = false; }
    log.update(elapsedTime);
  });
  logs2.forEach(function(log) {
    if (player.locked && log.y > 300) { unlock.play(); player.locked = false; }
    log.update(elapsedTime);
  });
  logs3.forEach(function(log) {
    if (player.locked && log.y > 300) { unlock.play(); player.locked = false; }
    log.update(elapsedTime);
  });
  player.update(elapsedTime);
  if (player.onLog) {latchOn(player, player.on)}
  if (player.lives == 0) { game.paused = true; }

  // Collisions
  if (player.col == 1) {for (var a=0; a<monsters1.length; a++) { checkCollisionM(monsters1[a], player); }}
  else if (player.col == 2) {for (var b=0; b<monsters2.length; b++) { checkCollisionM(monsters2[b], player); }}
  else if (player.col == 3) {for (var c=0; c<monsters3.length; c++) { checkCollisionM(monsters3[c], player); }}
  else if (player.col == 5) {for (var d=0; d<logs1.length; d++) { if (player.onLog == false) onLog(logs1[d], player); }}
  else if (player.col == 6) {for (var e=0; e<logs2.length; e++) { if (player.onLog == false) onLog(logs2[e], player); }}
  else if (player.col == 7) {for (var f=0; f<logs3.length; f++) { if (player.onLog == false) onLog(logs3[f], player); }}
  if (drowning == true) { player.state = "dead"; }

  if (player.newLevel)
  {
    monsters1 = [];
    monsters2 = [];
    monsters3 = [];
    logs1 = [];
    logs2 = [];
    logs3 = [];
    player.locked = true;
    player.newLevel = false;
  }


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
  //ctx.clearRect(0,0,760,480);

  ctx.drawImage(bgroundSand,0,0);
  ctx.drawImage(bgroundWater,370,0);
  ctx.drawImage(bgroundGrass,72,0);
  ctx.fillRect(72,0,2,480);
  ctx.fillRect(297,0,2,480);
  ctx.fillRect(370,0,2,480);
  ctx.fillRect(595,0,2,480);
  ctx.fillRect(675,0,2,480);
  if (!game.paused) ctx.fillStyle="Green";

  ctx.fillText("LEVEL = " + player.level, 4, 20);
  ctx.fillText("LIVES = " + player.lives, 4, 50);
  if (!game.paused) ctx.font="14px Impact";
  if (!game.paused) ctx.fillStyle="Green";

  // CODE ALMOST WORD FOR WORD FROM https://newspaint.wordpress.com/2014/05/22/writing-rotated-text-on-a-javascript-canvas/
  ctx.save();
  ctx.translate (0,0);
  ctx.rotate(Math.PI / 2);
  ctx.font = "30px Impact";
  ctx.fillStyle="Green";
  ctx.textAlight = "left";
  ctx.fillText ("---------- NEXT LEVEL ----------", 80, -710);
  ctx.restore();
  //

  monsters1.forEach(function(monster) { monster.render(elapsedTime, ctx); });
  monsters2.forEach(function(monster) { monster.render(elapsedTime, ctx); });
  monsters3.forEach(function(monster) { monster.render(elapsedTime, ctx); });
  logs1.forEach(function(log) { log.render(elapsedTime, ctx); });
  logs2.forEach(function(log) { log.render(elapsedTime, ctx); });
  logs3.forEach(function(log) { log.render(elapsedTime, ctx); });
  player.render(elapsedTime, ctx);

  if (player.locked)
  {
    ctx.font="30px Impact";
    ctx.fillStyle = "Black";
    ctx.fillText("Level " + player.level + " starting shortly! Good luck!", 160,250);
    ctx.font="14px Impact";
    ctx.fillStyle="Green";

  }

}

function checkCollisionM(object, player)
{
  var hit = !((player.y+player.height < object.y+5) || (player.y > object.y+object.height-5))
  if (hit)
  { player.state = "dead";}
}

function onLog(object, player)
{
  var on = !((player.y+player.height < object.y-5) || (player.y > object.y+object.height))
  if (on) {
    player.onLog = true;
    drowning = false;
    player.on = object;
    latchOn(player, object);
    }
  else { drowning = true; }
}

function spawnM()
{
  indexM = Math.floor(Math.random()*3 + 1);
  var newMon = new Monster(player.level, indexM);
  if (indexM == 1 /*&& oldM != 1*/) { monsters1.push(newMon); }
  if (indexM == 2 /*&& oldM != 2*/) { monsters2.push(newMon); }
  if (indexM == 3 /*&& oldM != 3*/) { monsters3.push(newMon); }
  oldM = indexM;
}

function spawnL()
{
  indexL = Math.floor(Math.random()*3 + 5);
  var newLog = new Log(player.level, indexL);
  if (indexL == 5 && oldL != 5) { logs1.push(newLog); }
  if (indexL == 6 && oldL != 6) { logs2.push(newLog); }
  if (indexL == 7 && oldL != 7) { logs3.push(newLog); }
  oldL = indexL;
}

function latchOn(player, log)
{
  player.onLog = true;
  player.drowning = false;
  player.y = log.y;
  if (log.y > 440) {
    player.state = "dead";

  }
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

function Log(level, col) {
  this.timer = 0;
  this.x;
  this.y = 0;
  if (col == 5) { this.x = 382; }
  else if (col == 6) { this.x = 457; }
  else { this.x = 532; }
  this.width = 60;
  this.height = 60;
  this.level = level;
  this.col = col;

}

var logSprite = new Image();
logSprite.src = "assets/log.png";

Log.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  if (this.col == 6) { this.y = this.y + this.level/3; }
  else { this.y = this.y + this.level/2; }
}

Log.prototype.render = function(time, ctx) {
  ctx.drawImage(
    logSprite, this.x, this.y
  );
  //ctx.fillRect(this.x, this.y+10, this.width-5, this.height);
  //ctx.fillStyle="Brown";
//  ctx.rect(this.x, this.y, this.width, this.height);
//  ctx.stroke();

}

},{}],4:[function(require,module,exports){
"use strict";

module.exports = exports = Monster;

function Monster(level, col) {
  this.timer = 0;
  this.x;
  this.y = 0;
  if (col == 1) { this.x = 87; }
  else if (col == 2) { this.x = 162; }
  else { this.x = 237; }
  this.width = 49;
  this.height = 65;
  this.level = level;
  this.col = col;
}

var monsterSprite = new Image();
monsterSprite.src = "assets/monster.png";

Monster.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  if (this.col == 2) { this.y = this.y + this.level/3; }
  else { this.y = this.y + this.level/2; }

}

Monster.prototype.render = function(time, ctx) {
  ctx.drawImage(
    monsterSprite, this.x, this.y-3
  );
  //ctx.fillRect(this.x, this.y, this.width, this.height);

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
buzz.volume = 0.2;
var drown = new Audio("assets/drowning.wav");
drown.volume = 0.2;
var jump = new Audio("assets/jump.wav");
jump.volume = 0.2;
var click = new Audio("assets/fanfare.wav");
click.volume = 0.2;

var splat = new Image();
splat.src = "assets/splat.png";

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
  this.width  = 55;
  this.height = 55;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;

  // ADDED BY JOEY
  this.lives = 3;
  this.level = 1;
  var self = this;
  this.col = 0;
  this.onLog = false;
  this.on;
  this.newLevel = false;
  this.locked = true;

  // Identifies the directional key being pressed
  window.onkeydown = function(event) {
    event.preventDefault();
    switch(event.keyCode){
      // up
      case 38:
      case 87:
        self.state = "moving";
        input.up = true;
      break;
      // left
      case 37:
      case 65:
        self.state = "moving";
        input.left = true;
      break;
      // right
      case 39:
      case 68:
        self.state = "moving";
        input.right = true;
      break;
      // down
      case 40:
      case 83:
        self.state = "moving";
        input.down = true;
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
      if (this.locked != true)
      {
      if (input.up) {
        if (this.y - 80 >= 0) {
          this.y = this.y - 80; }
          input.up = false; }
      else if (input.down) {
        if (this.y+80 < 480) {
          this.y = this.y + 80; }
          input.down = false; }
      else if (input.right) {
        this.x = this.x + 75; this.col+=1;
        input.right = false;
        if (this.col == 9) {
          click.play(); this.level++; this.x = 0; this.y = 240; this.col = 0;
          this.newLevel = true; this.locked = true; }  }
      else if (input.left) {
        if (this.x-75 >= 0) {
          this.x = this.x - 75; this.col-=1; }
          input.left = false; }
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      this.onLog = false;
      self.state = "idle";
    }
    input.up = false;
    input.down = false;
    input.right = false;
    input.left = false;
    break;
    case "dead":
      this.onLog = false;
      this.on;
      if (grass.includes(this.col)) { buzz.play();}
      else if (water.includes(this.col)) { drown.play(); }
      this.lives--;
      this.state = "idle";
      this.x = 0; this.y = 240; this.col = 0;
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
        this.frame * 64, 64, 64, 64,
        // destination rectangle
        this.x, this.y-10, this.width, this.height
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
        this.x, this.y-10, this.width, this.height
      );
      this.state = "idle";
    break;
    case "dead":
    ctx.drawImage(
      splat,
      // destination rectangle
      this.x, this.y-10, this.width, this.height);
    break;
  }
}

},{}]},{},[1]);
