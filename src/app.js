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
