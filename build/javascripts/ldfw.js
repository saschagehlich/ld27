;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Actor, Node,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Node = require("./node.coffee");

Actor = (function(_super) {
  __extends(Actor, _super);

  /*
   * @param  [Game] game
  */


  function Actor(game) {
    this.game = game;
    Actor.__super__.constructor.apply(this, arguments);
  }

  /*
   * Called at the beginning of every tick, update properties and do
   * calculations in here
   * @param  [Number] delta
  */


  Actor.prototype.update = function(delta) {};

  /*
   * Called after update, draw stuff here
   * @param  [CanvasRenderingContext2D] context
  */


  Actor.prototype.draw = function(context) {};

  return Actor;

})(Node);

module.exports = Actor;


},{"./node.coffee":11}],2:[function(require,module,exports){
var Game,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Game = (function() {
  function Game(wrapper) {
    this.wrapper = wrapper;
    this.tick = __bind(this.tick, this);
    this.canvas = this.wrapper.find("canvas").get(0);
    this.setSize(this.wrapper.width(), this.wrapper.height());
    this.context = this.canvas.getContext("2d");
    this.running = false;
    this.setupStats();
  }

  Game.prototype.clearScreen = function() {
    return this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  /*
   * Sets the canvas size
  */


  Game.prototype.setSize = function(width, height) {
    this.canvas.width = width;
    return this.canvas.height = height;
  };

  Game.prototype.getWidth = function() {
    return this.canvas.width;
  };

  Game.prototype.getHeight = function() {
    return this.canvas.height;
  };

  Game.prototype.getWrapper = function() {
    return this.wrapper;
  };

  /*
   * Sets up mrdoob's stats library
  */


  Game.prototype.setupStats = function() {
    var dom;
    this.fpsStats = new Stats();
    this.fpsStats.setMode(0);
    dom = $(this.fpsStats.domElement);
    dom.css({
      position: "absolute",
      left: -dom.width(),
      top: 0
    });
    this.wrapper.append(this.fpsStats.domElement);
    this.fpsMsStats = new Stats();
    this.fpsMsStats.setMode(1);
    dom = $(this.fpsMsStats.domElement);
    dom.css({
      position: "absolute",
      left: -dom.width(),
      top: 50
    });
    this.wrapper.append(this.fpsMsStats.domElement);
    this.tickStats = new Stats();
    this.tickStats.setMode(1);
    dom = $(this.tickStats.domElement);
    dom.css({
      position: "absolute",
      left: -dom.width(),
      top: 100
    });
    return this.wrapper.append(this.tickStats.domElement);
  };

  /*
   * Stats the game's run loop
  */


  Game.prototype.run = function() {
    this.running = true;
    this.lastTick = new Date();
    return requestAnimFrame(this.tick);
  };

  /*
   * Stops / pauses the game's run loop
  */


  Game.prototype.stop = function() {
    return this.running = false;
  };

  /*
   * Our main game loop
  */


  Game.prototype.tick = function() {
    var delta, _ref, _ref1;
    delta = (Date.now() - this.lastTick) / 1000;
    this.lastTick = Date.now();
    this.tickStats.begin();
    if ((_ref = this.screen) != null) {
      _ref.update(delta);
    }
    this.tickStats.end();
    this.fpsStats.begin();
    this.fpsMsStats.begin();
    this.clearScreen();
    if ((_ref1 = this.screen) != null) {
      _ref1.draw(this.context);
    }
    this.fpsStats.end();
    this.fpsMsStats.end();
    if (this.running) {
      return requestAnimFrame(this.tick);
    }
  };

  return Game;

})();

module.exports = Game;


},{}],3:[function(require,module,exports){
var AnimSprite, Sprite, Vector2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Vector2 = require("../math/vector2.coffee");

Sprite = require("./sprite.coffee");

AnimSprite = (function(_super) {
  __extends(AnimSprite, _super);

  function AnimSprite(textureAtlas, frame, spriteCount, animationInterval) {
    this.textureAtlas = textureAtlas;
    this.frame = frame;
    this.spriteCount = spriteCount;
    this.animationInterval = animationInterval;
    AnimSprite.__super__.constructor.apply(this, arguments);
    this.rotation = 0;
    this.sumDelta = 0;
    this.spriteIndex = 0;
  }

  AnimSprite.prototype.getWidth = function() {
    return this.frame.frame.w * this.scale.x;
  };

  AnimSprite.prototype.getHeight = function() {
    return this.frame.frame.h * this.scale.y;
  };

  AnimSprite.prototype.getRotation = function() {
    return this.rotation;
  };

  AnimSprite.prototype.setRotation = function(rotation) {
    return this.rotation = rotation;
  };

  AnimSprite.prototype.update = function(delta) {
    if (this.sumDelta >= this.animationInterval) {
      this.spriteIndex++;
      if (this.spriteIndex > this.spriteCount - 1) {
        this.spriteIndex = 0;
      }
      this.sumDelta -= this.animationInterval;
    }
    return this.sumDelta += delta;
  };

  /*
   * Draws the sprite on the given context
   * @param  [CanvasRenderingContext2D] context
  */


  AnimSprite.prototype.draw = function(context, drawX, drawY, mirrored) {
    var dh, dw, image, sh, sw, sx, sy, tx, ty, widthPerSprite;
    if (mirrored == null) {
      mirrored = false;
    }
    image = this.textureAtlas.getAtlasImage();
    widthPerSprite = Math.floor(this.frame.frame.w / this.spriteCount);
    sx = this.frame.frame.x;
    sy = this.frame.frame.y;
    sw = widthPerSprite;
    sh = this.frame.frame.h;
    sx += widthPerSprite * this.spriteIndex;
    dw = widthPerSprite * this.scale.x;
    dh = this.frame.frame.h * this.scale.y;
    context.save();
    tx = (drawX | this.position.x) + this.origin.x + Sprite.renderOffset.x;
    ty = (drawY | this.position.y) + this.origin.y + Sprite.renderOffset.y;
    if (mirrored) {
      context.translate(tx + dw, ty);
      context.scale(-1, 1);
    } else {
      context.translate(tx, ty);
    }
    context.rotate(Math.PI / 180 * this.rotation);
    context.drawImage(image, sx, sy, sw, sh, -this.origin.x, -this.origin.y, dw, dh);
    return context.restore();
  };

  return AnimSprite;

})(Sprite);

module.exports = AnimSprite;


},{"../math/vector2.coffee":10,"./sprite.coffee":5}],4:[function(require,module,exports){
var BitmapFont, Rectangle;

Rectangle = require("../math/rectangle.coffee");

BitmapFont = (function() {
  function BitmapFont(fontFile, textureRegion) {
    this.fontFile = fontFile;
    this.textureRegion = textureRegion;
    this.chars = {};
    this.parseFontFile();
  }

  /*
   * Parses the font file and stores the character information
   * in the chars instance variable
  */


  BitmapFont.prototype.parseFontFile = function() {
    var char, key, line, parameter, split, val, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
    _ref = this.fontFile.split("\n");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      split = line.split(" ");
      if (split[0] === "char") {
        char = {};
        _ref1 = split.slice(1, -1);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          parameter = _ref1[_j];
          _ref2 = parameter.split("="), key = _ref2[0], val = _ref2[1];
          char[key] = parseInt(val);
        }
        _results.push(this.chars[char.id] = char);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  BitmapFont.prototype.getBounds = function(text) {
    var char, charCode, character, height, i, width, _i, _ref;
    width = 0;
    height = 0;
    for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      character = text.substr(i, 1);
      charCode = character.charCodeAt(0);
      if (this.chars[charCode] == null) {
        continue;
      }
      char = this.chars[charCode];
      width += char.xadvance;
      height = char.height;
    }
    return new Rectangle(0, 0, width, height);
  };

  /*
   * Draws the text on the given canvas
   * @param  {CanvasRenderingContext2D} context
   * @param  {String} text
   * @param  {Number} x
   * @param  {Number} y
  */


  BitmapFont.prototype.drawText = function(context, text, x, y) {
    var char, charCode, character, i, xOffset, _i, _ref, _results;
    xOffset = 0;
    _results = [];
    for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      character = text.substr(i, 1);
      charCode = character.charCodeAt(0);
      if (this.chars[charCode] == null) {
        continue;
      }
      char = this.chars[charCode];
      this.textureRegion.draw(context, char.x, char.y, char.width, char.height, x + xOffset + char.xoffset || 0, y + char.yoffset || 0);
      _results.push(xOffset += char.xadvance);
    }
    return _results;
  };

  return BitmapFont;

})();

module.exports = BitmapFont;


},{"../math/rectangle.coffee":9}],5:[function(require,module,exports){
var Node, Sprite, Vector2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Vector2 = require("../math/vector2.coffee");

Node = require("../node.coffee");

Sprite = (function(_super) {
  __extends(Sprite, _super);

  /*
   * A Sprite represents a drawable image
   * @param  [TextureAtlas] @TextureAtlas
  */


  Sprite.renderOffset = new Vector2(0, 0);

  function Sprite(textureAtlas, frame) {
    this.textureAtlas = textureAtlas;
    this.frame = frame;
    Sprite.__super__.constructor.apply(this, arguments);
    this.rotation = 0;
  }

  Sprite.prototype.getWidth = function() {
    return this.frame.frame.w * this.scale.x;
  };

  Sprite.prototype.getHeight = function() {
    return this.frame.frame.h * this.scale.y;
  };

  Sprite.prototype.getRotation = function() {
    return this.rotation;
  };

  Sprite.prototype.setRotation = function(rotation) {
    return this.rotation = rotation;
  };

  /*
   * Draws the sprite on the given context
   * @param  [CanvasRenderingContext2D] context
  */


  Sprite.prototype.draw = function(context, drawX, drawY, mirrored) {
    var dh, dw, image, sh, sw, sx, sy, tx, ty;
    if (mirrored == null) {
      mirrored = false;
    }
    image = this.textureAtlas.getAtlasImage();
    sx = this.frame.frame.x;
    sy = this.frame.frame.y;
    sw = this.frame.frame.w;
    sh = this.frame.frame.h;
    dw = this.frame.frame.w * this.scale.x;
    dh = this.frame.frame.h * this.scale.y;
    context.save();
    tx = (drawX | this.position.x) + this.origin.x + Sprite.renderOffset.x;
    ty = (drawY | this.position.y) + this.origin.y + Sprite.renderOffset.y;
    if (mirrored) {
      context.translate(tx + dw, ty);
      context.scale(-1, 1);
    } else {
      context.translate(tx, ty);
    }
    context.rotate(Math.PI / 180 * this.rotation);
    context.drawImage(image, sx, sy, sw, sh, -this.origin.x, -this.origin.y, dw, dh);
    return context.restore();
  };

  return Sprite;

})(Node);

module.exports = Sprite;


},{"../math/vector2.coffee":10,"../node.coffee":11}],6:[function(require,module,exports){
var AnimSprite, Sprite, TextureAtlas, TextureRegion;

Sprite = require("./sprite.coffee");

AnimSprite = require("./animsprite.coffee");

TextureRegion = require("./textureregion.coffee");

TextureAtlas = (function() {
  function TextureAtlas(frames, image) {
    this.frames = frames;
    this.image = image;
    return;
  }

  /*
   * Creates a new Sprite object from the given filename
   * @param  [String] filename
   * @return [Sprite]
  */


  TextureAtlas.prototype.createSprite = function(filename) {
    var sprite;
    if (this.frames[filename] == null) {
      throw new Error("The sprite " + filename + " could not be found.");
    }
    sprite = new Sprite(this, this.frames[filename]);
    return sprite;
  };

  /*
   * Creates a new AnimSprite object from the given filename
   * @param  [String] filename
   * @param  [Number] spriteCount
   * @return [AnimSprite]
  */


  TextureAtlas.prototype.createAnimSprite = function(filename, spriteCount, animationInterval) {
    var sprite;
    if (this.frames[filename] == null) {
      throw new Error("The sprite " + filename + " could not be found.");
    }
    sprite = new AnimSprite(this, this.frames[filename], spriteCount, animationInterval);
    return sprite;
  };

  /*
   * Creates a new TextureRegion object from the given filename
   * @param  [String] filename
   * @return [TextureRegion]
  */


  TextureAtlas.prototype.findRegion = function(filename) {
    var region;
    if (this.frames[filename] == null) {
      throw new Error("The region " + filename + " could not be found.");
    }
    region = new TextureRegion(this, this.frames[filename]);
    return region;
  };

  TextureAtlas.prototype.getAtlasImage = function() {
    return this.image;
  };

  return TextureAtlas;

})();

module.exports = TextureAtlas;


},{"./animsprite.coffee":3,"./sprite.coffee":5,"./textureregion.coffee":7}],7:[function(require,module,exports){
var TextureRegion, Vector2;

Vector2 = require("../math/vector2.coffee");

TextureRegion = (function() {
  function TextureRegion(atlas, frame) {
    this.atlas = atlas;
    this.frame = frame;
    this.image = this.atlas.getAtlasImage();
  }

  /*
   * Draws the given rectangle of the region to the given location
   * @param  {CanvasRenderingContext2d} context
   * @param  {Number} sx
   * @param  {Number} sy
   * @param  {Number} sw
   * @param  {Number} sh
   * @param  {Number} dx
   * @param  {Number} dy
  */


  TextureRegion.prototype.draw = function(context, sx, sy, sw, sh, dx, dy) {
    return context.drawImage(this.image, this.frame.frame.x + sx, this.frame.frame.y + sy, Math.min(sw, (this.frame.spriteSourceSize.w + this.frame.frame.x) - (this.frame.frame.x + sx)), Math.min(sh, (this.frame.spriteSourceSize.h + this.frame.frame.y) - (this.frame.frame.y + sy)), dx, dy, Math.min(sw, (this.frame.spriteSourceSize.w + this.frame.frame.x) - (this.frame.frame.x + sx)), Math.min(sh, (this.frame.spriteSourceSize.h + this.frame.frame.y) - (this.frame.frame.y + sy)));
  };

  return TextureRegion;

})();

module.exports = TextureRegion;


},{"../math/vector2.coffee":10}],8:[function(require,module,exports){
window.LDFW = {
  Game: require("./game.coffee"),
  Screen: require("./screen.coffee"),
  Actor: require("./actor.coffee"),
  Stage: require("./stage.coffee"),
  Node: require("./node.coffee"),
  TextureAtlas: require("./graphics/textureatlas.coffee"),
  TextureRegion: require("./graphics/textureregion.coffee"),
  Sprite: require("./graphics/sprite.coffee"),
  BitmapFont: require("./graphics/bitmapfont.coffee"),
  Vector2: require("./math/vector2.coffee"),
  Preloader: require("./utilities/preloader.coffee")
};


},{"./actor.coffee":1,"./game.coffee":2,"./graphics/bitmapfont.coffee":4,"./graphics/sprite.coffee":5,"./graphics/textureatlas.coffee":6,"./graphics/textureregion.coffee":7,"./math/vector2.coffee":10,"./node.coffee":11,"./screen.coffee":12,"./stage.coffee":13,"./utilities/preloader.coffee":14}],9:[function(require,module,exports){
var Rectangle, Vector2;

Vector2 = require("./vector2.coffee");

Rectangle = (function() {
  function Rectangle(x, y, width, height) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    this.width = width != null ? width : 0;
    this.height = height != null ? height : 0;
    this.position = new Vector2(x, y);
  }

  /*
   * Sets the position
  */


  Rectangle.prototype.setPosition = function() {
    return this.position.set.call(this, arguments);
  };

  /*
   * Sets the size values
   * @param [Number] width
   * @param [Number] height
  */


  Rectangle.prototype.setSize = function(width, height) {
    this.width = width;
    return this.height = height;
  };

  Rectangle.prototype.getWidth = function() {
    return this.width;
  };

  Rectangle.prototype.getHeight = function() {
    return this.height;
  };

  return Rectangle;

})();

module.exports = Rectangle;


},{"./vector2.coffee":10}],10:[function(require,module,exports){
var Vector2;

Vector2 = (function() {
  function Vector2(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    return;
  }

  /*
   * Sets the new position of the Vector2
   * @param [Number] x
   * @param [Number] y
  */


  Vector2.prototype.set = function(x, y) {
    var otherV2;
    if (x instanceof Vector2) {
      otherV2 = x;
      this.x = otherV2.x;
      this.y = otherV2.y;
    } else {
      this.x = x;
      this.y = y;
    }
    return this;
  };

  /*
   * Returns a clone of this Vector
   * @return {Vector2}
  */


  Vector2.prototype.clone = function() {
    return new Vector2(this.x, this.y);
  };

  /*
   * Floors the values of this Vector
  */


  Vector2.prototype.floor = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  };

  /*
   * Rounds the values of this Vector
  */


  Vector2.prototype.round = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  };

  /*
   * Substracts the given values from this Vector
   * @param [Number] x
   * @param [Number] y
  */


  Vector2.prototype.substract = function(x, y) {
    var v2;
    if (x instanceof Vector2) {
      v2 = x;
      x = v2.getX();
      y = v2.getY();
    } else if ((x != null) && (y == null)) {
      y = x;
    }
    this.x = this.x - x;
    this.y = this.y - y;
    return this;
  };

  /*
   * Adds the given values to this Vector
   * @param [Number] x
   * @param [Number] y
  */


  Vector2.prototype.add = function(x, y) {
    var v2;
    if (x instanceof Vector2) {
      v2 = x;
      x = v2.getX();
      y = v2.getY();
    } else if ((x != null) && (y == null)) {
      y = x;
    }
    this.x = this.x + x;
    this.y = this.y + y;
    return this;
  };

  /*
   * Divides this Vector by the given values
   * @param [Number] x
   * @param [Number] y
  */


  Vector2.prototype.divideBy = function(x, y) {
    var v2;
    if (x instanceof Vector2) {
      v2 = x;
      x = v2.getX();
      y = v2.getY();
    } else if ((x != null) && (y == null)) {
      y = x;
    }
    this.x = this.x / x;
    this.y = this.y / y;
    return this;
  };

  /*
   * Multiplies this Vector with the given values
   * @param [Number] x
   * @param [Number] y
  */


  Vector2.prototype.multiply = function(x, y) {
    var v2;
    if (x instanceof Vector2) {
      v2 = x;
      x = v2.getX();
      y = v2.getY();
    } else if ((x != null) && (y == null)) {
      y = x;
    }
    this.x = this.x * x;
    this.y = this.y * y;
    return this;
  };

  /*
   * Returns the x value
   * @return [Number]
  */


  Vector2.prototype.getX = function() {
    return this.x;
  };

  /*
   * Returns the y value
   * @return [Number]
  */


  Vector2.prototype.getY = function() {
    return this.y;
  };

  /*
   * Sets the x value
   * @param [Number] x
  */


  Vector2.prototype.setX = function(x) {
    return this.x = x;
  };

  /*
   * Sets the y value
   * @param [Number] y
  */


  Vector2.prototype.setY = function(y) {
    return this.y = y;
  };

  return Vector2;

})();

