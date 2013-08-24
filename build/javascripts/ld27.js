;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LevelActor, PLATFORM_HEIGHT,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PLATFORM_HEIGHT = 16;

LevelActor = (function(_super) {
  __extends(LevelActor, _super);

  function LevelActor(app, game) {
    this.app = app;
    this.game = game;
    LevelActor.__super__.constructor.call(this, this.game);
    this.level = this.game.getLevel();
  }

  LevelActor.prototype.draw = function(context) {
    var platform, platforms, scroll, _i, _len, _results;
    platforms = this.level.getPlatforms();
    scroll = this.level.getScroll();
    _results = [];
    for (_i = 0, _len = platforms.length; _i < _len; _i++) {
      platform = platforms[_i];
      context.save();
      context.fillStyle = "red";
      context.fillRect(platform.position.x - this.level.getScroll().x, platform.position.y - this.level.getScroll().y, platform.width, PLATFORM_HEIGHT);
      _results.push(context.restore());
    }
    return _results;
  };

  return LevelActor;

})(LDFW.Actor);

module.exports = LevelActor;


},{}],2:[function(require,module,exports){
var PLAYER_HEIGHT, PLAYER_WIDTH, PlayerActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PLAYER_WIDTH = 32;

PLAYER_HEIGHT = 64;

PlayerActor = (function(_super) {
  __extends(PlayerActor, _super);

  function PlayerActor(app, game) {
    this.app = app;
    PlayerActor.__super__.constructor.call(this, this.app);
    this.game = game;
    this.level = this.game.getLevel();
    this.player = this.game.getPlayer();
  }

  PlayerActor.prototype.update = function(delta) {};

  PlayerActor.prototype.draw = function(context) {
    var playerPosition, scroll;
    playerPosition = this.player.getPosition();
    scroll = this.level.getScroll();
    context.save();
    context.fillStyle = "green";
    context.fillRect(playerPosition.x - scroll.getX(), playerPosition.y - PLAYER_HEIGHT - scroll.getY(), PLAYER_WIDTH, PLAYER_HEIGHT);
    return context.restore();
  };

  return PlayerActor;

})(LDFW.Actor);

module.exports = PlayerActor;


},{}],3:[function(require,module,exports){
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


},{"./ld27.coffee":5}],4:[function(require,module,exports){
var Game, Keyboard, Level, Player;

Level = require("./level.coffee");

Player = require("./player.coffee");

Keyboard = require("./utilities/keyboard.coffee");

Game = (function() {
  function Game(app) {
    var firstPlatform;
    this.app = app;
    this.keyboard = new Keyboard();
    this.level = new Level(this.app, this);
    this.player = new Player(this.app, this);
    firstPlatform = this.level.getPlatforms()[0];
    this.player.setPosition(firstPlatform.position.x, firstPlatform.position.y - 100);
  }

  Game.prototype.update = function(delta) {
    this.level.update(delta);
    return this.player.update(delta);
  };

  Game.prototype.getLevel = function() {
    return this.level;
  };

  Game.prototype.getPlayer = function() {
    return this.player;
  };

  Game.prototype.getKeyboard = function() {
    return this.keyboard;
  };

  return Game;

})();

module.exports = Game;


},{"./level.coffee":6,"./player.coffee":7,"./utilities/keyboard.coffee":10}],5:[function(require,module,exports){
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


},{"./screens/gamescreen.coffee":8}],6:[function(require,module,exports){
var Level;

Level = (function() {
  function Level(app, game) {
    this.app = app;
    this.game = game;
    this.scroll = new LDFW.Vector2();
    this.gravity = 8;
    this.platforms = [
      {
        position: new LDFW.Vector2(10, 400),
        width: 300
      }
    ];
  }

  Level.prototype.update = function(delta) {};

  Level.prototype.getScroll = function() {
    return this.scroll;
  };

  Level.prototype.getPlatforms = function() {
    return this.platforms;
  };

  Level.prototype.getGravity = function() {
    return this.gravity;
  };

  return Level;

})();

module.exports = Level;


},{}],7:[function(require,module,exports){
var Player;

Player = (function() {
  function Player(app, game) {
    this.app = app;
    this.game = game;
    this.keyboard = this.game.getKeyboard();
    this.speedX = 3;
    this.velocityX = 0;
    this.position = new LDFW.Vector2();
    this.level = this.game.getLevel();
  }

  Player.prototype.update = function(delta) {
    /*
     * Keyboard handling
    */

    var gravity, maxY, platform, platforms, w, x, _i, _len;
    if (this.keyboard.pressed(this.keyboard.Keys.RIGHT) || this.keyboard.pressed(this.keyboard.Keys.D)) {
      this.velocityX = 1;
    } else if (this.keyboard.pressed(this.keyboard.Keys.LEFT) || this.keyboard.pressed(this.keyboard.Keys.A)) {
      this.velocityX = -1;
    } else {
      this.velocityX = 0;
    }
    /*
     * Move!
    */

    this.position.setX(this.position.getX() + (this.speedX * this.velocityX));
    gravity = this.level.getGravity();
    this.position.setY(this.position.getY() + gravity);
    maxY = this.app.getHeight() * 2;
    platforms = this.level.getPlatforms();
    x = this.position.getX();
    w = 32;
    for (_i = 0, _len = platforms.length; _i < _len; _i++) {
      platform = platforms[_i];
      if (!(platform.position.x > x + w || platform.position.x + platform.width < x)) {
        maxY = platform.position.y;
      }
    }
    if (this.position.getY() > maxY) {
      this.position.setY(maxY);
    }
    /*
     * Boundaries
    */

    if (this.position.getX() < this.level.getScroll().x) {
      return this.position.setX(this.level.getScroll().x);
    }
  };

  Player.prototype.getPosition = function() {
    return this.position;
  };

  Player.prototype.setPosition = function() {
    return this.position.set.apply(this.position, arguments);
  };

  return Player;

})();

module.exports = Player;


},{}],8:[function(require,module,exports){
var Game, GameScreen, GameStage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameStage = require("../stages/gamestage.coffee");

Game = require("../game.coffee");

GameScreen = (function(_super) {
  __extends(GameScreen, _super);

  function GameScreen(app) {
    this.app = app;
    GameScreen.__super__.constructor.call(this, this.app);
    this.game = new Game(this.game);
    this.gameStage = new GameStage(this.app, this.game);
  }

  GameScreen.prototype.update = function(delta) {
    this.game.update(delta);
    this.gameStage.update(delta);
  };

  GameScreen.prototype.draw = function(context) {
    this.gameStage.draw(context);
  };

  return GameScreen;

})(LDFW.Screen);

module.exports = GameScreen;


},{"../game.coffee":4,"../stages/gamestage.coffee":9}],9:[function(require,module,exports){
var GameStage, LevelActor, PlayerActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlayerActor = require("../actors/playeractor.coffee");

LevelActor = require("../actors/levelactor.coffee");

GameStage = (function(_super) {
  __extends(GameStage, _super);

  function GameStage(app, game) {
    this.app = app;
    this.game = game;
    GameStage.__super__.constructor.call(this, this.game);
    this.playerActor = new PlayerActor(this.app, this.game);
    this.addActor(this.playerActor);
    this.levelActor = new LevelActor(this.app, this.game);
    this.addActor(this.levelActor);
  }

  return GameStage;

})(LDFW.Stage);

module.exports = GameStage;


},{"../actors/levelactor.coffee":1,"../actors/playeractor.coffee":2}],10:[function(require,module,exports){
var Keyboard,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Keyboard = (function() {
  Keyboard.prototype.Keys = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32,
    ESC: 27
  };

  function Keyboard() {
    this.onKeyUp = __bind(this.onKeyUp, this);
    this.onKeyDown = __bind(this.onKeyDown, this);
    var key, keyCode, _ref;
    this.keyStates = [];
    _ref = this.Keys;
    for (key in _ref) {
      keyCode = _ref[key];
      this.keyStates[keyCode] = false;
    }
    $(window).keydown(this.onKeyDown);
    $(window).keyup(this.onKeyUp);
  }

  Keyboard.prototype.onKeyDown = function(e) {
    var keyCode;
    keyCode = e.keyCode;
    if (this.keyStates[keyCode] != null) {
      return this.keyStates[keyCode] = true;
    }
  };

  Keyboard.prototype.onKeyUp = function(e) {
    var keyCode;
    keyCode = e.keyCode;
    if (this.keyStates[keyCode] != null) {
      return this.keyStates[keyCode] = false;
    }
  };

  Keyboard.prototype.pressed = function(keyCode) {
    return this.keyStates[keyCode] | false;
  };

  return Keyboard;

})();

module.exports = Keyboard;


},{}]},{},[3])
;