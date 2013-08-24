;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LevelActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LevelActor = (function(_super) {
  __extends(LevelActor, _super);

  function LevelActor(app, game) {
    this.app = app;
    this.game = game;
    LevelActor.__super__.constructor.call(this, this.game);
    this.level = this.game.getLevel();
  }

  LevelActor.prototype.draw = function(context) {
    context.save();
    this.drawPlatforms(context);
    this.drawBlocks(context);
    this.drawBuildBlock(context);
    return context.restore();
  };

  LevelActor.prototype.drawPlatforms = function(context) {
    var platform, platforms, scroll, _i, _len, _results;
    platforms = this.level.getPlatforms();
    scroll = this.level.getScroll();
    _results = [];
    for (_i = 0, _len = platforms.length; _i < _len; _i++) {
      platform = platforms[_i];
      context.fillStyle = "red";
      _results.push(context.fillRect(platform.position.x - this.level.getScroll().x, platform.position.y - this.level.getScroll().y, platform.width, platform.height));
    }
    return _results;
  };

  LevelActor.prototype.drawBuildBlock = function(context) {
    var blocks, scroll;
    if (!this.level.inBuildMode()) {
      return;
    }
    scroll = this.level.getScroll();
    blocks = this.level.getBlocks();
    return this.drawBlock(this.level.getBuildBlock(), context);
  };

  LevelActor.prototype.drawBlocks = function(context) {
    var block, blocks, scroll, _i, _len, _results;
    scroll = this.level.getScroll();
    blocks = this.level.getBlocks();
    _results = [];
    for (_i = 0, _len = blocks.length; _i < _len; _i++) {
      block = blocks[_i];
      _results.push(this.drawBlock(block, context));
    }
    return _results;
  };

  LevelActor.prototype.drawBlock = function(block, context) {
    var map, position, row, scroll, segment, x, y, _i, _len, _results;
    scroll = this.level.getScroll();
    map = block.getMap();
    position = block.getGridPosition().clone().multiply(this.level.GRID_SIZE).substract(scroll);
    _results = [];
    for (y = _i = 0, _len = map.length; _i < _len; y = ++_i) {
      row = map[y];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (x = _j = 0, _len1 = row.length; _j < _len1; x = ++_j) {
          segment = row[x];
          if (segment === 0) {
            continue;
          }
          context.fillStyle = "blue";
          _results1.push(context.fillRect(position.x + x * this.level.GRID_SIZE, position.y + y * this.level.GRID_SIZE, this.level.GRID_SIZE, this.level.GRID_SIZE));
        }
        return _results1;
      }).call(this));
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


},{"./ld27.coffee":7}],4:[function(require,module,exports){
module.exports=module.exports=[
  [
    [ 1, 1, 1, 1 ]
  ],
  [
    [ 1, 0, 0 ],
    [ 1, 1, 1 ]
  ],
  [
    [ 0, 0, 1 ],
    [ 1, 1, 1 ]
  ],
  [
    [ 1, 1 ],
    [ 1, 1 ]
  ],
  [
    [ 0, 1, 1 ],
    [ 1, 1, 0 ]
  ],
  [
    [ 0, 1, 0 ],
    [ 1, 1, 1 ]
  ],
  [
    [ 1, 1, 0 ],
    [ 0, 1, 1 ]
  ],
]

},{}],5:[function(require,module,exports){
var Block;

Block = (function() {
  Block.prototype.availableBlocks = require("../config/available_blocks.json");

  function Block(app, game, options) {
    this.app = app;
    this.game = game;
    this.options = options != null ? options : {};
    this.buildMode = this.options.buildMode | false;
    this.map = null;
    this.rotation = 0;
    this.gridPosition = new LDFW.Vector2();
    this.randomize();
  }

  Block.prototype.randomize = function() {
    var index;
    index = Math.floor(Math.random() * this.availableBlocks.length);
    return this.map = this.availableBlocks[index];
  };

  Block.prototype.getGridPosition = function() {
    return this.gridPosition;
  };

  Block.prototype.setGridPosition = function() {
    return this.gridPosition.set.apply(this.gridPosition, arguments);
  };

  Block.prototype.getMap = function() {
    return this.map;
  };

  Block.prototype.getRotation = function() {
    return this.rotation;
  };

  return Block;

})();

module.exports = Block;


},{"../config/available_blocks.json":4}],6:[function(require,module,exports){
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


},{"./level.coffee":8,"./player.coffee":9,"./utilities/keyboard.coffee":12}],7:[function(require,module,exports){
var GameScreen, LD27, Mouse,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameScreen = require("./screens/gamescreen.coffee");

Mouse = require("./utilities/mouse.coffee");

LD27 = (function(_super) {
  __extends(LD27, _super);

  function LD27() {
    var _this = this;
    LD27.__super__.constructor.apply(this, arguments);
    this.mouse = new Mouse(this);
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

  LD27.prototype.getMouse = function() {
    return this.mouse;
  };

  return LD27;

})(LDFW.Game);

module.exports = LD27;


},{"./screens/gamescreen.coffee":10,"./utilities/mouse.coffee":13}],8:[function(require,module,exports){
var Block, Level;

Block = require("./entities/block.coffee");

Level = (function() {
  Level.prototype.GRID_SIZE = 32;

  function Level(app, game) {
    var block;
    this.app = app;
    this.game = game;
    this.buildMode = true;
    this.buildBlock = new Block(this.app, this.game, {
      buildMode: true
    });
    this.mouse = this.app.getMouse();
    this.scroll = new LDFW.Vector2();
    this.gravity = new LDFW.Vector2(0, 1800);
    this.platforms = [
      {
        position: new LDFW.Vector2(10, 400),
        width: 300,
        height: 16
      }, {
        position: new LDFW.Vector2(10, 100),
        width: 300,
        height: 16
      }
    ];
    block = new Block(this.app, this.game);
    block.setGridPosition(5, 10);
    this.blocks = [block];
  }

  Level.prototype.update = function(delta) {
    var blockMap, gridPosition, mousePosition;
    mousePosition = this.mouse.getPosition();
    blockMap = this.buildBlock.getMap();
    gridPosition = mousePosition.clone().add(this.scroll).substract(blockMap[0].length * this.GRID_SIZE / 2, blockMap.length * this.GRID_SIZE / 2).divideBy(this.GRID_SIZE).round();
    return this.buildBlock.setGridPosition(gridPosition);
  };

  Level.prototype.getBoundariesForPlayer = function(player) {
    var block, boundaries, map, platform, playerHeight, playerWidth, position, row, segment, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
    playerWidth = 32;
    playerHeight = 64;
    player = {
      top: player.getPosition().getY() - playerHeight,
      bottom: player.getPosition().getY(),
      left: player.getPosition().getX(),
      right: player.getPosition().getX() + playerWidth
    };
    boundaries = {
      x: {
        min: 0,
        max: player.left + this.app.getWidth()
      },
      y: {
        min: -this.app.getHeight(),
        max: this.app.getHeight() * 2
      }
    };
    _ref = this.platforms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      platform = _ref[_i];
      platform = {
        top: platform.position.y,
        bottom: platform.position.y + platform.height,
        left: platform.position.x,
        right: platform.position.x + platform.width
      };
      if (!(player.bottom <= platform.top || player.top >= platform.bottom)) {
        if (player.right <= platform.left) {
          boundaries.x.max = Math.min(platform.left, boundaries.x.max);
        } else if (player.left >= platform.right) {
          boundaries.x.min = Math.max(platform.right, boundaries.x.min);
        }
      }
      if (!(player.right < platform.left || player.left > platform.right || player.bottom > platform.top)) {
        boundaries.y.max = Math.min(platform.top, boundaries.y.max);
      }
    }
    _ref1 = this.blocks;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      block = _ref1[_j];
      map = block.getMap();
      position = block.getGridPosition().clone().multiply(this.GRID_SIZE);
      for (y = _k = 0, _len2 = map.length; _k < _len2; y = ++_k) {
        row = map[y];
        for (x = _l = 0, _len3 = row.length; _l < _len3; x = ++_l) {
          segment = row[x];
          if (segment === 0) {
            continue;
          }
          segment = {
            left: position.getX() + x * this.GRID_SIZE,
            right: position.getX() + (x + 1) * this.GRID_SIZE,
            top: position.getY() + y * this.GRID_SIZE,
            bottom: position.getY() + (y + 1) * this.GRID_SIZE
          };
          if (!(player.bottom <= segment.top || player.top >= segment.bottom)) {
            if (player.right <= segment.left) {
              boundaries.x.max = Math.min(segment.left, boundaries.x.max);
            } else if (player.left >= segment.right) {
              boundaries.x.min = Math.max(segment.right, boundaries.x.min);
            }
          }
          if (!(player.left > segment.right || player.right < segment.left || player.bottom > segment.top)) {
            boundaries.y.max = Math.min(segment.top, boundaries.y.max);
          }
        }
      }
    }
    return boundaries;
  };

  Level.prototype.getScroll = function() {
    return this.scroll;
  };

  Level.prototype.getPlatforms = function() {
    return this.platforms;
  };

  Level.prototype.getBlocks = function() {
    return this.blocks;
  };

  Level.prototype.getGravity = function() {
    return this.gravity;
  };

  Level.prototype.inBuildMode = function() {
    return this.buildMode;
  };

  Level.prototype.getBuildBlock = function() {
    return this.buildBlock;
  };

  return Level;

})();

module.exports = Level;


},{"./entities/block.coffee":5}],9:[function(require,module,exports){
var JUMP_FORCE, Player, SPEED_X;

JUMP_FORCE = -700;

SPEED_X = 300;

Player = (function() {
  function Player(app, game) {
    this.app = app;
    this.game = game;
    this.keyboard = this.game.getKeyboard();
    this.velocity = new LDFW.Vector2();
    this.position = new LDFW.Vector2();
    this.level = this.game.getLevel();
    this.onGround = false;
  }

  Player.prototype.update = function(delta) {
    var aspiredPosition, boundaries;
    this.handleKeyboard();
    aspiredPosition = this.getAspiredPosition(delta);
    boundaries = this.level.getBoundariesForPlayer(this);
    this.handleXMovement(aspiredPosition, boundaries);
    this.handleYMovement(aspiredPosition, boundaries);
    return this.position.set(aspiredPosition);
  };

  Player.prototype.getAspiredPosition = function(delta) {
    var gravity, gravityStep, velocityStep;
    gravity = this.level.getGravity().clone();
    gravityStep = gravity.multiply(delta);
    this.velocity.add(gravityStep);
    velocityStep = this.velocity.clone().multiply(delta);
    return this.position.clone().add(velocityStep);
  };

  Player.prototype.handleXMovement = function(aspiredPosition, boundaries) {
    if (aspiredPosition.getX() < this.level.getScroll().x) {
      aspiredPosition.setX(this.level.getScroll().x);
    }
    if (aspiredPosition.getX() <= boundaries.x.min) {
      return aspiredPosition.setX(boundaries.x.min);
    } else if (aspiredPosition.getX() + this.getWidth() >= boundaries.x.max) {
      return aspiredPosition.setX(boundaries.x.max - this.getWidth());
    }
  };

  Player.prototype.handleYMovement = function(aspiredPosition, boundaries) {
    if (aspiredPosition.getY() > boundaries.y.max) {
      aspiredPosition.setY(boundaries.y.max);
    }
    if (aspiredPosition.getY() >= boundaries.y.max) {
      this.jumping = false;
      this.onGround = true;
      return this.velocity.setY(0);
    } else {
      return this.onGround = false;
    }
  };

  Player.prototype.handleKeyboard = function() {
    if (this.keyboard.pressed(this.keyboard.Keys.RIGHT) || this.keyboard.pressed(this.keyboard.Keys.D)) {
      this.velocity.setX(SPEED_X);
    } else if (this.keyboard.pressed(this.keyboard.Keys.LEFT) || this.keyboard.pressed(this.keyboard.Keys.A)) {
      this.velocity.setX(-SPEED_X);
    } else {
      this.velocity.setX(0);
    }
    if (this.keyboard.upPressed() && this.onGround) {
      return this.velocity.setY(JUMP_FORCE);
    }
  };

  Player.prototype.getWidth = function() {
    return 32;
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


},{}],10:[function(require,module,exports){
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


},{"../game.coffee":6,"../stages/gamestage.coffee":11}],11:[function(require,module,exports){
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


},{"../actors/levelactor.coffee":1,"../actors/playeractor.coffee":2}],12:[function(require,module,exports){
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

  Keyboard.prototype.upPressed = function() {
    return this.keyStates[this.Keys.UP] || this.keyStates[this.Keys.W] || this.keyStates[this.Keys.SPACE];
  };

  return Keyboard;

})();

module.exports = Keyboard;


},{}],13:[function(require,module,exports){
var Mouse,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Mouse = (function() {
  function Mouse(app) {
    this.app = app;
    this.onMouseMove = __bind(this.onMouseMove, this);
    this.position = new LDFW.Vector2();
    this.app.getWrapper().mousemove(this.onMouseMove);
  }

  Mouse.prototype.onMouseMove = function(e) {
    return this.position.set(e.offsetX, e.offsetY);
  };

  Mouse.prototype.getPosition = function() {
    return this.position;
  };

  return Mouse;

})();

module.exports = Mouse;


},{}]},{},[3])
;