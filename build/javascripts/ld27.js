;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LD27;

LD27 = require("./ld27.coffee");

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();

$(function() {
  var game, wrapper;
  wrapper = $(".canvas-wrapper");
  return game = new LD27(wrapper);
});


},{"./ld27.coffee":2}],2:[function(require,module,exports){
var GameScreen, LD27,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameScreen = require("./screens/gamescreen.coffee");

LD27 = (function(_super) {
  __extends(LD27, _super);

  function LD27() {
    var _this = this;
    LD27.__super__.constructor.apply(this, arguments);
    this.preloader = new LDFW.Preloader(["assets/sprites.json", "assets/sprites.png"]);
    this.preloader.on("done", function() {
      var spritesImage, spritesJSON;
      spritesJSON = _this.preloader.get("assets/sprites.json");
      spritesImage = _this.preloader.get("assets/sprites.png");
      _this.spritesAtlas = new LDFW.TextureAtlas(spritesJSON.frames, spritesImage);
      _this.screen = new GameScreen(_this);
      return _this.run();
    });
    this.preloader.load();
  }

  /*
   * Getters / setters
  */


  LD27.prototype.getSpritesAtlas = function() {
    return this.spritesAtlas;
  };

  return LD27;

})(LDFW.Game);

module.exports = LD27;


},{"./screens/gamescreen.coffee":5}],3:[function(require,module,exports){
var Ball,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Ball = (function(_super) {
  __extends(Ball, _super);

  function Ball() {
    Ball.__super__.constructor.apply(this, arguments);
    this.spritesAtlas = this.game.getSpritesAtlas();
    this.sprite = this.spritesAtlas.createSprite("ball.png");
    this.speedX = 4;
    this.speedY = 4;
  }

  Ball.prototype.update = function(delta) {
    var gameHeight, gameWidth;
    this.setPosition(this.getX() + this.speedX, this.getY() + this.speedY);
    this.sprite.setPosition(this.getPosition());
    gameWidth = this.game.getWidth();
    gameHeight = this.game.getHeight();
    if (this.getX() >= gameWidth - this.sprite.getWidth() || this.getX() <= 0) {
      this.speedX *= -1;
    }
    if (this.getY() >= gameHeight - this.sprite.getHeight() || this.getY() <= 0) {
      return this.speedY *= -1;
    }
  };

  Ball.prototype.draw = function(context) {
    return this.sprite.draw(context);
  };

  return Ball;

})(LDFW.Actor);

module.exports = Ball;


},{}],4:[function(require,module,exports){
var Player,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Player = (function(_super) {
  __extends(Player, _super);

  function Player() {
    Player.__super__.constructor.apply(this, arguments);
    this.spritesAtlas = this.game.getSpritesAtlas();
    this.sprite = this.spritesAtlas.createSprite("player.png");
    this.setSize(this.sprite.getWidth(), this.sprite.getHeight());
  }

  Player.prototype.update = function(delta) {
    return this.sprite.setPosition(this.getPosition());
  };

  Player.prototype.draw = function(context) {
    return this.sprite.draw(context);
  };

  return Player;

})(LDFW.Actor);

module.exports = Player;


},{}],5:[function(require,module,exports){
var GameScreen, GameStage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameStage = require("../stages/gamestage.coffee");

GameScreen = (function(_super) {
  __extends(GameScreen, _super);

  function GameScreen(game) {
    this.game = game;
    this.spriteAtlas = this.game.getSpritesAtlas();
    this.gameStage = new GameStage(this.game);
    GameScreen.__super__.constructor.apply(this, arguments);
  }

  GameScreen.prototype.update = function(delta) {
    return this.gameStage.update(delta);
  };

  GameScreen.prototype.draw = function(context) {
    this.gameStage.draw(context);
  };

  return GameScreen;

})(LDFW.Screen);

module.exports = GameScreen;


},{"../stages/gamestage.coffee":6}],6:[function(require,module,exports){
var Ball, GameStage, Player,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Ball = require("../mobs/ball.coffee");

Player = require("../mobs/player.coffee");

GameStage = (function(_super) {
  __extends(GameStage, _super);

  function GameStage() {
    var distanceToBoundaries, player;
    GameStage.__super__.constructor.apply(this, arguments);
    this.ball = new Ball(this.game);
    this.ball.setPosition(this.game.getWidth() / 2, this.game.getHeight() / 2);
    this.addActor(this.ball);
    this.players = [];
    distanceToBoundaries = 30;
    player = new Player(this.game);
    player.setPosition(distanceToBoundaries, this.game.getHeight() / 2 - player.getHeight() / 2);
    this.players.push(player);
    this.addActor(player);
    player = new Player(this.game);
    player.setPosition(this.game.getWidth() - player.getWidth() - distanceToBoundaries, this.game.getHeight() / 2 - player.getHeight() / 2);
    this.players.push(player);
    this.addActor(player);
  }

  return GameStage;

})(LDFW.Stage);

module.exports = GameStage;


},{"../mobs/ball.coffee":3,"../mobs/player.coffee":4}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZ2FtZS9hcHBsaWNhdGlvbi5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZ2FtZS9sZDI3LmNvZmZlZSIsIi9Vc2Vycy9zYXNjaGFnZWhsaWNoL2RldmVsb3BtZW50L2pzL2xkMjcvY29mZmVlc2NyaXB0cy9nYW1lL21vYnMvYmFsbC5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZ2FtZS9tb2JzL3BsYXllci5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZ2FtZS9zY3JlZW5zL2dhbWVzY3JlZW4uY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2dhbWUvc3RhZ2VzL2dhbWVzdGFnZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsQ0FBQSxFQUFPLENBQVAsR0FBTyxRQUFBOztBQUVQLENBRkEsRUFFMEIsR0FBcEIsR0FBcUIsT0FBM0I7Q0FDRSxFQUdRLENBRkEsRUFETSxFQUdOLENBSEEsWUFBQSxHQUFBLEdBQUE7Q0FJUyxDQUFxQixDQUFPLENBQVAsRUFBdEIsRUFBTixFQUFBLENBQUE7Q0FKVixFQUdRO0NBSmlCOztBQVEzQixDQVZBLEVBVUUsTUFBQTtDQUNBLEtBQUEsT0FBQTtDQUFBLENBQUEsQ0FBVSxJQUFWLFVBQVU7Q0FFTSxFQUFMLENBQVgsR0FBVyxFQUFYO0NBSEE7Ozs7QUNWRixJQUFBLFlBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQWUsSUFBQSxHQUFmLG1CQUFlOztBQUVULENB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WCxDQUFOLEdBZkE7Ozs7QUNBQSxJQUFBLG1CQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFTLENBQVQsR0FBUyxjQUFBOztBQUNULENBREEsRUFDUyxHQUFULENBQVMsZ0JBQUE7O0FBRUgsQ0FITjtDQUlFOztDQUFhLENBQUEsQ0FBQSxnQkFBQTtDQUNYLE9BQUEsb0JBQUE7Q0FBQSxHQUFBLEtBQUEsbUNBQUE7Q0FBQSxFQUVZLENBQVo7Q0FGQSxDQUd3QyxDQUFILENBQXJDLElBQWtCLENBQXNCLEVBQXhDO0NBSEEsR0FJQSxJQUFBO0NBSkEsQ0FBQSxDQU1XLENBQVgsR0FBQTtDQU5BLENBQUEsQ0FRdUIsQ0FBdkIsZ0JBQUE7Q0FSQSxFQVVhLENBQWIsRUFBQTtDQVZBLENBYUUsQ0FBb0IsQ0FGdEIsRUFBTSxHQUVKLEVBRkYsU0FBQTtDQVhBLEdBZUEsRUFBQSxDQUFRO0NBZlIsR0FnQkEsRUFBQSxFQUFBO0NBaEJBLEVBa0JhLENBQWIsRUFBQTtDQWxCQSxDQXFCRSxDQURtQixDQURyQixFQUFNLEVBQ0osQ0FDQSxFQUZGLFNBQUE7Q0FuQkEsR0F1QkEsRUFBQSxDQUFRO0NBdkJSLEdBd0JBLEVBQUEsRUFBQTtDQXpCRixFQUFhOztDQUFiOztDQURzQixHQUFJOztBQTRCNUIsQ0EvQkEsRUErQmlCLEdBQVgsQ0FBTixFQS9CQSIsInNvdXJjZXNDb250ZW50IjpbIkxEMjcgPSByZXF1aXJlIFwiLi9sZDI3LmNvZmZlZVwiXG5cbndpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gKC0+XG4gIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgICAgICAgKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQgY2FsbGJhY2ssIDEwMDAgLyA2MFxuICApKClcblxuJCAtPlxuICB3cmFwcGVyID0gJChcIi5jYW52YXMtd3JhcHBlclwiKVxuXG4gIGdhbWUgPSBuZXcgTEQyNyh3cmFwcGVyKVxuIiwiR2FtZVNjcmVlbiAgID0gcmVxdWlyZSBcIi4vc2NyZWVucy9nYW1lc2NyZWVuLmNvZmZlZVwiXG5cbmNsYXNzIExEMjcgZXh0ZW5kcyBMREZXLkdhbWVcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcblxuICAgIEBwcmVsb2FkZXIgPSBuZXcgTERGVy5QcmVsb2FkZXIgW1xuICAgICAgXCJhc3NldHMvc3ByaXRlcy5qc29uXCIsXG4gICAgICBcImFzc2V0cy9zcHJpdGVzLnBuZ1wiXG4gICAgXVxuICAgIEBwcmVsb2FkZXIub24gXCJkb25lXCIsID0+XG4gICAgICBzcHJpdGVzSlNPTiA9IEBwcmVsb2FkZXIuZ2V0IFwiYXNzZXRzL3Nwcml0ZXMuanNvblwiXG4gICAgICBzcHJpdGVzSW1hZ2UgPSBAcHJlbG9hZGVyLmdldCBcImFzc2V0cy9zcHJpdGVzLnBuZ1wiXG5cbiAgICAgIEBzcHJpdGVzQXRsYXMgPSBuZXcgTERGVy5UZXh0dXJlQXRsYXMgc3ByaXRlc0pTT04uZnJhbWVzLCBzcHJpdGVzSW1hZ2VcbiAgICAgIEBzY3JlZW4gICAgICAgPSBuZXcgR2FtZVNjcmVlbiB0aGlzXG4gICAgICBAcnVuKClcbiAgICBAcHJlbG9hZGVyLmxvYWQoKVxuXG4gICMjI1xuICAgKiBHZXR0ZXJzIC8gc2V0dGVyc1xuICAjIyNcbiAgZ2V0U3ByaXRlc0F0bGFzOiAtPiByZXR1cm4gQHNwcml0ZXNBdGxhc1xuXG5tb2R1bGUuZXhwb3J0cyA9IExEMjdcbiIsImNsYXNzIEJhbGwgZXh0ZW5kcyBMREZXLkFjdG9yXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAc3ByaXRlc0F0bGFzID0gQGdhbWUuZ2V0U3ByaXRlc0F0bGFzKClcbiAgICBAc3ByaXRlID0gQHNwcml0ZXNBdGxhcy5jcmVhdGVTcHJpdGUgXCJiYWxsLnBuZ1wiXG5cbiAgICBAc3BlZWRYID0gNFxuICAgIEBzcGVlZFkgPSA0XG5cbiAgdXBkYXRlOiAoZGVsdGEpIC0+XG4gICAgQHNldFBvc2l0aW9uKFxuICAgICAgQGdldFgoKSArIEBzcGVlZFgsXG4gICAgICBAZ2V0WSgpICsgQHNwZWVkWVxuICAgIClcbiAgICBAc3ByaXRlLnNldFBvc2l0aW9uIEBnZXRQb3NpdGlvbigpXG5cbiAgICBnYW1lV2lkdGggPSBAZ2FtZS5nZXRXaWR0aCgpXG4gICAgZ2FtZUhlaWdodCA9IEBnYW1lLmdldEhlaWdodCgpXG4gICAgaWYgQGdldFgoKSA+PSBnYW1lV2lkdGggLSBAc3ByaXRlLmdldFdpZHRoKCkgb3JcbiAgICAgIEBnZXRYKCkgPD0gMFxuICAgICAgICBAc3BlZWRYICo9IC0xXG5cbiAgICBpZiBAZ2V0WSgpID49IGdhbWVIZWlnaHQgLSBAc3ByaXRlLmdldEhlaWdodCgpIG9yXG4gICAgICBAZ2V0WSgpIDw9IDBcbiAgICAgICAgQHNwZWVkWSAqPSAtMVxuXG4gIGRyYXc6IChjb250ZXh0KSAtPlxuICAgIEBzcHJpdGUuZHJhdyBjb250ZXh0XG5cbm1vZHVsZS5leHBvcnRzID0gQmFsbFxuIiwiY2xhc3MgUGxheWVyIGV4dGVuZHMgTERGVy5BY3RvclxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuXG4gICAgQHNwcml0ZXNBdGxhcyA9IEBnYW1lLmdldFNwcml0ZXNBdGxhcygpXG4gICAgQHNwcml0ZSAgICAgICA9IEBzcHJpdGVzQXRsYXMuY3JlYXRlU3ByaXRlIFwicGxheWVyLnBuZ1wiXG5cbiAgICBAc2V0U2l6ZSBAc3ByaXRlLmdldFdpZHRoKCksIEBzcHJpdGUuZ2V0SGVpZ2h0KClcblxuICB1cGRhdGU6IChkZWx0YSkgLT5cbiAgICBAc3ByaXRlLnNldFBvc2l0aW9uIEBnZXRQb3NpdGlvbigpXG5cbiAgZHJhdzogKGNvbnRleHQpIC0+XG4gICAgQHNwcml0ZS5kcmF3IGNvbnRleHRcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJcbiIsIkdhbWVTdGFnZSA9IHJlcXVpcmUgXCIuLi9zdGFnZXMvZ2FtZXN0YWdlLmNvZmZlZVwiXG5cbmNsYXNzIEdhbWVTY3JlZW4gZXh0ZW5kcyBMREZXLlNjcmVlblxuICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxuICAgIEBzcHJpdGVBdGxhcyA9IEBnYW1lLmdldFNwcml0ZXNBdGxhcygpXG4gICAgQGdhbWVTdGFnZSA9IG5ldyBHYW1lU3RhZ2UgQGdhbWVcbiAgICBzdXBlclxuXG4gIHVwZGF0ZTogKGRlbHRhKSAtPlxuICAgIEBnYW1lU3RhZ2UudXBkYXRlIGRlbHRhXG5cbiAgZHJhdzogKGNvbnRleHQpIC0+XG4gICAgQGdhbWVTdGFnZS5kcmF3IGNvbnRleHRcbiAgICByZXR1cm5cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU2NyZWVuXG4iLCJCYWxsICAgPSByZXF1aXJlIFwiLi4vbW9icy9iYWxsLmNvZmZlZVwiXG5QbGF5ZXIgPSByZXF1aXJlIFwiLi4vbW9icy9wbGF5ZXIuY29mZmVlXCJcblxuY2xhc3MgR2FtZVN0YWdlIGV4dGVuZHMgTERGVy5TdGFnZVxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuXG4gICAgQGJhbGwgPSBuZXcgQmFsbCBAZ2FtZVxuICAgIEBiYWxsLnNldFBvc2l0aW9uIEBnYW1lLmdldFdpZHRoKCkgLyAyLCBAZ2FtZS5nZXRIZWlnaHQoKSAvIDJcbiAgICBAYWRkQWN0b3IgQGJhbGxcblxuICAgIEBwbGF5ZXJzID0gW11cblxuICAgIGRpc3RhbmNlVG9Cb3VuZGFyaWVzID0gMzBcblxuICAgIHBsYXllciA9IG5ldyBQbGF5ZXIgQGdhbWVcbiAgICBwbGF5ZXIuc2V0UG9zaXRpb24oXG4gICAgICBkaXN0YW5jZVRvQm91bmRhcmllcyxcbiAgICAgIEBnYW1lLmdldEhlaWdodCgpIC8gMiAtIHBsYXllci5nZXRIZWlnaHQoKSAvIDJcbiAgICApXG4gICAgQHBsYXllcnMucHVzaCBwbGF5ZXJcbiAgICBAYWRkQWN0b3IgcGxheWVyXG5cbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyIEBnYW1lXG4gICAgcGxheWVyLnNldFBvc2l0aW9uKFxuICAgICAgQGdhbWUuZ2V0V2lkdGgoKSAtIHBsYXllci5nZXRXaWR0aCgpIC0gZGlzdGFuY2VUb0JvdW5kYXJpZXMsXG4gICAgICBAZ2FtZS5nZXRIZWlnaHQoKSAvIDIgLSBwbGF5ZXIuZ2V0SGVpZ2h0KCkgLyAyXG4gICAgKVxuICAgIEBwbGF5ZXJzLnB1c2ggcGxheWVyXG4gICAgQGFkZEFjdG9yIHBsYXllclxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGFnZVxuIl19
;