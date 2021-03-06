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
