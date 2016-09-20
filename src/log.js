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
  this.speed = Math.floor(Math.random()*this.level+1);

}

var logSprite = new Image();
logSprite.src = "assets/log.png";

Log.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  this.y = Math.ceil(this.y + this.speed);
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