module.exports = Vector2;


},{}],11:[function(require,module,exports){
var Node, Rectangle, Vector2;

Vector2 = require("./math/vector2.coffee");

Rectangle = require("./math/rectangle.coffee");

Node = (function() {
  function Node(game) {
    this.game = game;
    this.origin = new Vector2();
    this.position = new Vector2();
    this.scale = new Vector2(1, 1);
    this.rect = new Rectangle();
  }

  /*
    Position
  */


  Node.prototype.getPosition = function() {
    return this.position;
  };

  Node.prototype.setPosition = function(x, y) {
    return this.position.set(x, y);
  };

  Node.prototype.getX = function() {
    return this.position.getX();
  };

  Node.prototype.setX = function(x) {
    return this.position.setX(x);
  };

  Node.prototype.getY = function() {
    return this.position.getY();
  };

  Node.prototype.setY = function(y) {
    return this.position.setY(y);
  };

  /*
    Scale
  */


  Node.prototype.getScale = function() {
    return this.scale;
  };

  Node.prototype.setScale = function(x, y) {
    return this.scale.set(x, y);
  };

  Node.prototype.getScaleX = function() {
    return this.scale.getX();
  };

  Node.prototype.setScaleX = function(x) {
    return this.scale.setX(x);
  };

  Node.prototype.getScaleY = function() {
    return this.scale.getY();
  };

  Node.prototype.setScaleY = function(y) {
    return this.scale.setY(y);
  };

  /*
    Origin
  */


  Node.prototype.getOrigin = function() {
    return this.origin;
  };

  Node.prototype.setOrigin = function(x, y) {
    return this.origin.set(x, y);
  };

  Node.prototype.getOriginX = function() {
    return this.scale.getX();
  };

  Node.prototype.setOriginX = function(x) {
    return this.origin.setX(x);
  };

  Node.prototype.getOriginY = function() {
    return this.origin.getY();
  };

  Node.prototype.setOriginY = function(y) {
    return this.origin.setY(y);
  };

  /*
    Size
  */


  Node.prototype.getSize = function() {
    return this.rect.getSize();
  };

  Node.prototype.setSize = function(width, height) {
    return this.rect.setSize(width, height);
  };

  Node.prototype.getWidth = function() {
    return this.rect.getWidth();
  };

  Node.prototype.getHeight = function() {
    return this.rect.getHeight();
  };

  return Node;

})();

module.exports = Node;


},{"./math/rectangle.coffee":9,"./math/vector2.coffee":10}],12:[function(require,module,exports){
var Screen;

Screen = (function() {
  /*
   * @param  [Game] game
  */

  function Screen(game) {
    this.game = game;
    return;
  }

  /*
   * Called at the beginning of every tick, update properties and do
   * calculations in here
   * @param  [Number] delta
  */


  Screen.prototype.update = function(delta) {};

  /*
   * Called after update, draw stuff here
   * @param  [CanvasRenderingContext2D] context
  */


  Screen.prototype.draw = function(context) {};

  return Screen;

})();

module.exports = Screen;


},{}],13:[function(require,module,exports){
var Stage;

Stage = (function() {
  /*
   * @param  [Game] game
  */

  function Stage(game) {
    this.game = game;
    this.actors = [];
  }

  /*
   * Adds a new actor to the list
   * @param [Actor] actor
  */


  Stage.prototype.addActor = function(actor) {
    return this.actors.push(actor);
  };

  /*
   * Removes an actor from the list
   * @param  [Actor] actor
  */


  Stage.prototype.removeActor = function(actor) {
    var index;
    index = this.actors.indexOf(actor);
    if (index >= 0) {
      return this.actors.splice(index, 1);
    }
  };

  /*
   * Called at the beginning of every tick, update properties and do
   * calculations in here
   * @param  [Number] delta
  */


  Stage.prototype.update = function(delta) {
    var actor, _i, _len, _ref, _results;
    _ref = this.actors;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      actor = _ref[_i];
      _results.push(actor.update(delta));
    }
    return _results;
  };

  /*
   * Called after update, draw stuff here
   * @param  [CanvasRenderingContext2D] context
  */


  Stage.prototype.draw = function(context) {
    var actor, _i, _len, _ref, _results;
    _ref = this.actors;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      actor = _ref[_i];
      _results.push(actor.draw(context));
    }
    return _results;
  };

  return Stage;

})();

