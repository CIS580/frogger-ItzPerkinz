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
