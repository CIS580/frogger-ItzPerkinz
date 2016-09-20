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
  this.speed = Math.floor(Math.random()*this.level+1);
}

var monsterSprite = new Image();
monsterSprite.src = "assets/monster.png";

Monster.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  this.y = Math.ceil(this.y + this.speed);


}

Monster.prototype.render = function(time, ctx) {
  ctx.drawImage(
    monsterSprite, this.x, this.y-3
  );
  //ctx.fillRect(this.x, this.y, this.width, this.height);

}
