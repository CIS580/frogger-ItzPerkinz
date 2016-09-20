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
