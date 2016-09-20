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
