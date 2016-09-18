"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

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
}

var input = {
  up: false,
  down: false,
  left: false,
  right: false
}

// Identifies the directional key being pressed
window.onkeydown = function(event) {
  event.preventDefault();
  switch(event.keyCode){
    // up = 38 w = 87
    // left = 37 a = 65
    // right = 39 d = 68
    // down = 40 s = 83
    case 38:
    case 87:
      this.state = "moving";
      console.log("Up pushed. State is " + this.state);
      this.prototype.update();
      input.up = true;
      break;
    case 37:
    case 65:
      this.state = "moving";
      console.log("Left pushed. State is " + this.state);
      this.prototype.update();
      input.left = true;
      break;
    case 39:
    case 68:
      this.state = "moving";
      console.log("Right pushed. State is " + this.state);
      this.prototype.update();
      input.right = true;
      break;
    case 40:
    case 83:
      this.state = "moving";
      console.log("Down pushed. State is " + this.state);
      this.prototype.update();
      input.down = true;
      break;
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
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
        if (input.up)
        {
          player.y = player.y - 80;
          console.log(player.x + " " + player.y);
        }
        else if (input.down)
        {
          player.y = player.y + 80;
          console.log(player.x + " " + player.y);
        }
        else if (input.right)
        {
          player.x = player.x + 75;
          console.log(player.x + " " + player.y);
        }
        else if (input.left)
        {
          player.x = player.y - 75;
          console.log(player.x + " " + player.y);
        }
      break;
      case "dead":
      break;
    // TODO: Implement your player's update by state
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
      ctx.rect(this.x,this.y,this.width,this.height);
      ctx.stroke();
      break;
    // TODO: Implement your player's rendering according to state
    case "moving":
    ctx.rect(this.x,this.y,this.width,this.height);
    ctx.stroke();
    break;
    case "dead":
    ctx.rect(this.x,this.y,this.width,this.height);
    ctx.stroke();
    break;
  }
}
