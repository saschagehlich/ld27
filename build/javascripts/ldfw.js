;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Actor, Node,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Node = require("./node.coffee");

Actor = (function(_super) {
  __extends(Actor, _super);

  /*
   * @param  {Game} game
  */


  function Actor(game) {
    this.game = game;
    Actor.__super__.constructor.apply(this, arguments);
  }

  /*
   * Called at the beginning of every tick, update properties and do
   * calculations in here
   * @param  {Number} delta
  */


  Actor.prototype.update = function(delta) {};

  /*
   * Called after update, draw stuff here
   * @param  {CanvasRenderingContext2D} context
  */


  Actor.prototype.draw = function(context) {};

  return Actor;

})(Node);

module.exports = Actor;


},{"./node.coffee":8}],2:[function(require,module,exports){
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

  /*
   * Sets up mrdoob's stats library
  */


  Game.prototype.setupStats = function() {
    var dom;
    this.stats = new Stats();
    this.stats.setMode(0);
    dom = $(this.stats.domElement);
    dom.css({
      position: "absolute",
      left: -dom.width(),
      top: 0
    });
    return this.wrapper.append(this.stats.domElement);
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
    this.stats.begin();
    delta = (new Date() - this.lastTick) / 1000;
    this.clearScreen();
    if ((_ref = this.screen) != null) {
      _ref.update(delta);
    }
    if ((_ref1 = this.screen) != null) {
      _ref1.draw(this.context);
    }
    this.stats.end();
    this.lastTick = new Date();
    if (this.running) {
      return requestAnimFrame(this.tick);
    }
  };

  return Game;

})();