module.exports = Stage;


},{}],14:[function(require,module,exports){
var EventEmitter, Preloader, async,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require("events").EventEmitter;

async = require("../vendor/async.js");

Preloader = (function(_super) {
  __extends(Preloader, _super);

  function Preloader(itemFilenames) {
    this.itemFilenames = itemFilenames;
    this.loadJPEG = __bind(this.loadJPEG, this);
    this.loadJPG = __bind(this.loadJPG, this);
    this.loadPNG = __bind(this.loadPNG, this);
    this.loadItem = __bind(this.loadItem, this);
    this.items = {};
  }

  /*
   * Starts the loading process
  */


  Preloader.prototype.load = function() {
    var _this = this;
    return async.map(this.itemFilenames, this.loadItem, function(err, items) {
      var item, _i, _len;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        _this.items[item.filename] = item.item;
      }
      return _this.emit("done");
    });
  };

  /*
   * Returns the item for the given filename
  */


  Preloader.prototype.get = function(filename) {
    if (this.items[filename] == null) {
      throw new Error("The file " + filename + " has not been preloaded!");
    }
    return this.items[filename];
  };

  /*
   * Initiates the loading process for the given filename
   * @param  [String] filename
   * @param  [Function] callback
   * @private
  */


  Preloader.prototype.loadItem = function(filename, callback) {
    var extension, loadingMethod;
    extension = filename.split(".").pop();
    loadingMethod = this["load" + extension.toUpperCase()];
    if (loadingMethod == null) {
      throw new Error("No loading method for " + filename);
    }
    return loadingMethod(filename, callback);
  };

  /*
   * Loads a JSON file via AJAX
   * @param  [String] filename
   * @param  [Function] callback
   * @private
  */


  Preloader.prototype.loadJSON = function(filename, callback) {
    return $.getJSON(filename, function(data) {
      return callback(null, {
        filename: filename,
        item: data
      });
    });
  };

  /*
   * Loads a FNT file via AJAX
   * @param  [String]   filename
   * @param  [Function] callback
  */


  Preloader.prototype.loadFNT = function(filename, callback) {
    return $.get(filename, function(data) {
      return callback(null, {
        filename: filename,
        item: data
      });
    });
  };

  /*
   * Loads an image item
   * @param  [String] filename
   * @param  [Function] callback
   * @private
  */


  Preloader.prototype.loadImage = function(filename, callback) {
    var image;
    image = new Image();
    image.onload = function() {
      return callback(null, {
        filename: filename,
        item: image
      });
    };
    return image.src = filename;
  };

  Preloader.prototype.loadPNG = function() {
    return this.loadImage.apply(this, arguments);
  };

  Preloader.prototype.loadJPG = function() {
    return this.loadImage.apply(this, arguments);
  };

  Preloader.prototype.loadJPEG = function() {
    return this.loadImage.apply(this, arguments);
  };

  return Preloader;

})(EventEmitter);

module.exports = Preloader;


},{"../vendor/async.js":15,"events":16}],15:[function(require,module,exports){
var process=require("__browserify_process");/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = setImmediate;
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

},{"__browserify_process":17}],16:[function(require,module,exports){
var process=require("__browserify_process");if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (typeof emitter._events[type] === 'function')
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

},{"__browserify_process":17}],17:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[8])
;