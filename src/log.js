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