module.exports = Game;


},{}],3:[function(require,module,exports){
var Node, Sprite, Vector2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Vector2 = require("../math/vector2.coffee");

Node = require("../node.coffee");

Sprite = (function(_super) {
  __extends(Sprite, _super);

  /*
   * A Sprite represents a drawable image
   * @param  {TextureAtlas} @TextureAtlas
  */


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
   * @param  {CanvasRenderingContext2D} context
  */


  Sprite.prototype.draw = function(context) {
    var dh, dw, image, sh, sw, sx, sy;
    image = this.textureAtlas.getAtlasImage();
    sx = this.frame.frame.x;
    sy = this.frame.frame.y;
    sw = this.frame.frame.w;
    sh = this.frame.frame.h;
    dw = this.frame.frame.w * this.scale.x;
    dh = this.frame.frame.h * this.scale.y;
    context.save();
    context.translate(this.position.x + this.origin.x, this.position.y + this.origin.y);
    context.rotate(Math.PI / 180 * this.rotation);
    context.drawImage(image, sx, sy, sw, sh, -this.origin.x, -this.origin.y, dw, dh);
    return context.restore();
  };

  return Sprite;

})(Node);

module.exports = Sprite;


},{"../math/vector2.coffee":7,"../node.coffee":8}],4:[function(require,module,exports){
var Sprite, TextureAtlas;

Sprite = require("./sprite.coffee");

TextureAtlas = (function() {
  function TextureAtlas(frames, image) {
    this.frames = frames;
    this.image = image;
    return;
  }

  /*
   * Creates a new Sprite object from the given filename
   * @param  {String} filename
   * @return {Sprite}
  */


  TextureAtlas.prototype.createSprite = function(filename) {
    var sprite;
    if (this.frames[filename] == null) {
      throw new Error("The sprite " + filename + " could not be found.");
    }
    sprite = new Sprite(this, this.frames[filename]);
    return sprite;
  };

  TextureAtlas.prototype.getAtlasImage = function() {
    return this.image;
  };

  return TextureAtlas;

})();

module.exports = TextureAtlas;


},{"./sprite.coffee":3}],5:[function(require,module,exports){
window.LDFW = {
  Game: require("./game.coffee"),
  Screen: require("./screen.coffee"),
  Actor: require("./actor.coffee"),
  Stage: require("./stage.coffee"),
  Node: require("./node.coffee"),
  TextureAtlas: require("./graphics/textureatlas.coffee"),
  Sprite: require("./graphics/sprite.coffee"),
  Vector2: require("./math/vector2.coffee"),
  Preloader: require("./utilities/preloader.coffee")
};


},{"./actor.coffee":1,"./game.coffee":2,"./graphics/sprite.coffee":3,"./graphics/textureatlas.coffee":4,"./math/vector2.coffee":7,"./node.coffee":8,"./screen.coffee":9,"./stage.coffee":10,"./utilities/preloader.coffee":11}],6:[function(require,module,exports){
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
   * @param {Number} width
   * @param {Number} height
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


},{"./vector2.coffee":7}],7:[function(require,module,exports){
var Vector2;

Vector2 = (function() {
  function Vector2(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    return;
  }

  /*
   * Sets the new position of the Vector2
   * @param {Number} x
   * @param {Number} y
  */


  Vector2.prototype.set = function(x, y) {
    var otherV2;
    if (x instanceof Vector2) {
      otherV2 = x;
      this.x = otherV2.x;
      return this.y = otherV2.y;
    } else {
      this.x = x;
      return this.y = y;
    }
  };

  /*
   * Returns the x value
   * @return {Number}
  */


  Vector2.prototype.getX = function() {
    return this.x;
  };

  /*
   * Returns the y value
   * @return {Number}
  */


  Vector2.prototype.getY = function() {
    return this.y;
  };

  /*
   * Sets the x value
   * @param {Number} x
  */


  Vector2.prototype.setX = function(x) {
    return this.x = x;
  };

  /*
   * Sets the y value
   * @param {Number} y
  */


  Vector2.prototype.setY = function(y) {
    return this.y = y;
  };

  return Vector2;

})();

module.exports = Vector2;


},{}],8:[function(require,module,exports){
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


},{"./math/rectangle.coffee":6,"./math/vector2.coffee":7}],9:[function(require,module,exports){
var Screen;

Screen = (function() {
  /*
   * @param  {Game} game
  */

  function Screen(game) {
    this.game = game;
    return;
  }

  /*
   * Called at the beginning of every tick, update properties and do
   * calculations in here
   * @param  {Number} delta
  */


  Screen.prototype.update = function(delta) {};

  /*
   * Called after update, draw stuff here
   * @param  {CanvasRenderingContext2D} context
  */


  Screen.prototype.draw = function(context) {};

  return Screen;

})();

module.exports = Screen;


},{}],10:[function(require,module,exports){
var Stage;

Stage = (function() {
  /*
   * @param  {Game} game
  */

  function Stage(game) {
    this.game = game;
    this.actors = [];
  }

  /*
   * Adds a new actor to the list
   * @param {Actor} actor
  */


  Stage.prototype.addActor = function(actor) {
    return this.actors.push(actor);
  };

  /*
   * Removes an actor from the list
   * @param  {Actor} actor
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
   * @param  {Number} delta
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
   * @param  {CanvasRenderingContext2D} context
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


},{}],11:[function(require,module,exports){
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
   * @param  {String} filename
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

  Preloader.prototype.loadJSON = function(filename, callback) {
    return $.getJSON(filename, function(data) {
      return callback(null, {
        filename: filename,
        item: data
      });
    });
  };

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


},{"../vendor/async.js":12,"events":13}],12:[function(require,module,exports){
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

},{"__browserify_process":14}],13:[function(require,module,exports){
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

},{"__browserify_process":14}],14:[function(require,module,exports){
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

},{}]},{},[5])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL2FjdG9yLmNvZmZlZSIsIi9Vc2Vycy9zYXNjaGFnZWhsaWNoL2RldmVsb3BtZW50L2pzL2xkMjcvY29mZmVlc2NyaXB0cy9mcmFtZXdvcmsvZ2FtZS5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL2dyYXBoaWNzL3Nwcml0ZS5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL2dyYXBoaWNzL3RleHR1cmVhdGxhcy5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL2xkZncuY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2ZyYW1ld29yay9tYXRoL3JlY3RhbmdsZS5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL21hdGgvdmVjdG9yMi5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL25vZGUuY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2ZyYW1ld29yay9zY3JlZW4uY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2ZyYW1ld29yay9zdGFnZS5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL3V0aWxpdGllcy9wcmVsb2FkZXIuY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2ZyYW1ld29yay92ZW5kb3IvYXN5bmMuanMiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L25vZGVfbW9kdWxlcy9ncnVudC13YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL2V2ZW50cy5qcyIsIi9Vc2Vycy9zYXNjaGFnZWhsaWNoL2RldmVsb3BtZW50L2pzL2xkMjcvbm9kZV9tb2R1bGVzL2dydW50LXdhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxPQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFPLENBQVAsR0FBTyxRQUFBOztBQUVELENBRk47Q0FHRTs7Q0FBQTs7O0NBQUE7O0NBR2EsQ0FBQSxDQUFBLENBQUEsV0FBRTtDQUNiLEVBRGEsQ0FBRDtDQUNaLEdBQUEsS0FBQSwrQkFBQTtDQUpGLEVBR2E7O0NBR2I7Ozs7O0NBTkE7O0NBQUEsRUFXUSxFQUFBLENBQVIsR0FBUzs7Q0FHVDs7OztDQWRBOztDQUFBLEVBa0JNLENBQU4sR0FBTSxFQUFDOztDQWxCUDs7Q0FEa0I7O0FBc0JwQixDQXhCQSxFQXdCaUIsRUF4QmpCLENBd0JNLENBQU47Ozs7QUN4QkEsSUFBQTtHQUFBLCtFQUFBOztBQUFNLENBQU47Q0FDZSxDQUFBLENBQUEsSUFBQSxPQUFFO0NBQ2IsRUFEYSxDQUFELEdBQ1o7Q0FBQSxrQ0FBQTtDQUFBLEVBQVcsQ0FBWCxFQUFBLENB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJOb2RlID0gcmVxdWlyZSBcIi4vbm9kZS5jb2ZmZWVcIlxuXG5jbGFzcyBBY3RvciBleHRlbmRzIE5vZGVcbiAgIyMjXG4gICAqIEBwYXJhbSAge0dhbWV9IGdhbWVcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUpIC0+XG4gICAgc3VwZXJcblxuICAjIyNcbiAgICogQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZXZlcnkgdGljaywgdXBkYXRlIHByb3BlcnRpZXMgYW5kIGRvXG4gICAqIGNhbGN1bGF0aW9ucyBpbiBoZXJlXG4gICAqIEBwYXJhbSAge051bWJlcn0gZGVsdGFcbiAgIyMjXG4gIHVwZGF0ZTogKGRlbHRhKSAtPlxuICAgIHJldHVyblxuXG4gICMjI1xuICAgKiBDYWxsZWQgYWZ0ZXIgdXBkYXRlLCBkcmF3IHN0dWZmIGhlcmVcbiAgICogQHBhcmFtICB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjb250ZXh0XG4gICMjI1xuICBkcmF3OiAoY29udGV4dCkgLT5cbiAgICByZXR1cm5cblxubW9kdWxlLmV4cG9ydHMgPSBBY3RvclxuIiwiY2xhc3MgR2FtZVxuICBjb25zdHJ1Y3RvcjogKEB3cmFwcGVyKSAtPlxuICAgIEBjYW52YXMgID0gQHdyYXBwZXIuZmluZChcImNhbnZhc1wiKS5nZXQoMClcbiAgICBAc2V0U2l6ZSBAd3JhcHBlci53aWR0aCgpLCBAd3JhcHBlci5oZWlnaHQoKVxuXG4gICAgQGNvbnRleHQgPSBAY2FudmFzLmdldENvbnRleHQgXCIyZFwiXG4gICAgQHJ1bm5pbmcgPSBmYWxzZVxuXG4gICAgQHNldHVwU3RhdHMoKVxuXG4gIGNsZWFyU2NyZWVuOiAtPlxuICAgIEBjb250ZXh0LmNsZWFyUmVjdCAwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodFxuXG4gICMjI1xuICAgKiBTZXRzIHRoZSBjYW52YXMgc2l6ZVxuICAjIyNcbiAgc2V0U2l6ZTogKHdpZHRoLCBoZWlnaHQpIC0+XG4gICAgQGNhbnZhcy53aWR0aCAgPSB3aWR0aFxuICAgIEBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XG5cbiAgZ2V0V2lkdGg6IC0+IEBjYW52YXMud2lkdGhcbiAgZ2V0SGVpZ2h0OiAtPiBAY2FudmFzLmhlaWdodFxuXG4gICMjI1xuICAgKiBTZXRzIHVwIG1yZG9vYidzIHN0YXRzIGxpYnJhcnlcbiAgIyMjXG4gIHNldHVwU3RhdHM6IC0+XG4gICAgQHN0YXRzID0gbmV3IFN0YXRzKClcbiAgICBAc3RhdHMuc2V0TW9kZSAwXG5cbiAgICBkb20gPSAkKEBzdGF0cy5kb21FbGVtZW50KVxuICAgIGRvbS5jc3NcbiAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCJcbiAgICAgIGxlZnQ6IC1kb20ud2lkdGgoKVxuICAgICAgdG9wOiAwXG5cbiAgICBAd3JhcHBlci5hcHBlbmQgQHN0YXRzLmRvbUVsZW1lbnRcblxuICAjIyNcbiAgICogU3RhdHMgdGhlIGdhbWUncyBydW4gbG9vcFxuICAjIyNcbiAgcnVuOiAtPlxuICAgIEBydW5uaW5nID0gdHJ1ZVxuICAgIEBsYXN0VGljayA9IG5ldyBEYXRlKClcbiAgICByZXF1ZXN0QW5pbUZyYW1lIEB0aWNrXG5cbiAgIyMjXG4gICAqIFN0b3BzIC8gcGF1c2VzIHRoZSBnYW1lJ3MgcnVuIGxvb3BcbiAgIyMjXG4gIHN0b3A6IC0+XG4gICAgQHJ1bm5pbmcgPSBmYWxzZVxuXG4gICMjI1xuICAgKiBPdXIgbWFpbiBnYW1lIGxvb3BcbiAgIyMjXG4gIHRpY2s6ID0+XG4gICAgQHN0YXRzLmJlZ2luKClcblxuICAgIGRlbHRhID0gKG5ldyBEYXRlKCkgLSBAbGFzdFRpY2spIC8gMTAwMFxuICAgIEBjbGVhclNjcmVlbigpXG5cbiAgICAjIElmIHdlIGhhdmUgYSBzY3JlZW4sIG1ha2UgaXQgdGljayFcbiAgICBAc2NyZWVuPy51cGRhdGUgZGVsdGFcbiAgICBAc2NyZWVuPy5kcmF3IEBjb250ZXh0XG5cbiAgICBAc3RhdHMuZW5kKClcblxuICAgIEBsYXN0VGljayA9IG5ldyBEYXRlKClcblxuICAgIGlmIEBydW5uaW5nXG4gICAgICByZXF1ZXN0QW5pbUZyYW1lIEB0aWNrXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVxuIiwiVmVjdG9yMiA9IHJlcXVpcmUgXCIuLi9tYXRoL3ZlY3RvcjIuY29mZmVlXCJcbk5vZGUgICAgPSByZXF1aXJlIFwiLi4vbm9kZS5jb2ZmZWVcIlxuXG5jbGFzcyBTcHJpdGUgZXh0ZW5kcyBOb2RlXG4gICMjI1xuICAgKiBBIFNwcml0ZSByZXByZXNlbnRzIGEgZHJhd2FibGUgaW1hZ2VcbiAgICogQHBhcmFtICB7VGV4dHVyZUF0bGFzfSBAVGV4dHVyZUF0bGFzXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKEB0ZXh0dXJlQXRsYXMsIEBmcmFtZSkgLT5cbiAgICBzdXBlclxuXG4gICAgQHJvdGF0aW9uID0gMFxuXG4gIGdldFdpZHRoOiAtPiBAZnJhbWUuZnJhbWUudyAqIEBzY2FsZS54XG4gIGdldEhlaWdodDogLT4gQGZyYW1lLmZyYW1lLmggKiBAc2NhbGUueVxuXG4gIGdldFJvdGF0aW9uOiAtPiBAcm90YXRpb25cbiAgc2V0Um90YXRpb246IChyb3RhdGlvbikgLT4gQHJvdGF0aW9uID0gcm90YXRpb25cblxuICAjIyNcbiAgICogRHJhd3MgdGhlIHNwcml0ZSBvbiB0aGUgZ2l2ZW4gY29udGV4dFxuICAgKiBAcGFyYW0gIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHRcbiAgIyMjXG4gIGRyYXc6IChjb250ZXh0KSAtPlxuICAgIGltYWdlID0gQHRleHR1cmVBdGxhcy5nZXRBdGxhc0ltYWdlKClcblxuICAgICMgU291cmNlIHJlY3RhbmdsZVxuICAgIHN4ID0gQGZyYW1lLmZyYW1lLnhcbiAgICBzeSA9IEBmcmFtZS5mcmFtZS55XG4gICAgc3cgPSBAZnJhbWUuZnJhbWUud1xuICAgIHNoID0gQGZyYW1lLmZyYW1lLmhcblxuICAgICMgRGVzdGluYXRpb24gcmVjdGFuZ2xlXG4gICAgZHcgPSBAZnJhbWUuZnJhbWUudyAqIEBzY2FsZS54XG4gICAgZGggPSBAZnJhbWUuZnJhbWUuaCAqIEBzY2FsZS55XG5cbiAgICBjb250ZXh0LnNhdmUoKVxuXG4gICAgY29udGV4dC50cmFuc2xhdGUgQHBvc2l0aW9uLnggKyBAb3JpZ2luLngsIEBwb3NpdGlvbi55ICsgQG9yaWdpbi55XG4gICAgY29udGV4dC5yb3RhdGUgTWF0aC5QSSAvIDE4MCAqIEByb3RhdGlvblxuXG4gICAgY29udGV4dC5kcmF3SW1hZ2UgaW1hZ2UsIHN4LCBzeSwgc3csIHNoLCAtQG9yaWdpbi54LCAtQG9yaWdpbi55LCBkdywgZGhcblxuICAgIGNvbnRleHQucmVzdG9yZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlXG4iLCJTcHJpdGUgPSByZXF1aXJlIFwiLi9zcHJpdGUuY29mZmVlXCJcblxuY2xhc3MgVGV4dHVyZUF0bGFzXG4gIGNvbnN0cnVjdG9yOiAoQGZyYW1lcywgQGltYWdlKSAtPiByZXR1cm5cblxuICAjIyNcbiAgICogQ3JlYXRlcyBhIG5ldyBTcHJpdGUgb2JqZWN0IGZyb20gdGhlIGdpdmVuIGZpbGVuYW1lXG4gICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWVcbiAgICogQHJldHVybiB7U3ByaXRlfVxuICAjIyNcbiAgY3JlYXRlU3ByaXRlOiAoZmlsZW5hbWUpIC0+XG4gICAgdW5sZXNzIEBmcmFtZXNbZmlsZW5hbWVdP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHNwcml0ZSAje2ZpbGVuYW1lfSBjb3VsZCBub3QgYmUgZm91bmQuXCIpXG5cbiAgICBzcHJpdGUgPSBuZXcgU3ByaXRlKHRoaXMsIEBmcmFtZXNbZmlsZW5hbWVdKVxuICAgIHJldHVybiBzcHJpdGVcblxuICBnZXRBdGxhc0ltYWdlOiAtPiBAaW1hZ2VcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlQXRsYXNcbiIsIndpbmRvdy5MREZXID1cbiAgR2FtZTogcmVxdWlyZSBcIi4vZ2FtZS5jb2ZmZWVcIlxuICBTY3JlZW46IHJlcXVpcmUgXCIuL3NjcmVlbi5jb2ZmZWVcIlxuICBBY3RvcjogcmVxdWlyZSBcIi4vYWN0b3IuY29mZmVlXCJcbiAgU3RhZ2U6IHJlcXVpcmUgXCIuL3N0YWdlLmNvZmZlZVwiXG4gIE5vZGU6IHJlcXVpcmUgXCIuL25vZGUuY29mZmVlXCJcblxuICAjIEdyYXBoaWNzXG4gIFRleHR1cmVBdGxhczogcmVxdWlyZSBcIi4vZ3JhcGhpY3MvdGV4dHVyZWF0bGFzLmNvZmZlZVwiXG4gIFNwcml0ZTogcmVxdWlyZSBcIi4vZ3JhcGhpY3Mvc3ByaXRlLmNvZmZlZVwiXG5cbiAgIyBNYXRoXG4gIFZlY3RvcjI6IHJlcXVpcmUgXCIuL21hdGgvdmVjdG9yMi5jb2ZmZWVcIlxuXG4gICMgVXRpbGl0aWVzXG4gIFByZWxvYWRlcjogcmVxdWlyZSBcIi4vdXRpbGl0aWVzL3ByZWxvYWRlci5jb2ZmZWVcIlxuIiwiVmVjdG9yMiA9IHJlcXVpcmUgXCIuL3ZlY3RvcjIuY29mZmVlXCJcblxuY2xhc3MgUmVjdGFuZ2xlXG4gIGNvbnN0cnVjdG9yOiAoeCA9IDAsIHkgPSAwLCBAd2lkdGggPSAwLCBAaGVpZ2h0ID0gMCkgLT5cbiAgICBAcG9zaXRpb24gPSBuZXcgVmVjdG9yMih4LCB5KVxuXG4gICMjI1xuICAgKiBTZXRzIHRoZSBwb3NpdGlvblxuICAjIyNcbiAgc2V0UG9zaXRpb246IC0+IEBwb3NpdGlvbi5zZXQuY2FsbCB0aGlzLCBhcmd1bWVudHNcblxuICAjIyNcbiAgICogU2V0cyB0aGUgc2l6ZSB2YWx1ZXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgIyMjXG4gIHNldFNpemU6ICh3aWR0aCwgaGVpZ2h0KSAtPlxuICAgIEB3aWR0aCA9IHdpZHRoXG4gICAgQGhlaWdodCA9IGhlaWdodFxuXG4gIGdldFdpZHRoOiAtPiBAd2lkdGhcbiAgZ2V0SGVpZ2h0OiAtPiBAaGVpZ2h0XG5cbm1vZHVsZS5leHBvcnRzID0gUmVjdGFuZ2xlXG4iLCJjbGFzcyBWZWN0b3IyXG4gIGNvbnN0cnVjdG9yOiAoQHggPSAwLCBAeSA9IDApIC0+IHJldHVyblxuXG4gICMjI1xuICAgKiBTZXRzIHRoZSBuZXcgcG9zaXRpb24gb2YgdGhlIFZlY3RvcjJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgIyMjXG4gIHNldDogKHgsIHkpIC0+XG4gICAgaWYgeCBpbnN0YW5jZW9mIFZlY3RvcjJcbiAgICAgIG90aGVyVjIgPSB4XG5cbiAgICAgIEB4ID0gb3RoZXJWMi54XG4gICAgICBAeSA9IG90aGVyVjIueVxuICAgIGVsc2VcbiAgICAgIEB4ID0geFxuICAgICAgQHkgPSB5XG5cbiAgIyMjXG4gICAqIFJldHVybnMgdGhlIHggdmFsdWVcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAjIyNcbiAgZ2V0WDogLT4gQHhcblxuICAjIyNcbiAgICogUmV0dXJucyB0aGUgeSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICMjI1xuICBnZXRZOiAtPiBAeVxuXG4gICMjI1xuICAgKiBTZXRzIHRoZSB4IHZhbHVlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICMjI1xuICBzZXRYOiAoeCkgLT4gQHggPSB4XG5cbiAgIyMjXG4gICAqIFNldHMgdGhlIHkgdmFsdWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgIyMjXG4gIHNldFk6ICh5KSAtPiBAeSA9IHlcblxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3IyXG4iLCJWZWN0b3IyICAgPSByZXF1aXJlIFwiLi9tYXRoL3ZlY3RvcjIuY29mZmVlXCJcblJlY3RhbmdsZSA9IHJlcXVpcmUgXCIuL21hdGgvcmVjdGFuZ2xlLmNvZmZlZVwiXG5cbmNsYXNzIE5vZGVcbiAgY29uc3RydWN0b3I6IChAZ2FtZSkgLT5cbiAgICBAb3JpZ2luICAgPSBuZXcgVmVjdG9yMigpXG4gICAgQHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoKVxuICAgIEBzY2FsZSAgICA9IG5ldyBWZWN0b3IyKDEsIDEpXG4gICAgQHJlY3QgICAgID0gbmV3IFJlY3RhbmdsZSgpXG5cbiAgIyMjXG4gICAgUG9zaXRpb25cbiAgIyMjXG4gIGdldFBvc2l0aW9uOiAtPiBAcG9zaXRpb25cbiAgc2V0UG9zaXRpb246ICh4LCB5KSAtPiBAcG9zaXRpb24uc2V0IHgsIHlcblxuICBnZXRYOiAtPiBAcG9zaXRpb24uZ2V0WCgpXG4gIHNldFg6ICh4KSAtPiBAcG9zaXRpb24uc2V0WCB4XG5cbiAgZ2V0WTogLT4gQHBvc2l0aW9uLmdldFkoKVxuICBzZXRZOiAoeSkgLT4gQHBvc2l0aW9uLnNldFkgeVxuXG4gICMjI1xuICAgIFNjYWxlXG4gICMjI1xuICBnZXRTY2FsZTogLT4gQHNjYWxlXG4gIHNldFNjYWxlOiAoeCwgeSkgLT4gQHNjYWxlLnNldCB4LCB5XG5cbiAgZ2V0U2NhbGVYOiAtPiBAc2NhbGUuZ2V0WCgpXG4gIHNldFNjYWxlWDogKHgpIC0+IEBzY2FsZS5zZXRYIHhcblxuICBnZXRTY2FsZVk6IC0+IEBzY2FsZS5nZXRZKClcbiAgc2V0U2NhbGVZOiAoeSkgLT4gQHNjYWxlLnNldFkgeVxuXG4gICMjI1xuICAgIE9yaWdpblxuICAjIyNcbiAgZ2V0T3JpZ2luOiAtPiBAb3JpZ2luXG4gIHNldE9yaWdpbjogKHgsIHkpIC0+IEBvcmlnaW4uc2V0IHgsIHlcblxuICBnZXRPcmlnaW5YOiAtPiBAc2NhbGUuZ2V0WCgpXG4gIHNldE9yaWdpblg6ICh4KSAtPiBAb3JpZ2luLnNldFggeFxuXG4gIGdldE9yaWdpblk6IC0+IEBvcmlnaW4uZ2V0WSgpXG4gIHNldE9yaWdpblk6ICh5KSAtPiBAb3JpZ2luLnNldFkgeVxuXG4gICMjI1xuICAgIFNpemVcbiAgIyMjXG4gIGdldFNpemU6IC0+IEByZWN0LmdldFNpemUoKVxuICBzZXRTaXplOiAod2lkdGgsIGhlaWdodCkgLT4gQHJlY3Quc2V0U2l6ZSB3aWR0aCwgaGVpZ2h0XG5cbiAgZ2V0V2lkdGg6IC0+IEByZWN0LmdldFdpZHRoKClcbiAgZ2V0SGVpZ2h0OiAtPiBAcmVjdC5nZXRIZWlnaHQoKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZVxuIiwiY2xhc3MgU2NyZWVuXG4gICMjI1xuICAgKiBAcGFyYW0gIHtHYW1lfSBnYW1lXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxuICAgIHJldHVyblxuXG4gICMjI1xuICAgKiBDYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBldmVyeSB0aWNrLCB1cGRhdGUgcHJvcGVydGllcyBhbmQgZG9cbiAgICogY2FsY3VsYXRpb25zIGluIGhlcmVcbiAgICogQHBhcmFtICB7TnVtYmVyfSBkZWx0YVxuICAjIyNcbiAgdXBkYXRlOiAoZGVsdGEpIC0+XG4gICAgcmV0dXJuXG5cbiAgIyMjXG4gICAqIENhbGxlZCBhZnRlciB1cGRhdGUsIGRyYXcgc3R1ZmYgaGVyZVxuICAgKiBAcGFyYW0gIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHRcbiAgIyMjXG4gIGRyYXc6IChjb250ZXh0KSAtPlxuICAgIHJldHVyblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlblxuIiwiY2xhc3MgU3RhZ2VcbiAgIyMjXG4gICAqIEBwYXJhbSAge0dhbWV9IGdhbWVcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUpIC0+XG4gICAgQGFjdG9ycyA9IFtdXG5cbiAgIyMjXG4gICAqIEFkZHMgYSBuZXcgYWN0b3IgdG8gdGhlIGxpc3RcbiAgICogQHBhcmFtIHtBY3Rvcn0gYWN0b3JcbiAgIyMjXG4gIGFkZEFjdG9yOiAoYWN0b3IpIC0+XG4gICAgQGFjdG9ycy5wdXNoIGFjdG9yXG5cbiAgIyMjXG4gICAqIFJlbW92ZXMgYW4gYWN0b3IgZnJvbSB0aGUgbGlzdFxuICAgKiBAcGFyYW0gIHtBY3Rvcn0gYWN0b3JcbiAgIyMjXG4gIHJlbW92ZUFjdG9yOiAoYWN0b3IpIC0+XG4gICAgaW5kZXggPSBAYWN0b3JzLmluZGV4T2YgYWN0b3JcblxuICAgIGlmIGluZGV4ID49IDBcbiAgICAgIEBhY3RvcnMuc3BsaWNlIGluZGV4LCAxXG5cbiAgIyMjXG4gICAqIENhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGV2ZXJ5IHRpY2ssIHVwZGF0ZSBwcm9wZXJ0aWVzIGFuZCBkb1xuICAgKiBjYWxjdWxhdGlvbnMgaW4gaGVyZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGRlbHRhXG4gICMjI1xuICB1cGRhdGU6IChkZWx0YSkgLT5cbiAgICBmb3IgYWN0b3IgaW4gQGFjdG9yc1xuICAgICAgYWN0b3IudXBkYXRlIGRlbHRhXG5cbiAgIyMjXG4gICAqIENhbGxlZCBhZnRlciB1cGRhdGUsIGRyYXcgc3R1ZmYgaGVyZVxuICAgKiBAcGFyYW0gIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHRcbiAgIyMjXG4gIGRyYXc6IChjb250ZXh0KSAtPlxuICAgIGZvciBhY3RvciBpbiBAYWN0b3JzXG4gICAgICBhY3Rvci5kcmF3IGNvbnRleHRcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFnZVxuIiwie0V2ZW50RW1pdHRlcn0gPSByZXF1aXJlIFwiZXZlbnRzXCJcbmFzeW5jID0gcmVxdWlyZSBcIi4uL3ZlbmRvci9hc3luYy5qc1wiXG5cbmNsYXNzIFByZWxvYWRlciBleHRlbmRzIEV2ZW50RW1pdHRlclxuICBjb25zdHJ1Y3RvcjogKEBpdGVtRmlsZW5hbWVzKSAtPlxuICAgIEBpdGVtcyA9IHt9XG5cbiAgIyMjXG4gICAqIFN0YXJ0cyB0aGUgbG9hZGluZyBwcm9jZXNzXG4gICMjI1xuICBsb2FkOiAtPlxuICAgIGFzeW5jLm1hcCBAaXRlbUZpbGVuYW1lcywgQGxvYWRJdGVtLCAoZXJyLCBpdGVtcykgPT5cbiAgICAgIGZvciBpdGVtIGluIGl0ZW1zXG4gICAgICAgIEBpdGVtc1tpdGVtLmZpbGVuYW1lXSA9IGl0ZW0uaXRlbVxuXG4gICAgICBAZW1pdCBcImRvbmVcIlxuXG4gICMjI1xuICAgKiBSZXR1cm5zIHRoZSBpdGVtIGZvciB0aGUgZ2l2ZW4gZmlsZW5hbWVcbiAgIyMjXG4gIGdldDogKGZpbGVuYW1lKSAtPlxuICAgIHVubGVzcyBAaXRlbXNbZmlsZW5hbWVdP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGZpbGUgI3tmaWxlbmFtZX0gaGFzIG5vdCBiZWVuIHByZWxvYWRlZCFcIilcblxuICAgIHJldHVybiBAaXRlbXNbZmlsZW5hbWVdXG5cbiAgIyMjXG4gICAqIEluaXRpYXRlcyB0aGUgbG9hZGluZyBwcm9jZXNzIGZvciB0aGUgZ2l2ZW4gZmlsZW5hbWVcbiAgICogQHBhcmFtICB7U3RyaW5nfSBmaWxlbmFtZVxuICAjIyNcbiAgbG9hZEl0ZW06IChmaWxlbmFtZSwgY2FsbGJhY2spID0+XG4gICAgZXh0ZW5zaW9uID0gZmlsZW5hbWUuc3BsaXQoXCIuXCIpLnBvcCgpXG5cbiAgICBsb2FkaW5nTWV0aG9kID0gQFtcImxvYWRcIiArIGV4dGVuc2lvbi50b1VwcGVyQ2FzZSgpXVxuICAgIHVubGVzcyBsb2FkaW5nTWV0aG9kP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gbG9hZGluZyBtZXRob2QgZm9yIFwiICsgZmlsZW5hbWUpXG5cbiAgICBsb2FkaW5nTWV0aG9kIGZpbGVuYW1lLCBjYWxsYmFja1xuXG4gIGxvYWRKU09OOiAoZmlsZW5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICQuZ2V0SlNPTiBmaWxlbmFtZSwgKGRhdGEpIC0+XG4gICAgICBjYWxsYmFjayBudWxsLCB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZVxuICAgICAgICBpdGVtOiBkYXRhXG4gICAgICB9XG5cbiAgbG9hZEltYWdlOiAoZmlsZW5hbWUsIGNhbGxiYWNrKSAtPlxuICAgIGltYWdlID0gbmV3IEltYWdlKClcbiAgICBpbWFnZS5vbmxvYWQgPSAtPlxuICAgICAgY2FsbGJhY2sgbnVsbCwge1xuICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWVcbiAgICAgICAgaXRlbTogaW1hZ2VcbiAgICAgIH1cbiAgICBpbWFnZS5zcmMgPSBmaWxlbmFtZVxuXG4gIGxvYWRQTkc6ICA9PiBAbG9hZEltYWdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgbG9hZEpQRzogID0+IEBsb2FkSW1hZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICBsb2FkSlBFRzogPT4gQGxvYWRJbWFnZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWRlclxuIiwidmFyIHByb2Nlc3M9cmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpOy8qZ2xvYmFsIHNldEltbWVkaWF0ZTogZmFsc2UsIHNldFRpbWVvdXQ6IGZhbHNlLCBjb25zb2xlOiBmYWxzZSAqL1xuKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBhc3luYyA9IHt9O1xuXG4gICAgLy8gZ2xvYmFsIG9uIHRoZSBzZXJ2ZXIsIHdpbmRvdyBpbiB0aGUgYnJvd3NlclxuICAgIHZhciByb290LCBwcmV2aW91c19hc3luYztcblxuICAgIHJvb3QgPSB0aGlzO1xuICAgIGlmIChyb290ICE9IG51bGwpIHtcbiAgICAgIHByZXZpb3VzX2FzeW5jID0gcm9vdC5hc3luYztcbiAgICB9XG5cbiAgICBhc3luYy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByb290LmFzeW5jID0gcHJldmlvdXNfYXN5bmM7XG4gICAgICAgIHJldHVybiBhc3luYztcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gb25seV9vbmNlKGZuKSB7XG4gICAgICAgIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxlZCkgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgd2FzIGFscmVhZHkgY2FsbGVkLlwiKTtcbiAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICBmbi5hcHBseShyb290LCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8vLyBjcm9zcy1icm93c2VyIGNvbXBhdGlibGl0eSBmdW5jdGlvbnMgLy8vL1xuXG4gICAgdmFyIF9lYWNoID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IpIHtcbiAgICAgICAgaWYgKGFyci5mb3JFYWNoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLmZvckVhY2goaXRlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihhcnJbaV0sIGksIGFycik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIF9tYXAgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvcikge1xuICAgICAgICBpZiAoYXJyLm1hcCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5tYXAoaXRlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIF9lYWNoKGFyciwgZnVuY3Rpb24gKHgsIGksIGEpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChpdGVyYXRvcih4LCBpLCBhKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG4gICAgdmFyIF9yZWR1Y2UgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgbWVtbykge1xuICAgICAgICBpZiAoYXJyLnJlZHVjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pO1xuICAgICAgICB9XG4gICAgICAgIF9lYWNoKGFyciwgZnVuY3Rpb24gKHgsIGksIGEpIHtcbiAgICAgICAgICAgIG1lbW8gPSBpdGVyYXRvcihtZW1vLCB4LCBpLCBhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG5cbiAgICB2YXIgX2tleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcblxuICAgIC8vLy8gZXhwb3J0ZWQgYXN5bmMgbW9kdWxlIGZ1bmN0aW9ucyAvLy8vXG5cbiAgICAvLy8vIG5leHRUaWNrIGltcGxlbWVudGF0aW9uIHdpdGggYnJvd3Nlci1jb21wYXRpYmxlIGZhbGxiYWNrIC8vLy9cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8ICEocHJvY2Vzcy5uZXh0VGljaykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgLy8gbm90IGEgZGlyZWN0IGFsaWFzIGZvciBJRTEwIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZSA9IGFzeW5jLm5leHRUaWNrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXN5bmMubmV4dFRpY2sgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUgPSBhc3luYy5uZXh0VGljaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXN5bmMubmV4dFRpY2sgPSBwcm9jZXNzLm5leHRUaWNrO1xuICAgICAgICBpZiAodHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZSA9IGFzeW5jLm5leHRUaWNrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMuZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICBfZWFjaChhcnIsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LCBvbmx5X29uY2UoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkID49IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLmZvckVhY2ggPSBhc3luYy5lYWNoO1xuXG4gICAgYXN5bmMuZWFjaFNlcmllcyA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICB2YXIgaXRlcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKGFycltjb21wbGV0ZWRdLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQgPj0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaXRlcmF0ZSgpO1xuICAgIH07XG4gICAgYXN5bmMuZm9yRWFjaFNlcmllcyA9IGFzeW5jLmVhY2hTZXJpZXM7XG5cbiAgICBhc3luYy5lYWNoTGltaXQgPSBmdW5jdGlvbiAoYXJyLCBsaW1pdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmbiA9IF9lYWNoTGltaXQobGltaXQpO1xuICAgICAgICBmbi5hcHBseShudWxsLCBbYXJyLCBpdGVyYXRvciwgY2FsbGJhY2tdKTtcbiAgICB9O1xuICAgIGFzeW5jLmZvckVhY2hMaW1pdCA9IGFzeW5jLmVhY2hMaW1pdDtcblxuICAgIHZhciBfZWFjaExpbWl0ID0gZnVuY3Rpb24gKGxpbWl0KSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgIGlmICghYXJyLmxlbmd0aCB8fCBsaW1pdCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY29tcGxldGVkID0gMDtcbiAgICAgICAgICAgIHZhciBzdGFydGVkID0gMDtcbiAgICAgICAgICAgIHZhciBydW5uaW5nID0gMDtcblxuICAgICAgICAgICAgKGZ1bmN0aW9uIHJlcGxlbmlzaCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCA+PSBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdoaWxlIChydW5uaW5nIDwgbGltaXQgJiYgc3RhcnRlZCA8IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGl0ZXJhdG9yKGFycltzdGFydGVkIC0gMV0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCA+PSBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsZW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH07XG4gICAgfTtcblxuXG4gICAgdmFyIGRvUGFyYWxsZWwgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBbYXN5bmMuZWFjaF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHZhciBkb1BhcmFsbGVsTGltaXQgPSBmdW5jdGlvbihsaW1pdCwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBbX2VhY2hMaW1pdChsaW1pdCldLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICB2YXIgZG9TZXJpZXMgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBbYXN5bmMuZWFjaFNlcmllc10uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICB2YXIgX2FzeW5jTWFwID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgYXJyID0gX21hcChhcnIsIGZ1bmN0aW9uICh4LCBpKSB7XG4gICAgICAgICAgICByZXR1cm4ge2luZGV4OiBpLCB2YWx1ZTogeH07XG4gICAgICAgIH0pO1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgudmFsdWUsIGZ1bmN0aW9uIChlcnIsIHYpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzW3guaW5kZXhdID0gdjtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgYXN5bmMubWFwID0gZG9QYXJhbGxlbChfYXN5bmNNYXApO1xuICAgIGFzeW5jLm1hcFNlcmllcyA9IGRvU2VyaWVzKF9hc3luY01hcCk7XG4gICAgYXN5bmMubWFwTGltaXQgPSBmdW5jdGlvbiAoYXJyLCBsaW1pdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfbWFwTGltaXQobGltaXQpKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgdmFyIF9tYXBMaW1pdCA9IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBkb1BhcmFsbGVsTGltaXQobGltaXQsIF9hc3luY01hcCk7XG4gICAgfTtcblxuICAgIC8vIHJlZHVjZSBvbmx5IGhhcyBhIHNlcmllcyB2ZXJzaW9uLCBhcyBkb2luZyByZWR1Y2UgaW4gcGFyYWxsZWwgd29uJ3RcbiAgICAvLyB3b3JrIGluIG1hbnkgc2l0dWF0aW9ucy5cbiAgICBhc3luYy5yZWR1Y2UgPSBmdW5jdGlvbiAoYXJyLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMuZWFjaFNlcmllcyhhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IobWVtbywgeCwgZnVuY3Rpb24gKGVyciwgdikge1xuICAgICAgICAgICAgICAgIG1lbW8gPSB2O1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBtZW1vKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBpbmplY3QgYWxpYXNcbiAgICBhc3luYy5pbmplY3QgPSBhc3luYy5yZWR1Y2U7XG4gICAgLy8gZm9sZGwgYWxpYXNcbiAgICBhc3luYy5mb2xkbCA9IGFzeW5jLnJlZHVjZTtcblxuICAgIGFzeW5jLnJlZHVjZVJpZ2h0ID0gZnVuY3Rpb24gKGFyciwgbWVtbywgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXZlcnNlZCA9IF9tYXAoYXJyLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH0pLnJldmVyc2UoKTtcbiAgICAgICAgYXN5bmMucmVkdWNlKHJldmVyc2VkLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG4gICAgLy8gZm9sZHIgYWxpYXNcbiAgICBhc3luYy5mb2xkciA9IGFzeW5jLnJlZHVjZVJpZ2h0O1xuXG4gICAgdmFyIF9maWx0ZXIgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBhcnIgPSBfbWFwKGFyciwgZnVuY3Rpb24gKHgsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiB7aW5kZXg6IGksIHZhbHVlOiB4fTtcbiAgICAgICAgfSk7XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeC52YWx1ZSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soX21hcChyZXN1bHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXg7XG4gICAgICAgICAgICB9KSwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC52YWx1ZTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5maWx0ZXIgPSBkb1BhcmFsbGVsKF9maWx0ZXIpO1xuICAgIGFzeW5jLmZpbHRlclNlcmllcyA9IGRvU2VyaWVzKF9maWx0ZXIpO1xuICAgIC8vIHNlbGVjdCBhbGlhc1xuICAgIGFzeW5jLnNlbGVjdCA9IGFzeW5jLmZpbHRlcjtcbiAgICBhc3luYy5zZWxlY3RTZXJpZXMgPSBhc3luYy5maWx0ZXJTZXJpZXM7XG5cbiAgICB2YXIgX3JlamVjdCA9IGZ1bmN0aW9uIChlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGFyciA9IF9tYXAoYXJyLCBmdW5jdGlvbiAoeCwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIHtpbmRleDogaSwgdmFsdWU6IHh9O1xuICAgICAgICB9KTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LnZhbHVlLCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soX21hcChyZXN1bHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXg7XG4gICAgICAgICAgICB9KSwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC52YWx1ZTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5yZWplY3QgPSBkb1BhcmFsbGVsKF9yZWplY3QpO1xuICAgIGFzeW5jLnJlamVjdFNlcmllcyA9IGRvU2VyaWVzKF9yZWplY3QpO1xuXG4gICAgdmFyIF9kZXRlY3QgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBtYWluX2NhbGxiYWNrKSB7XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayh4KTtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgbWFpbl9jYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLmRldGVjdCA9IGRvUGFyYWxsZWwoX2RldGVjdCk7XG4gICAgYXN5bmMuZGV0ZWN0U2VyaWVzID0gZG9TZXJpZXMoX2RldGVjdCk7XG5cbiAgICBhc3luYy5zb21lID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIG1haW5fY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMuZWFjaChhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgbWFpbl9jYWxsYmFjayhmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gYW55IGFsaWFzXG4gICAgYXN5bmMuYW55ID0gYXN5bmMuc29tZTtcblxuICAgIGFzeW5jLmV2ZXJ5ID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIG1haW5fY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMuZWFjaChhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBtYWluX2NhbGxiYWNrKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIGFsbCBhbGlhc1xuICAgIGFzeW5jLmFsbCA9IGFzeW5jLmV2ZXJ5O1xuXG4gICAgYXN5bmMuc29ydEJ5ID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLm1hcChhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKGVyciwgY3JpdGVyaWEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7dmFsdWU6IHgsIGNyaXRlcmlhOiBjcml0ZXJpYX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhLCBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIF9tYXAocmVzdWx0cy5zb3J0KGZuKSwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHgudmFsdWU7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMuYXV0byA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgdmFyIGtleXMgPSBfa2V5cyh0YXNrcyk7XG4gICAgICAgIGlmICgha2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHRzID0ge307XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICAgICAgICB2YXIgYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy51bnNoaWZ0KGZuKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0gPT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciB0YXNrQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfZWFjaChsaXN0ZW5lcnMuc2xpY2UoMCksIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBhZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX2tleXMocmVzdWx0cykubGVuZ3RoID09PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF9lYWNoKGtleXMsIGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9ICh0YXNrc1trXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSA/IFt0YXNrc1trXV06IHRhc2tzW2tdO1xuICAgICAgICAgICAgdmFyIHRhc2tDYWxsYmFjayA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNhZmVSZXN1bHRzID0ge307XG4gICAgICAgICAgICAgICAgICAgIF9lYWNoKF9rZXlzKHJlc3VsdHMpLCBmdW5jdGlvbihya2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYWZlUmVzdWx0c1tya2V5XSA9IHJlc3VsdHNbcmtleV07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzYWZlUmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgc2FmZVJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICAvLyBzdG9wIHN1YnNlcXVlbnQgZXJyb3JzIGhpdHRpbmcgY2FsbGJhY2sgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNba10gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUodGFza0NvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHJlcXVpcmVzID0gdGFzay5zbGljZSgwLCBNYXRoLmFicyh0YXNrLmxlbmd0aCAtIDEpKSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JlZHVjZShyZXF1aXJlcywgZnVuY3Rpb24gKGEsIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChhICYmIHJlc3VsdHMuaGFzT3duUHJvcGVydHkoeCkpO1xuICAgICAgICAgICAgICAgIH0sIHRydWUpICYmICFyZXN1bHRzLmhhc093blByb3BlcnR5KGspO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChyZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgdGFza1t0YXNrLmxlbmd0aCAtIDFdKHRhc2tDYWxsYmFjaywgcmVzdWx0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrW3Rhc2subGVuZ3RoIC0gMV0odGFza0NhbGxiYWNrLCByZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMud2F0ZXJmYWxsID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAodGFza3MuY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgdG8gd2F0ZXJmYWxsIG11c3QgYmUgYW4gYXJyYXkgb2YgZnVuY3Rpb25zJyk7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3cmFwSXRlcmF0b3IgPSBmdW5jdGlvbiAoaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh3cmFwSXRlcmF0b3IobmV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0b3IuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHdyYXBJdGVyYXRvcihhc3luYy5pdGVyYXRvcih0YXNrcykpKCk7XG4gICAgfTtcblxuICAgIHZhciBfcGFyYWxsZWwgPSBmdW5jdGlvbihlYWNoZm4sIHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAodGFza3MuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICBlYWNoZm4ubWFwKHRhc2tzLCBmdW5jdGlvbiAoZm4sIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGVyciwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0ge307XG4gICAgICAgICAgICBlYWNoZm4uZWFjaChfa2V5cyh0YXNrcyksIGZ1bmN0aW9uIChrLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRhc2tzW2tdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGFzeW5jLnBhcmFsbGVsID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBfcGFyYWxsZWwoeyBtYXA6IGFzeW5jLm1hcCwgZWFjaDogYXN5bmMuZWFjaCB9LCB0YXNrcywgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5wYXJhbGxlbExpbWl0ID0gZnVuY3Rpb24odGFza3MsIGxpbWl0LCBjYWxsYmFjaykge1xuICAgICAgICBfcGFyYWxsZWwoeyBtYXA6IF9tYXBMaW1pdChsaW1pdCksIGVhY2g6IF9lYWNoTGltaXQobGltaXQpIH0sIHRhc2tzLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLnNlcmllcyA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKHRhc2tzLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgYXN5bmMubWFwU2VyaWVzKHRhc2tzLCBmdW5jdGlvbiAoZm4sIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGVyciwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0ge307XG4gICAgICAgICAgICBhc3luYy5lYWNoU2VyaWVzKF9rZXlzKHRhc2tzKSwgZnVuY3Rpb24gKGssIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGFza3Nba10oZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2tdID0gYXJncztcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYXN5bmMuaXRlcmF0b3IgPSBmdW5jdGlvbiAodGFza3MpIHtcbiAgICAgICAgdmFyIG1ha2VDYWxsYmFjayA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFza3NbaW5kZXhdLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmbi5uZXh0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm4ubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluZGV4IDwgdGFza3MubGVuZ3RoIC0gMSkgPyBtYWtlQ2FsbGJhY2soaW5kZXggKyAxKTogbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZm47XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBtYWtlQ2FsbGJhY2soMCk7XG4gICAgfTtcblxuICAgIGFzeW5jLmFwcGx5ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShcbiAgICAgICAgICAgICAgICBudWxsLCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIF9jb25jYXQgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGZuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgciA9IFtdO1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2IpIHtcbiAgICAgICAgICAgIGZuKHgsIGZ1bmN0aW9uIChlcnIsIHkpIHtcbiAgICAgICAgICAgICAgICByID0gci5jb25jYXQoeSB8fCBbXSk7XG4gICAgICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLmNvbmNhdCA9IGRvUGFyYWxsZWwoX2NvbmNhdCk7XG4gICAgYXN5bmMuY29uY2F0U2VyaWVzID0gZG9TZXJpZXMoX2NvbmNhdCk7XG5cbiAgICBhc3luYy53aGlsc3QgPSBmdW5jdGlvbiAodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0ZXN0KCkpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhc3luYy53aGlsc3QodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5kb1doaWxzdCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spIHtcbiAgICAgICAgaXRlcmF0b3IoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRlc3QoKSkge1xuICAgICAgICAgICAgICAgIGFzeW5jLmRvV2hpbHN0KGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMudW50aWwgPSBmdW5jdGlvbiAodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghdGVzdCgpKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXN5bmMudW50aWwodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5kb1VudGlsID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjaykge1xuICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRlc3QoKSkge1xuICAgICAgICAgICAgICAgIGFzeW5jLmRvVW50aWwoaXRlcmF0b3IsIHRlc3QsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhc3luYy5xdWV1ZSA9IGZ1bmN0aW9uICh3b3JrZXIsIGNvbmN1cnJlbmN5KSB7XG4gICAgICAgIGlmIChjb25jdXJyZW5jeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25jdXJyZW5jeSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gX2luc2VydChxLCBkYXRhLCBwb3MsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgaWYoZGF0YS5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX2VhY2goZGF0YSwgZnVuY3Rpb24odGFzaykge1xuICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHRhc2ssXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gY2FsbGJhY2sgOiBudWxsXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKHBvcykge1xuICAgICAgICAgICAgICAgIHEudGFza3MudW5zaGlmdChpdGVtKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBxLnRhc2tzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAocS5zYXR1cmF0ZWQgJiYgcS50YXNrcy5sZW5ndGggPT09IGNvbmN1cnJlbmN5KSB7XG4gICAgICAgICAgICAgICAgICBxLnNhdHVyYXRlZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZShxLnByb2Nlc3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdvcmtlcnMgPSAwO1xuICAgICAgICB2YXIgcSA9IHtcbiAgICAgICAgICAgIHRhc2tzOiBbXSxcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5OiBjb25jdXJyZW5jeSxcbiAgICAgICAgICAgIHNhdHVyYXRlZDogbnVsbCxcbiAgICAgICAgICAgIGVtcHR5OiBudWxsLFxuICAgICAgICAgICAgZHJhaW46IG51bGwsXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgX2luc2VydChxLCBkYXRhLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuc2hpZnQ6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICBfaW5zZXJ0KHEsIGRhdGEsIHRydWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdvcmtlcnMgPCBxLmNvbmN1cnJlbmN5ICYmIHEudGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXNrID0gcS50YXNrcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocS5lbXB0eSAmJiBxLnRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdvcmtlcnMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrZXJzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suY2FsbGJhY2suYXBwbHkodGFzaywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLmRyYWluICYmIHEudGFza3MubGVuZ3RoICsgd29ya2VycyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEuZHJhaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHEucHJvY2VzcygpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2IgPSBvbmx5X29uY2UobmV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtlcih0YXNrLmRhdGEsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGVuZ3RoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHEudGFza3MubGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJ1bm5pbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgfTtcblxuICAgIGFzeW5jLmNhcmdvID0gZnVuY3Rpb24gKHdvcmtlciwgcGF5bG9hZCkge1xuICAgICAgICB2YXIgd29ya2luZyAgICAgPSBmYWxzZSxcbiAgICAgICAgICAgIHRhc2tzICAgICAgID0gW107XG5cbiAgICAgICAgdmFyIGNhcmdvID0ge1xuICAgICAgICAgICAgdGFza3M6IHRhc2tzLFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgICAgIHNhdHVyYXRlZDogbnVsbCxcbiAgICAgICAgICAgIGVtcHR5OiBudWxsLFxuICAgICAgICAgICAgZHJhaW46IG51bGwsXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnN0cnVjdG9yICE9PSBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gW2RhdGFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfZWFjaChkYXRhLCBmdW5jdGlvbih0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFzayxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBjYWxsYmFjayA6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXJnby5zYXR1cmF0ZWQgJiYgdGFza3MubGVuZ3RoID09PSBwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJnby5zYXR1cmF0ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZShjYXJnby5wcm9jZXNzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiBwcm9jZXNzKCkge1xuICAgICAgICAgICAgICAgIGlmICh3b3JraW5nKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZihjYXJnby5kcmFpbikgY2FyZ28uZHJhaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB0cyA9IHR5cGVvZiBwYXlsb2FkID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGFza3Muc3BsaWNlKDAsIHBheWxvYWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0YXNrcy5zcGxpY2UoMCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZHMgPSBfbWFwKHRzLCBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFzay5kYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYoY2FyZ28uZW1wdHkpIGNhcmdvLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgd29ya2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgd29ya2VyKGRzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICAgICAgX2VhY2godHMsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY2FsbGJhY2suYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsZW5ndGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3MubGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJ1bm5pbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2luZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNhcmdvO1xuICAgIH07XG5cbiAgICB2YXIgX2NvbnNvbGVfZm4gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICBmbi5hcHBseShudWxsLCBhcmdzLmNvbmNhdChbZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbnNvbGVbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9lYWNoKGFyZ3MsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZVtuYW1lXSh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV0pKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGFzeW5jLmxvZyA9IF9jb25zb2xlX2ZuKCdsb2cnKTtcbiAgICBhc3luYy5kaXIgPSBfY29uc29sZV9mbignZGlyJyk7XG4gICAgLyphc3luYy5pbmZvID0gX2NvbnNvbGVfZm4oJ2luZm8nKTtcbiAgICBhc3luYy53YXJuID0gX2NvbnNvbGVfZm4oJ3dhcm4nKTtcbiAgICBhc3luYy5lcnJvciA9IF9jb25zb2xlX2ZuKCdlcnJvcicpOyovXG5cbiAgICBhc3luYy5tZW1vaXplID0gZnVuY3Rpb24gKGZuLCBoYXNoZXIpIHtcbiAgICAgICAgdmFyIG1lbW8gPSB7fTtcbiAgICAgICAgdmFyIHF1ZXVlcyA9IHt9O1xuICAgICAgICBoYXNoZXIgPSBoYXNoZXIgfHwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9O1xuICAgICAgICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGtleSA9IGhhc2hlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgIGlmIChrZXkgaW4gbWVtbykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIG1lbW9ba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChrZXkgaW4gcXVldWVzKSB7XG4gICAgICAgICAgICAgICAgcXVldWVzW2tleV0ucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBxdWV1ZXNba2V5XSA9IFtjYWxsYmFja107XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncy5jb25jYXQoW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtb1trZXldID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcSA9IHF1ZXVlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcXVldWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICBxW2ldLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBtZW1vaXplZC5tZW1vID0gbWVtbztcbiAgICAgICAgbWVtb2l6ZWQudW5tZW1vaXplZCA9IGZuO1xuICAgICAgICByZXR1cm4gbWVtb2l6ZWQ7XG4gICAgfTtcblxuICAgIGFzeW5jLnVubWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChmbi51bm1lbW9pemVkIHx8IGZuKS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgYXN5bmMudGltZXMgPSBmdW5jdGlvbiAoY291bnQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgY291bnRlciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGNvdW50ZXIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXN5bmMubWFwKGNvdW50ZXIsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLnRpbWVzU2VyaWVzID0gZnVuY3Rpb24gKGNvdW50LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudGVyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzeW5jLm1hcFNlcmllcyhjb3VudGVyLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5jb21wb3NlID0gZnVuY3Rpb24gKC8qIGZ1bmN0aW9ucy4uLiAqLykge1xuICAgICAgICB2YXIgZm5zID0gQXJyYXkucHJvdG90eXBlLnJldmVyc2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIGFzeW5jLnJlZHVjZShmbnMsIGFyZ3MsIGZ1bmN0aW9uIChuZXdhcmdzLCBmbiwgY2IpIHtcbiAgICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBuZXdhcmdzLmNvbmNhdChbZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICBjYihlcnIsIG5leHRhcmdzKTtcbiAgICAgICAgICAgICAgICB9XSkpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoYXQsIFtlcnJdLmNvbmNhdChyZXN1bHRzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIF9hcHBseUVhY2ggPSBmdW5jdGlvbiAoZWFjaGZuLCBmbnMgLyphcmdzLi4uKi8pIHtcbiAgICAgICAgdmFyIGdvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIHJldHVybiBlYWNoZm4oZm5zLCBmdW5jdGlvbiAoZm4sIGNiKSB7XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncy5jb25jYXQoW2NiXSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgICAgICAgICByZXR1cm4gZ28uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ287XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGFzeW5jLmFwcGx5RWFjaCA9IGRvUGFyYWxsZWwoX2FwcGx5RWFjaCk7XG4gICAgYXN5bmMuYXBwbHlFYWNoU2VyaWVzID0gZG9TZXJpZXMoX2FwcGx5RWFjaCk7XG5cbiAgICBhc3luYy5mb3JldmVyID0gZnVuY3Rpb24gKGZuLCBjYWxsYmFjaykge1xuICAgICAgICBmdW5jdGlvbiBuZXh0KGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm4obmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCgpO1xuICAgIH07XG5cbiAgICAvLyBBTUQgLyBSZXF1aXJlSlNcbiAgICBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3luYztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIE5vZGUuanNcbiAgICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGFzeW5jO1xuICAgIH1cbiAgICAvLyBpbmNsdWRlZCBkaXJlY3RseSB2aWEgPHNjcmlwdD4gdGFnXG4gICAgZWxzZSB7XG4gICAgICAgIHJvb3QuYXN5bmMgPSBhc3luYztcbiAgICB9XG5cbn0oKSk7XG4iLCJ2YXIgcHJvY2Vzcz1yZXF1aXJlKFwiX19icm93c2VyaWZ5X3Byb2Nlc3NcIik7aWYgKCFwcm9jZXNzLkV2ZW50RW1pdHRlcikgcHJvY2Vzcy5FdmVudEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIEV2ZW50RW1pdHRlciA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gcHJvY2Vzcy5FdmVudEVtaXR0ZXI7XG52YXIgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nXG4gICAgPyBBcnJheS5pc0FycmF5XG4gICAgOiBmdW5jdGlvbiAoeHMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICB9XG47XG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4ID09PSB4c1tpXSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuLy8gMTAgbGlzdGVuZXJzIGFyZSBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoXG4vLyBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbi8vXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgPSBuO1xufTtcblxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc0FycmF5KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKVxuICAgIHtcbiAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiBmYWxzZTtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGlmICghaGFuZGxlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICAgIHZhciBtO1xuICAgICAgaWYgKHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtID0gdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG0gPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5vbih0eXBlLCBmdW5jdGlvbiBnKCkge1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNBcnJheShsaXN0KSkge1xuICAgIHZhciBpID0gaW5kZXhPZihsaXN0LCBsaXN0ZW5lcik7XG4gICAgaWYgKGkgPCAwKSByZXR1cm4gdGhpcztcbiAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICBpZiAobGlzdC5sZW5ndGggPT0gMClcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH0gZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdID09PSBsaXN0ZW5lcikge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICh0eXBlICYmIHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuICBpZiAoIWlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICB9XG4gIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmICh0eXBlb2YgZW1pdHRlci5fZXZlbnRzW3R5cGVdID09PSAnZnVuY3Rpb24nKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYuc291cmNlID09PSB3aW5kb3cgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIl19
;