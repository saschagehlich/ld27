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
   * @param  [TextureAtlas] @TextureAtlas
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
   * @param  [CanvasRenderingContext2D] context
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
   * @param [Number] x
   * @param [Number] y
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


},{}],10:[function(require,module,exports){
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL2FjdG9yLmNvZmZlZSIsIi9Vc2Vycy9zYXNjaGFnZWhsaWNoL2RldmVsb3BtZW50L2pzL2xkMjcvY29mZmVlc2NyaXB0cy9mcmFtZXdvcmsvZ2FtZS5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL2dyYXBoaWNzL3Nwcml0ZS5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL2dyYXBoaWNzL3RleHR1cmVhdGxhcy5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL2xkZncuY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2ZyYW1ld29yay9tYXRoL3JlY3RhbmdsZS5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL21hdGgvdmVjdG9yMi5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL25vZGUuY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2ZyYW1ld29yay9zY3JlZW4uY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2ZyYW1ld29yay9zdGFnZS5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZnJhbWV3b3JrL3V0aWxpdGllcy9wcmVsb2FkZXIuY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2ZyYW1ld29yay92ZW5kb3IvYXN5bmMuanMiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L25vZGVfbW9kdWxlcy9ncnVudC13YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL2V2ZW50cy5qcyIsIi9Vc2Vycy9zYXNjaGFnZWhsaWNoL2RldmVsb3BtZW50L2pzL2xkMjcvbm9kZV9tb2R1bGVzL2dydW50LXdhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxPQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFPLENBQVAsR0FBTyxRQUFBOztBQUVELENBRk47Q0FHRTs7Q0FBQTs7O0NBQUE7O0NBR2EsQ0FBQSxDQUFBLENBQUEsV0FBRTtDQUNiLEVBRGEsQ0FBRDtDQUNaLEdBQUEsS0FBQSwrQkFBQTtDQUpGLEVBR2E7O0NBR2I7Ozs7O0NBTkE7O0NBQUEsRUFXUSxFQUFBLENBQVIsR0FBUzs7Q0FHVDs7OztDQWRBOztDQUFBLEVBa0JNLENBQU4sR0FBTSxFQUFDOztDQWxCUDs7Q0FEa0I7O0FBc0JwQixDQXhCQSxFQXdCaUIsRUF4QmpCLENBd0JNLENBQU47Ozs7QUN4QkEsSUFBQTtHQUFBLCtFQUFBOztBQUFNLENBQU47Q0FDZSxDQUFBLENBQUEsSUFBQSxPQUFFO0NBQ2IsRUFEYSxDQUFELEdBQ1o7Q0FBQSxrQ0FBQTtDQUFBLEVBQVcsQ0FBWCxFQUFBLENB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiTm9kZSA9IHJlcXVpcmUgXCIuL25vZGUuY29mZmVlXCJcblxuY2xhc3MgQWN0b3IgZXh0ZW5kcyBOb2RlXG4gICMjI1xuICAgKiBAcGFyYW0gIFtHYW1lXSBnYW1lXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxuICAgIHN1cGVyXG5cbiAgIyMjXG4gICAqIENhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGV2ZXJ5IHRpY2ssIHVwZGF0ZSBwcm9wZXJ0aWVzIGFuZCBkb1xuICAgKiBjYWxjdWxhdGlvbnMgaW4gaGVyZVxuICAgKiBAcGFyYW0gIFtOdW1iZXJdIGRlbHRhXG4gICMjI1xuICB1cGRhdGU6IChkZWx0YSkgLT5cbiAgICByZXR1cm5cblxuICAjIyNcbiAgICogQ2FsbGVkIGFmdGVyIHVwZGF0ZSwgZHJhdyBzdHVmZiBoZXJlXG4gICAqIEBwYXJhbSAgW0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRF0gY29udGV4dFxuICAjIyNcbiAgZHJhdzogKGNvbnRleHQpIC0+XG4gICAgcmV0dXJuXG5cbm1vZHVsZS5leHBvcnRzID0gQWN0b3JcbiIsImNsYXNzIEdhbWVcbiAgY29uc3RydWN0b3I6IChAd3JhcHBlcikgLT5cbiAgICBAY2FudmFzICA9IEB3cmFwcGVyLmZpbmQoXCJjYW52YXNcIikuZ2V0KDApXG4gICAgQHNldFNpemUgQHdyYXBwZXIud2lkdGgoKSwgQHdyYXBwZXIuaGVpZ2h0KClcblxuICAgIEBjb250ZXh0ID0gQGNhbnZhcy5nZXRDb250ZXh0IFwiMmRcIlxuICAgIEBydW5uaW5nID0gZmFsc2VcblxuICAgIEBzZXR1cFN0YXRzKClcblxuICBjbGVhclNjcmVlbjogLT5cbiAgICBAY29udGV4dC5jbGVhclJlY3QgMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHRcblxuICAjIyNcbiAgICogU2V0cyB0aGUgY2FudmFzIHNpemVcbiAgIyMjXG4gIHNldFNpemU6ICh3aWR0aCwgaGVpZ2h0KSAtPlxuICAgIEBjYW52YXMud2lkdGggID0gd2lkdGhcbiAgICBAY2FudmFzLmhlaWdodCA9IGhlaWdodFxuXG4gIGdldFdpZHRoOiAtPiBAY2FudmFzLndpZHRoXG4gIGdldEhlaWdodDogLT4gQGNhbnZhcy5oZWlnaHRcblxuICAjIyNcbiAgICogU2V0cyB1cCBtcmRvb2IncyBzdGF0cyBsaWJyYXJ5XG4gICMjI1xuICBzZXR1cFN0YXRzOiAtPlxuICAgIEBzdGF0cyA9IG5ldyBTdGF0cygpXG4gICAgQHN0YXRzLnNldE1vZGUgMFxuXG4gICAgZG9tID0gJChAc3RhdHMuZG9tRWxlbWVudClcbiAgICBkb20uY3NzXG4gICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiXG4gICAgICBsZWZ0OiAtZG9tLndpZHRoKClcbiAgICAgIHRvcDogMFxuXG4gICAgQHdyYXBwZXIuYXBwZW5kIEBzdGF0cy5kb21FbGVtZW50XG5cbiAgIyMjXG4gICAqIFN0YXRzIHRoZSBnYW1lJ3MgcnVuIGxvb3BcbiAgIyMjXG4gIHJ1bjogLT5cbiAgICBAcnVubmluZyA9IHRydWVcbiAgICBAbGFzdFRpY2sgPSBuZXcgRGF0ZSgpXG4gICAgcmVxdWVzdEFuaW1GcmFtZSBAdGlja1xuXG4gICMjI1xuICAgKiBTdG9wcyAvIHBhdXNlcyB0aGUgZ2FtZSdzIHJ1biBsb29wXG4gICMjI1xuICBzdG9wOiAtPlxuICAgIEBydW5uaW5nID0gZmFsc2VcblxuICAjIyNcbiAgICogT3VyIG1haW4gZ2FtZSBsb29wXG4gICMjI1xuICB0aWNrOiA9PlxuICAgIEBzdGF0cy5iZWdpbigpXG5cbiAgICBkZWx0YSA9IChuZXcgRGF0ZSgpIC0gQGxhc3RUaWNrKSAvIDEwMDBcbiAgICBAY2xlYXJTY3JlZW4oKVxuXG4gICAgIyBJZiB3ZSBoYXZlIGEgc2NyZWVuLCBtYWtlIGl0IHRpY2shXG4gICAgQHNjcmVlbj8udXBkYXRlIGRlbHRhXG4gICAgQHNjcmVlbj8uZHJhdyBAY29udGV4dFxuXG4gICAgQHN0YXRzLmVuZCgpXG5cbiAgICBAbGFzdFRpY2sgPSBuZXcgRGF0ZSgpXG5cbiAgICBpZiBAcnVubmluZ1xuICAgICAgcmVxdWVzdEFuaW1GcmFtZSBAdGlja1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVcbiIsIlZlY3RvcjIgPSByZXF1aXJlIFwiLi4vbWF0aC92ZWN0b3IyLmNvZmZlZVwiXG5Ob2RlICAgID0gcmVxdWlyZSBcIi4uL25vZGUuY29mZmVlXCJcblxuY2xhc3MgU3ByaXRlIGV4dGVuZHMgTm9kZVxuICAjIyNcbiAgICogQSBTcHJpdGUgcmVwcmVzZW50cyBhIGRyYXdhYmxlIGltYWdlXG4gICAqIEBwYXJhbSAgW1RleHR1cmVBdGxhc10gQFRleHR1cmVBdGxhc1xuICAjIyNcbiAgY29uc3RydWN0b3I6IChAdGV4dHVyZUF0bGFzLCBAZnJhbWUpIC0+XG4gICAgc3VwZXJcblxuICAgIEByb3RhdGlvbiA9IDBcblxuICBnZXRXaWR0aDogLT4gQGZyYW1lLmZyYW1lLncgKiBAc2NhbGUueFxuICBnZXRIZWlnaHQ6IC0+IEBmcmFtZS5mcmFtZS5oICogQHNjYWxlLnlcblxuICBnZXRSb3RhdGlvbjogLT4gQHJvdGF0aW9uXG4gIHNldFJvdGF0aW9uOiAocm90YXRpb24pIC0+IEByb3RhdGlvbiA9IHJvdGF0aW9uXG5cbiAgIyMjXG4gICAqIERyYXdzIHRoZSBzcHJpdGUgb24gdGhlIGdpdmVuIGNvbnRleHRcbiAgICogQHBhcmFtICBbQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXSBjb250ZXh0XG4gICMjI1xuICBkcmF3OiAoY29udGV4dCkgLT5cbiAgICBpbWFnZSA9IEB0ZXh0dXJlQXRsYXMuZ2V0QXRsYXNJbWFnZSgpXG5cbiAgICAjIFNvdXJjZSByZWN0YW5nbGVcbiAgICBzeCA9IEBmcmFtZS5mcmFtZS54XG4gICAgc3kgPSBAZnJhbWUuZnJhbWUueVxuICAgIHN3ID0gQGZyYW1lLmZyYW1lLndcbiAgICBzaCA9IEBmcmFtZS5mcmFtZS5oXG5cbiAgICAjIERlc3RpbmF0aW9uIHJlY3RhbmdsZVxuICAgIGR3ID0gQGZyYW1lLmZyYW1lLncgKiBAc2NhbGUueFxuICAgIGRoID0gQGZyYW1lLmZyYW1lLmggKiBAc2NhbGUueVxuXG4gICAgY29udGV4dC5zYXZlKClcblxuICAgIGNvbnRleHQudHJhbnNsYXRlIEBwb3NpdGlvbi54ICsgQG9yaWdpbi54LCBAcG9zaXRpb24ueSArIEBvcmlnaW4ueVxuICAgIGNvbnRleHQucm90YXRlIE1hdGguUEkgLyAxODAgKiBAcm90YXRpb25cblxuICAgIGNvbnRleHQuZHJhd0ltYWdlIGltYWdlLCBzeCwgc3ksIHN3LCBzaCwgLUBvcmlnaW4ueCwgLUBvcmlnaW4ueSwgZHcsIGRoXG5cbiAgICBjb250ZXh0LnJlc3RvcmUoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZVxuIiwiU3ByaXRlID0gcmVxdWlyZSBcIi4vc3ByaXRlLmNvZmZlZVwiXG5cbmNsYXNzIFRleHR1cmVBdGxhc1xuICBjb25zdHJ1Y3RvcjogKEBmcmFtZXMsIEBpbWFnZSkgLT4gcmV0dXJuXG5cbiAgIyMjXG4gICAqIENyZWF0ZXMgYSBuZXcgU3ByaXRlIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBmaWxlbmFtZVxuICAgKiBAcGFyYW0gIFtTdHJpbmddIGZpbGVuYW1lXG4gICAqIEByZXR1cm4gW1Nwcml0ZV1cbiAgIyMjXG4gIGNyZWF0ZVNwcml0ZTogKGZpbGVuYW1lKSAtPlxuICAgIHVubGVzcyBAZnJhbWVzW2ZpbGVuYW1lXT9cbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzcHJpdGUgI3tmaWxlbmFtZX0gY291bGQgbm90IGJlIGZvdW5kLlwiKVxuXG4gICAgc3ByaXRlID0gbmV3IFNwcml0ZSh0aGlzLCBAZnJhbWVzW2ZpbGVuYW1lXSlcbiAgICByZXR1cm4gc3ByaXRlXG5cbiAgZ2V0QXRsYXNJbWFnZTogLT4gQGltYWdlXG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dHVyZUF0bGFzXG4iLCJ3aW5kb3cuTERGVyA9XG4gIEdhbWU6IHJlcXVpcmUgXCIuL2dhbWUuY29mZmVlXCJcbiAgU2NyZWVuOiByZXF1aXJlIFwiLi9zY3JlZW4uY29mZmVlXCJcbiAgQWN0b3I6IHJlcXVpcmUgXCIuL2FjdG9yLmNvZmZlZVwiXG4gIFN0YWdlOiByZXF1aXJlIFwiLi9zdGFnZS5jb2ZmZWVcIlxuICBOb2RlOiByZXF1aXJlIFwiLi9ub2RlLmNvZmZlZVwiXG5cbiAgIyBHcmFwaGljc1xuICBUZXh0dXJlQXRsYXM6IHJlcXVpcmUgXCIuL2dyYXBoaWNzL3RleHR1cmVhdGxhcy5jb2ZmZWVcIlxuICBTcHJpdGU6IHJlcXVpcmUgXCIuL2dyYXBoaWNzL3Nwcml0ZS5jb2ZmZWVcIlxuXG4gICMgTWF0aFxuICBWZWN0b3IyOiByZXF1aXJlIFwiLi9tYXRoL3ZlY3RvcjIuY29mZmVlXCJcblxuICAjIFV0aWxpdGllc1xuICBQcmVsb2FkZXI6IHJlcXVpcmUgXCIuL3V0aWxpdGllcy9wcmVsb2FkZXIuY29mZmVlXCJcbiIsIlZlY3RvcjIgPSByZXF1aXJlIFwiLi92ZWN0b3IyLmNvZmZlZVwiXG5cbmNsYXNzIFJlY3RhbmdsZVxuICBjb25zdHJ1Y3RvcjogKHggPSAwLCB5ID0gMCwgQHdpZHRoID0gMCwgQGhlaWdodCA9IDApIC0+XG4gICAgQHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoeCwgeSlcblxuICAjIyNcbiAgICogU2V0cyB0aGUgcG9zaXRpb25cbiAgIyMjXG4gIHNldFBvc2l0aW9uOiAtPiBAcG9zaXRpb24uc2V0LmNhbGwgdGhpcywgYXJndW1lbnRzXG5cbiAgIyMjXG4gICAqIFNldHMgdGhlIHNpemUgdmFsdWVzXG4gICAqIEBwYXJhbSBbTnVtYmVyXSB3aWR0aFxuICAgKiBAcGFyYW0gW051bWJlcl0gaGVpZ2h0XG4gICMjI1xuICBzZXRTaXplOiAod2lkdGgsIGhlaWdodCkgLT5cbiAgICBAd2lkdGggPSB3aWR0aFxuICAgIEBoZWlnaHQgPSBoZWlnaHRcblxuICBnZXRXaWR0aDogLT4gQHdpZHRoXG4gIGdldEhlaWdodDogLT4gQGhlaWdodFxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY3RhbmdsZVxuIiwiY2xhc3MgVmVjdG9yMlxuICBjb25zdHJ1Y3RvcjogKEB4ID0gMCwgQHkgPSAwKSAtPiByZXR1cm5cblxuICAjIyNcbiAgICogU2V0cyB0aGUgbmV3IHBvc2l0aW9uIG9mIHRoZSBWZWN0b3IyXG4gICAqIEBwYXJhbSBbTnVtYmVyXSB4XG4gICAqIEBwYXJhbSBbTnVtYmVyXSB5XG4gICMjI1xuICBzZXQ6ICh4LCB5KSAtPlxuICAgIGlmIHggaW5zdGFuY2VvZiBWZWN0b3IyXG4gICAgICBvdGhlclYyID0geFxuXG4gICAgICBAeCA9IG90aGVyVjIueFxuICAgICAgQHkgPSBvdGhlclYyLnlcbiAgICBlbHNlXG4gICAgICBAeCA9IHhcbiAgICAgIEB5ID0geVxuXG4gICMjI1xuICAgKiBSZXR1cm5zIHRoZSB4IHZhbHVlXG4gICAqIEByZXR1cm4gW051bWJlcl1cbiAgIyMjXG4gIGdldFg6IC0+IEB4XG5cbiAgIyMjXG4gICAqIFJldHVybnMgdGhlIHkgdmFsdWVcbiAgICogQHJldHVybiBbTnVtYmVyXVxuICAjIyNcbiAgZ2V0WTogLT4gQHlcblxuICAjIyNcbiAgICogU2V0cyB0aGUgeCB2YWx1ZVxuICAgKiBAcGFyYW0gW051bWJlcl0geFxuICAjIyNcbiAgc2V0WDogKHgpIC0+IEB4ID0geFxuXG4gICMjI1xuICAgKiBTZXRzIHRoZSB5IHZhbHVlXG4gICAqIEBwYXJhbSBbTnVtYmVyXSB5XG4gICMjI1xuICBzZXRZOiAoeSkgLT4gQHkgPSB5XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMlxuIiwiVmVjdG9yMiAgID0gcmVxdWlyZSBcIi4vbWF0aC92ZWN0b3IyLmNvZmZlZVwiXG5SZWN0YW5nbGUgPSByZXF1aXJlIFwiLi9tYXRoL3JlY3RhbmdsZS5jb2ZmZWVcIlxuXG5jbGFzcyBOb2RlXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUpIC0+XG4gICAgQG9yaWdpbiAgID0gbmV3IFZlY3RvcjIoKVxuICAgIEBwb3NpdGlvbiA9IG5ldyBWZWN0b3IyKClcbiAgICBAc2NhbGUgICAgPSBuZXcgVmVjdG9yMigxLCAxKVxuICAgIEByZWN0ICAgICA9IG5ldyBSZWN0YW5nbGUoKVxuXG4gICMjI1xuICAgIFBvc2l0aW9uXG4gICMjI1xuICBnZXRQb3NpdGlvbjogLT4gQHBvc2l0aW9uXG4gIHNldFBvc2l0aW9uOiAoeCwgeSkgLT4gQHBvc2l0aW9uLnNldCB4LCB5XG5cbiAgZ2V0WDogLT4gQHBvc2l0aW9uLmdldFgoKVxuICBzZXRYOiAoeCkgLT4gQHBvc2l0aW9uLnNldFggeFxuXG4gIGdldFk6IC0+IEBwb3NpdGlvbi5nZXRZKClcbiAgc2V0WTogKHkpIC0+IEBwb3NpdGlvbi5zZXRZIHlcblxuICAjIyNcbiAgICBTY2FsZVxuICAjIyNcbiAgZ2V0U2NhbGU6IC0+IEBzY2FsZVxuICBzZXRTY2FsZTogKHgsIHkpIC0+IEBzY2FsZS5zZXQgeCwgeVxuXG4gIGdldFNjYWxlWDogLT4gQHNjYWxlLmdldFgoKVxuICBzZXRTY2FsZVg6ICh4KSAtPiBAc2NhbGUuc2V0WCB4XG5cbiAgZ2V0U2NhbGVZOiAtPiBAc2NhbGUuZ2V0WSgpXG4gIHNldFNjYWxlWTogKHkpIC0+IEBzY2FsZS5zZXRZIHlcblxuICAjIyNcbiAgICBPcmlnaW5cbiAgIyMjXG4gIGdldE9yaWdpbjogLT4gQG9yaWdpblxuICBzZXRPcmlnaW46ICh4LCB5KSAtPiBAb3JpZ2luLnNldCB4LCB5XG5cbiAgZ2V0T3JpZ2luWDogLT4gQHNjYWxlLmdldFgoKVxuICBzZXRPcmlnaW5YOiAoeCkgLT4gQG9yaWdpbi5zZXRYIHhcblxuICBnZXRPcmlnaW5ZOiAtPiBAb3JpZ2luLmdldFkoKVxuICBzZXRPcmlnaW5ZOiAoeSkgLT4gQG9yaWdpbi5zZXRZIHlcblxuICAjIyNcbiAgICBTaXplXG4gICMjI1xuICBnZXRTaXplOiAtPiBAcmVjdC5nZXRTaXplKClcbiAgc2V0U2l6ZTogKHdpZHRoLCBoZWlnaHQpIC0+IEByZWN0LnNldFNpemUgd2lkdGgsIGhlaWdodFxuXG4gIGdldFdpZHRoOiAtPiBAcmVjdC5nZXRXaWR0aCgpXG4gIGdldEhlaWdodDogLT4gQHJlY3QuZ2V0SGVpZ2h0KClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGVcbiIsImNsYXNzIFNjcmVlblxuICAjIyNcbiAgICogQHBhcmFtICBbR2FtZV0gZ2FtZVxuICAjIyNcbiAgY29uc3RydWN0b3I6IChAZ2FtZSkgLT5cbiAgICByZXR1cm5cblxuICAjIyNcbiAgICogQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZXZlcnkgdGljaywgdXBkYXRlIHByb3BlcnRpZXMgYW5kIGRvXG4gICAqIGNhbGN1bGF0aW9ucyBpbiBoZXJlXG4gICAqIEBwYXJhbSAgW051bWJlcl0gZGVsdGFcbiAgIyMjXG4gIHVwZGF0ZTogKGRlbHRhKSAtPlxuICAgIHJldHVyblxuXG4gICMjI1xuICAgKiBDYWxsZWQgYWZ0ZXIgdXBkYXRlLCBkcmF3IHN0dWZmIGhlcmVcbiAgICogQHBhcmFtICBbQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXSBjb250ZXh0XG4gICMjI1xuICBkcmF3OiAoY29udGV4dCkgLT5cbiAgICByZXR1cm5cblxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5cbiIsImNsYXNzIFN0YWdlXG4gICMjI1xuICAgKiBAcGFyYW0gIFtHYW1lXSBnYW1lXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxuICAgIEBhY3RvcnMgPSBbXVxuXG4gICMjI1xuICAgKiBBZGRzIGEgbmV3IGFjdG9yIHRvIHRoZSBsaXN0XG4gICAqIEBwYXJhbSBbQWN0b3JdIGFjdG9yXG4gICMjI1xuICBhZGRBY3RvcjogKGFjdG9yKSAtPlxuICAgIEBhY3RvcnMucHVzaCBhY3RvclxuXG4gICMjI1xuICAgKiBSZW1vdmVzIGFuIGFjdG9yIGZyb20gdGhlIGxpc3RcbiAgICogQHBhcmFtICBbQWN0b3JdIGFjdG9yXG4gICMjI1xuICByZW1vdmVBY3RvcjogKGFjdG9yKSAtPlxuICAgIGluZGV4ID0gQGFjdG9ycy5pbmRleE9mIGFjdG9yXG5cbiAgICBpZiBpbmRleCA+PSAwXG4gICAgICBAYWN0b3JzLnNwbGljZSBpbmRleCwgMVxuXG4gICMjI1xuICAgKiBDYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBldmVyeSB0aWNrLCB1cGRhdGUgcHJvcGVydGllcyBhbmQgZG9cbiAgICogY2FsY3VsYXRpb25zIGluIGhlcmVcbiAgICogQHBhcmFtICBbTnVtYmVyXSBkZWx0YVxuICAjIyNcbiAgdXBkYXRlOiAoZGVsdGEpIC0+XG4gICAgZm9yIGFjdG9yIGluIEBhY3RvcnNcbiAgICAgIGFjdG9yLnVwZGF0ZSBkZWx0YVxuXG4gICMjI1xuICAgKiBDYWxsZWQgYWZ0ZXIgdXBkYXRlLCBkcmF3IHN0dWZmIGhlcmVcbiAgICogQHBhcmFtICBbQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXSBjb250ZXh0XG4gICMjI1xuICBkcmF3OiAoY29udGV4dCkgLT5cbiAgICBmb3IgYWN0b3IgaW4gQGFjdG9yc1xuICAgICAgYWN0b3IuZHJhdyBjb250ZXh0XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhZ2VcbiIsIntFdmVudEVtaXR0ZXJ9ID0gcmVxdWlyZSBcImV2ZW50c1wiXG5hc3luYyA9IHJlcXVpcmUgXCIuLi92ZW5kb3IvYXN5bmMuanNcIlxuXG5jbGFzcyBQcmVsb2FkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbiAgY29uc3RydWN0b3I6IChAaXRlbUZpbGVuYW1lcykgLT5cbiAgICBAaXRlbXMgPSB7fVxuXG4gICMjI1xuICAgKiBTdGFydHMgdGhlIGxvYWRpbmcgcHJvY2Vzc1xuICAjIyNcbiAgbG9hZDogLT5cbiAgICBhc3luYy5tYXAgQGl0ZW1GaWxlbmFtZXMsIEBsb2FkSXRlbSwgKGVyciwgaXRlbXMpID0+XG4gICAgICBmb3IgaXRlbSBpbiBpdGVtc1xuICAgICAgICBAaXRlbXNbaXRlbS5maWxlbmFtZV0gPSBpdGVtLml0ZW1cblxuICAgICAgQGVtaXQgXCJkb25lXCJcblxuICAjIyNcbiAgICogUmV0dXJucyB0aGUgaXRlbSBmb3IgdGhlIGdpdmVuIGZpbGVuYW1lXG4gICMjI1xuICBnZXQ6IChmaWxlbmFtZSkgLT5cbiAgICB1bmxlc3MgQGl0ZW1zW2ZpbGVuYW1lXT9cbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBmaWxlICN7ZmlsZW5hbWV9IGhhcyBub3QgYmVlbiBwcmVsb2FkZWQhXCIpXG5cbiAgICByZXR1cm4gQGl0ZW1zW2ZpbGVuYW1lXVxuXG4gICMjI1xuICAgKiBJbml0aWF0ZXMgdGhlIGxvYWRpbmcgcHJvY2VzcyBmb3IgdGhlIGdpdmVuIGZpbGVuYW1lXG4gICAqIEBwYXJhbSAgW1N0cmluZ10gZmlsZW5hbWVcbiAgICogQHBhcmFtICBbRnVuY3Rpb25dIGNhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICMjI1xuICBsb2FkSXRlbTogKGZpbGVuYW1lLCBjYWxsYmFjaykgPT5cbiAgICBleHRlbnNpb24gPSBmaWxlbmFtZS5zcGxpdChcIi5cIikucG9wKClcblxuICAgIGxvYWRpbmdNZXRob2QgPSBAW1wibG9hZFwiICsgZXh0ZW5zaW9uLnRvVXBwZXJDYXNlKCldXG4gICAgdW5sZXNzIGxvYWRpbmdNZXRob2Q/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBsb2FkaW5nIG1ldGhvZCBmb3IgXCIgKyBmaWxlbmFtZSlcblxuICAgIGxvYWRpbmdNZXRob2QgZmlsZW5hbWUsIGNhbGxiYWNrXG5cbiAgIyMjXG4gICAqIExvYWRzIGEgSlNPTiBmaWxlIHZpYSBBSkFYXG4gICAqIEBwYXJhbSAgW1N0cmluZ10gZmlsZW5hbWVcbiAgICogQHBhcmFtICBbRnVuY3Rpb25dIGNhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICMjI1xuICBsb2FkSlNPTjogKGZpbGVuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAkLmdldEpTT04gZmlsZW5hbWUsIChkYXRhKSAtPlxuICAgICAgY2FsbGJhY2sgbnVsbCwge1xuICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWVcbiAgICAgICAgaXRlbTogZGF0YVxuICAgICAgfVxuXG4gICMjI1xuICAgKiBMb2FkcyBhbiBpbWFnZSBpdGVtXG4gICAqIEBwYXJhbSAgW1N0cmluZ10gZmlsZW5hbWVcbiAgICogQHBhcmFtICBbRnVuY3Rpb25dIGNhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICMjI1xuICBsb2FkSW1hZ2U6IChmaWxlbmFtZSwgY2FsbGJhY2spIC0+XG4gICAgaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIGltYWdlLm9ubG9hZCA9IC0+XG4gICAgICBjYWxsYmFjayBudWxsLCB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZVxuICAgICAgICBpdGVtOiBpbWFnZVxuICAgICAgfVxuICAgIGltYWdlLnNyYyA9IGZpbGVuYW1lXG5cbiAgbG9hZFBORzogID0+IEBsb2FkSW1hZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICBsb2FkSlBHOiAgPT4gQGxvYWRJbWFnZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIGxvYWRKUEVHOiA9PiBAbG9hZEltYWdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkZXJcbiIsInZhciBwcm9jZXNzPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKTsvKmdsb2JhbCBzZXRJbW1lZGlhdGU6IGZhbHNlLCBzZXRUaW1lb3V0OiBmYWxzZSwgY29uc29sZTogZmFsc2UgKi9cbihmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgYXN5bmMgPSB7fTtcblxuICAgIC8vIGdsb2JhbCBvbiB0aGUgc2VydmVyLCB3aW5kb3cgaW4gdGhlIGJyb3dzZXJcbiAgICB2YXIgcm9vdCwgcHJldmlvdXNfYXN5bmM7XG5cbiAgICByb290ID0gdGhpcztcbiAgICBpZiAocm9vdCAhPSBudWxsKSB7XG4gICAgICBwcmV2aW91c19hc3luYyA9IHJvb3QuYXN5bmM7XG4gICAgfVxuXG4gICAgYXN5bmMubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcm9vdC5hc3luYyA9IHByZXZpb3VzX2FzeW5jO1xuICAgICAgICByZXR1cm4gYXN5bmM7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIG9ubHlfb25jZShmbikge1xuICAgICAgICB2YXIgY2FsbGVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjYWxsZWQpIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIHdhcyBhbHJlYWR5IGNhbGxlZC5cIik7XG4gICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgZm4uYXBwbHkocm9vdCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vLy8gY3Jvc3MtYnJvd3NlciBjb21wYXRpYmxpdHkgZnVuY3Rpb25zIC8vLy9cblxuICAgIHZhciBfZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yKSB7XG4gICAgICAgIGlmIChhcnIuZm9yRWFjaCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5mb3JFYWNoKGl0ZXJhdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaXRlcmF0b3IoYXJyW2ldLCBpLCBhcnIpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBfbWFwID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IpIHtcbiAgICAgICAgaWYgKGFyci5tYXApIHtcbiAgICAgICAgICAgIHJldHVybiBhcnIubWFwKGl0ZXJhdG9yKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBfZWFjaChhcnIsIGZ1bmN0aW9uICh4LCBpLCBhKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goaXRlcmF0b3IoeCwgaSwgYSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuICAgIHZhciBfcmVkdWNlID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIG1lbW8pIHtcbiAgICAgICAgaWYgKGFyci5yZWR1Y2UpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnIucmVkdWNlKGl0ZXJhdG9yLCBtZW1vKTtcbiAgICAgICAgfVxuICAgICAgICBfZWFjaChhcnIsIGZ1bmN0aW9uICh4LCBpLCBhKSB7XG4gICAgICAgICAgICBtZW1vID0gaXRlcmF0b3IobWVtbywgeCwgaSwgYSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuXG4gICAgdmFyIF9rZXlzID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKGspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG5cbiAgICAvLy8vIGV4cG9ydGVkIGFzeW5jIG1vZHVsZSBmdW5jdGlvbnMgLy8vL1xuXG4gICAgLy8vLyBuZXh0VGljayBpbXBsZW1lbnRhdGlvbiB3aXRoIGJyb3dzZXItY29tcGF0aWJsZSBmYWxsYmFjayAvLy8vXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJyB8fCAhKHByb2Nlc3MubmV4dFRpY2spKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBhc3luYy5uZXh0VGljayA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIC8vIG5vdCBhIGRpcmVjdCBhbGlhcyBmb3IgSUUxMCBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUgPSBhc3luYy5uZXh0VGljaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXN5bmMuc2V0SW1tZWRpYXRlID0gYXN5bmMubmV4dFRpY2s7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGFzeW5jLm5leHRUaWNrID0gcHJvY2Vzcy5uZXh0VGljaztcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRJbW1lZGlhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUgPSBhc3luYy5uZXh0VGljaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jLmVhY2ggPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tcGxldGVkID0gMDtcbiAgICAgICAgX2VhY2goYXJyLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgb25seV9vbmNlKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCA+PSBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5mb3JFYWNoID0gYXN5bmMuZWFjaDtcblxuICAgIGFzeW5jLmVhY2hTZXJpZXMgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tcGxldGVkID0gMDtcbiAgICAgICAgdmFyIGl0ZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihhcnJbY29tcGxldGVkXSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkID49IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGl0ZXJhdGUoKTtcbiAgICB9O1xuICAgIGFzeW5jLmZvckVhY2hTZXJpZXMgPSBhc3luYy5lYWNoU2VyaWVzO1xuXG4gICAgYXN5bmMuZWFjaExpbWl0ID0gZnVuY3Rpb24gKGFyciwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZm4gPSBfZWFjaExpbWl0KGxpbWl0KTtcbiAgICAgICAgZm4uYXBwbHkobnVsbCwgW2FyciwgaXRlcmF0b3IsIGNhbGxiYWNrXSk7XG4gICAgfTtcbiAgICBhc3luYy5mb3JFYWNoTGltaXQgPSBhc3luYy5lYWNoTGltaXQ7XG5cbiAgICB2YXIgX2VhY2hMaW1pdCA9IGZ1bmN0aW9uIChsaW1pdCkge1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICBpZiAoIWFyci5sZW5ndGggfHwgbGltaXQgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbXBsZXRlZCA9IDA7XG4gICAgICAgICAgICB2YXIgc3RhcnRlZCA9IDA7XG4gICAgICAgICAgICB2YXIgcnVubmluZyA9IDA7XG5cbiAgICAgICAgICAgIChmdW5jdGlvbiByZXBsZW5pc2ggKCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQgPj0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAocnVubmluZyA8IGxpbWl0ICYmIHN0YXJ0ZWQgPCBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgcnVubmluZyArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpdGVyYXRvcihhcnJbc3RhcnRlZCAtIDFdLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQgPj0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGVuaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9O1xuICAgIH07XG5cblxuICAgIHZhciBkb1BhcmFsbGVsID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgW2FzeW5jLmVhY2hdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICB2YXIgZG9QYXJhbGxlbExpbWl0ID0gZnVuY3Rpb24obGltaXQsIGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgW19lYWNoTGltaXQobGltaXQpXS5jb25jYXQoYXJncykpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgdmFyIGRvU2VyaWVzID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgW2FzeW5jLmVhY2hTZXJpZXNdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuXG4gICAgdmFyIF9hc3luY01hcCA9IGZ1bmN0aW9uIChlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGFyciA9IF9tYXAoYXJyLCBmdW5jdGlvbiAoeCwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIHtpbmRleDogaSwgdmFsdWU6IHh9O1xuICAgICAgICB9KTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LnZhbHVlLCBmdW5jdGlvbiAoZXJyLCB2KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0c1t4LmluZGV4XSA9IHY7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLm1hcCA9IGRvUGFyYWxsZWwoX2FzeW5jTWFwKTtcbiAgICBhc3luYy5tYXBTZXJpZXMgPSBkb1NlcmllcyhfYXN5bmNNYXApO1xuICAgIGFzeW5jLm1hcExpbWl0ID0gZnVuY3Rpb24gKGFyciwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX21hcExpbWl0KGxpbWl0KShhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHZhciBfbWFwTGltaXQgPSBmdW5jdGlvbihsaW1pdCkge1xuICAgICAgICByZXR1cm4gZG9QYXJhbGxlbExpbWl0KGxpbWl0LCBfYXN5bmNNYXApO1xuICAgIH07XG5cbiAgICAvLyByZWR1Y2Ugb25seSBoYXMgYSBzZXJpZXMgdmVyc2lvbiwgYXMgZG9pbmcgcmVkdWNlIGluIHBhcmFsbGVsIHdvbid0XG4gICAgLy8gd29yayBpbiBtYW55IHNpdHVhdGlvbnMuXG4gICAgYXN5bmMucmVkdWNlID0gZnVuY3Rpb24gKGFyciwgbWVtbywgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLmVhY2hTZXJpZXMoYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKG1lbW8sIHgsIGZ1bmN0aW9uIChlcnIsIHYpIHtcbiAgICAgICAgICAgICAgICBtZW1vID0gdjtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbWVtbyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gaW5qZWN0IGFsaWFzXG4gICAgYXN5bmMuaW5qZWN0ID0gYXN5bmMucmVkdWNlO1xuICAgIC8vIGZvbGRsIGFsaWFzXG4gICAgYXN5bmMuZm9sZGwgPSBhc3luYy5yZWR1Y2U7XG5cbiAgICBhc3luYy5yZWR1Y2VSaWdodCA9IGZ1bmN0aW9uIChhcnIsIG1lbW8sIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmV2ZXJzZWQgPSBfbWFwKGFyciwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9KS5yZXZlcnNlKCk7XG4gICAgICAgIGFzeW5jLnJlZHVjZShyZXZlcnNlZCwgbWVtbywgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIC8vIGZvbGRyIGFsaWFzXG4gICAgYXN5bmMuZm9sZHIgPSBhc3luYy5yZWR1Y2VSaWdodDtcblxuICAgIHZhciBfZmlsdGVyID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgYXJyID0gX21hcChhcnIsIGZ1bmN0aW9uICh4LCBpKSB7XG4gICAgICAgICAgICByZXR1cm4ge2luZGV4OiBpLCB2YWx1ZTogeH07XG4gICAgICAgIH0pO1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgudmFsdWUsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKF9tYXAocmVzdWx0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgICAgICAgICAgfSksIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgudmFsdWU7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgYXN5bmMuZmlsdGVyID0gZG9QYXJhbGxlbChfZmlsdGVyKTtcbiAgICBhc3luYy5maWx0ZXJTZXJpZXMgPSBkb1NlcmllcyhfZmlsdGVyKTtcbiAgICAvLyBzZWxlY3QgYWxpYXNcbiAgICBhc3luYy5zZWxlY3QgPSBhc3luYy5maWx0ZXI7XG4gICAgYXN5bmMuc2VsZWN0U2VyaWVzID0gYXN5bmMuZmlsdGVyU2VyaWVzO1xuXG4gICAgdmFyIF9yZWplY3QgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBhcnIgPSBfbWFwKGFyciwgZnVuY3Rpb24gKHgsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiB7aW5kZXg6IGksIHZhbHVlOiB4fTtcbiAgICAgICAgfSk7XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeC52YWx1ZSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKF9tYXAocmVzdWx0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgICAgICAgICAgfSksIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgudmFsdWU7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgYXN5bmMucmVqZWN0ID0gZG9QYXJhbGxlbChfcmVqZWN0KTtcbiAgICBhc3luYy5yZWplY3RTZXJpZXMgPSBkb1NlcmllcyhfcmVqZWN0KTtcblxuICAgIHZhciBfZGV0ZWN0ID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgbWFpbl9jYWxsYmFjaykge1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2soeCk7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIG1haW5fY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5kZXRlY3QgPSBkb1BhcmFsbGVsKF9kZXRlY3QpO1xuICAgIGFzeW5jLmRldGVjdFNlcmllcyA9IGRvU2VyaWVzKF9kZXRlY3QpO1xuXG4gICAgYXN5bmMuc29tZSA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBtYWluX2NhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLmVhY2goYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIG1haW5fY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIGFueSBhbGlhc1xuICAgIGFzeW5jLmFueSA9IGFzeW5jLnNvbWU7XG5cbiAgICBhc3luYy5ldmVyeSA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBtYWluX2NhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLmVhY2goYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgbWFpbl9jYWxsYmFjayh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBhbGwgYWxpYXNcbiAgICBhc3luYy5hbGwgPSBhc3luYy5ldmVyeTtcblxuICAgIGFzeW5jLnNvcnRCeSA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBhc3luYy5tYXAoYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uIChlcnIsIGNyaXRlcmlhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge3ZhbHVlOiB4LCBjcml0ZXJpYTogY3JpdGVyaWF9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYSwgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBfbWFwKHJlc3VsdHMuc29ydChmbiksIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4LnZhbHVlO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFzeW5jLmF1dG8gPSBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgIHZhciBrZXlzID0gX2tleXModGFza3MpO1xuICAgICAgICBpZiAoIWtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0cyA9IHt9O1xuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdmFyIGFkZExpc3RlbmVyID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMudW5zaGlmdChmbik7XG4gICAgICAgIH07XG4gICAgICAgIHZhciByZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldID09PSBmbikge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgdGFza0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX2VhY2gobGlzdGVuZXJzLnNsaWNlKDApLCBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYWRkTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF9rZXlzKHJlc3VsdHMpLmxlbmd0aCA9PT0ga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBfZWFjaChrZXlzLCBmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSAodGFza3Nba10gaW5zdGFuY2VvZiBGdW5jdGlvbikgPyBbdGFza3Nba11dOiB0YXNrc1trXTtcbiAgICAgICAgICAgIHZhciB0YXNrQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzYWZlUmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBfZWFjaChfa2V5cyhyZXN1bHRzKSwgZnVuY3Rpb24ocmtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2FmZVJlc3VsdHNbcmtleV0gPSByZXN1bHRzW3JrZXldO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2FmZVJlc3VsdHNba10gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHNhZmVSZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcCBzdWJzZXF1ZW50IGVycm9ycyBoaXR0aW5nIGNhbGxiYWNrIG11bHRpcGxlIHRpbWVzXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2tdID0gYXJncztcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMuc2V0SW1tZWRpYXRlKHRhc2tDb21wbGV0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciByZXF1aXJlcyA9IHRhc2suc2xpY2UoMCwgTWF0aC5hYnModGFzay5sZW5ndGggLSAxKSkgfHwgW107XG4gICAgICAgICAgICB2YXIgcmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9yZWR1Y2UocmVxdWlyZXMsIGZ1bmN0aW9uIChhLCB4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoYSAmJiByZXN1bHRzLmhhc093blByb3BlcnR5KHgpKTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKSAmJiAhcmVzdWx0cy5oYXNPd25Qcm9wZXJ0eShrKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocmVhZHkoKSkge1xuICAgICAgICAgICAgICAgIHRhc2tbdGFzay5sZW5ndGggLSAxXSh0YXNrQ2FsbGJhY2ssIHJlc3VsdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVhZHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFza1t0YXNrLmxlbmd0aCAtIDFdKHRhc2tDYWxsYmFjaywgcmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFzeW5jLndhdGVyZmFsbCA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKHRhc2tzLmNvbnN0cnVjdG9yICE9PSBBcnJheSkge1xuICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IHRvIHdhdGVyZmFsbCBtdXN0IGJlIGFuIGFycmF5IG9mIGZ1bmN0aW9ucycpO1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgd3JhcEl0ZXJhdG9yID0gZnVuY3Rpb24gKGl0ZXJhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzLnB1c2god3JhcEl0ZXJhdG9yKG5leHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXN5bmMuc2V0SW1tZWRpYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdG9yLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICB3cmFwSXRlcmF0b3IoYXN5bmMuaXRlcmF0b3IodGFza3MpKSgpO1xuICAgIH07XG5cbiAgICB2YXIgX3BhcmFsbGVsID0gZnVuY3Rpb24oZWFjaGZuLCB0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKHRhc2tzLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgZWFjaGZuLm1hcCh0YXNrcywgZnVuY3Rpb24gKGZuLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgICAgICBmbihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBlcnIsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgZWFjaGZuLmVhY2goX2tleXModGFza3MpLCBmdW5jdGlvbiAoaywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0YXNrc1trXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNba10gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5wYXJhbGxlbCA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgX3BhcmFsbGVsKHsgbWFwOiBhc3luYy5tYXAsIGVhY2g6IGFzeW5jLmVhY2ggfSwgdGFza3MsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMucGFyYWxsZWxMaW1pdCA9IGZ1bmN0aW9uKHRhc2tzLCBsaW1pdCwgY2FsbGJhY2spIHtcbiAgICAgICAgX3BhcmFsbGVsKHsgbWFwOiBfbWFwTGltaXQobGltaXQpLCBlYWNoOiBfZWFjaExpbWl0KGxpbWl0KSB9LCB0YXNrcywgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5zZXJpZXMgPSBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgIGlmICh0YXNrcy5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgIGFzeW5jLm1hcFNlcmllcyh0YXNrcywgZnVuY3Rpb24gKGZuLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgICAgICBmbihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBlcnIsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgYXN5bmMuZWFjaFNlcmllcyhfa2V5cyh0YXNrcyksIGZ1bmN0aW9uIChrLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRhc2tzW2tdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGFzeW5jLml0ZXJhdG9yID0gZnVuY3Rpb24gKHRhc2tzKSB7XG4gICAgICAgIHZhciBtYWtlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzW2luZGV4XS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZm4ubmV4dCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZuLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChpbmRleCA8IHRhc2tzLmxlbmd0aCAtIDEpID8gbWFrZUNhbGxiYWNrKGluZGV4ICsgMSk6IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGZuO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbWFrZUNhbGxiYWNrKDApO1xuICAgIH07XG5cbiAgICBhc3luYy5hcHBseSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkoXG4gICAgICAgICAgICAgICAgbnVsbCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBfY29uY2F0ID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBmbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHIgPSBbXTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGNiKSB7XG4gICAgICAgICAgICBmbih4LCBmdW5jdGlvbiAoZXJyLCB5KSB7XG4gICAgICAgICAgICAgICAgciA9IHIuY29uY2F0KHkgfHwgW10pO1xuICAgICAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5jb25jYXQgPSBkb1BhcmFsbGVsKF9jb25jYXQpO1xuICAgIGFzeW5jLmNvbmNhdFNlcmllcyA9IGRvU2VyaWVzKF9jb25jYXQpO1xuXG4gICAgYXN5bmMud2hpbHN0ID0gZnVuY3Rpb24gKHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodGVzdCgpKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXN5bmMud2hpbHN0KHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYXN5bmMuZG9XaGlsc3QgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIHRlc3QsIGNhbGxiYWNrKSB7XG4gICAgICAgIGl0ZXJhdG9yKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0ZXN0KCkpIHtcbiAgICAgICAgICAgICAgICBhc3luYy5kb1doaWxzdChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFzeW5jLnVudGlsID0gZnVuY3Rpb24gKHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRlc3QoKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFzeW5jLnVudGlsKHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYXN5bmMuZG9VbnRpbCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spIHtcbiAgICAgICAgaXRlcmF0b3IoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0ZXN0KCkpIHtcbiAgICAgICAgICAgICAgICBhc3luYy5kb1VudGlsKGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMucXVldWUgPSBmdW5jdGlvbiAod29ya2VyLCBjb25jdXJyZW5jeSkge1xuICAgICAgICBpZiAoY29uY3VycmVuY3kgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uY3VycmVuY3kgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIF9pbnNlcnQocSwgZGF0YSwgcG9zLCBjYWxsYmFjaykge1xuICAgICAgICAgIGlmKGRhdGEuY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICAgICAgICAgIGRhdGEgPSBbZGF0YV07XG4gICAgICAgICAgfVxuICAgICAgICAgIF9lYWNoKGRhdGEsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgICBkYXRhOiB0YXNrLFxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IGNhbGxiYWNrIDogbnVsbFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgICAgICAgICBxLnRhc2tzLnVuc2hpZnQoaXRlbSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcS50YXNrcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHEuc2F0dXJhdGVkICYmIHEudGFza3MubGVuZ3RoID09PSBjb25jdXJyZW5jeSkge1xuICAgICAgICAgICAgICAgICAgcS5zYXR1cmF0ZWQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUocS5wcm9jZXNzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3b3JrZXJzID0gMDtcbiAgICAgICAgdmFyIHEgPSB7XG4gICAgICAgICAgICB0YXNrczogW10sXG4gICAgICAgICAgICBjb25jdXJyZW5jeTogY29uY3VycmVuY3ksXG4gICAgICAgICAgICBzYXR1cmF0ZWQ6IG51bGwsXG4gICAgICAgICAgICBlbXB0eTogbnVsbCxcbiAgICAgICAgICAgIGRyYWluOiBudWxsLFxuICAgICAgICAgICAgcHVzaDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIF9pbnNlcnQocSwgZGF0YSwgZmFsc2UsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bnNoaWZ0OiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgX2luc2VydChxLCBkYXRhLCB0cnVlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh3b3JrZXJzIDwgcS5jb25jdXJyZW5jeSAmJiBxLnRhc2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFzayA9IHEudGFza3Muc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHEuZW1wdHkgJiYgcS50YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHEuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB3b3JrZXJzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2VycyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2suY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmNhbGxiYWNrLmFwcGx5KHRhc2ssIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5kcmFpbiAmJiBxLnRhc2tzLmxlbmd0aCArIHdvcmtlcnMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLmRyYWluKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBxLnByb2Nlc3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNiID0gb25seV9vbmNlKG5leHQpO1xuICAgICAgICAgICAgICAgICAgICB3b3JrZXIodGFzay5kYXRhLCBjYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxlbmd0aDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBxLnRhc2tzLmxlbmd0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBydW5uaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtlcnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBxO1xuICAgIH07XG5cbiAgICBhc3luYy5jYXJnbyA9IGZ1bmN0aW9uICh3b3JrZXIsIHBheWxvYWQpIHtcbiAgICAgICAgdmFyIHdvcmtpbmcgICAgID0gZmFsc2UsXG4gICAgICAgICAgICB0YXNrcyAgICAgICA9IFtdO1xuXG4gICAgICAgIHZhciBjYXJnbyA9IHtcbiAgICAgICAgICAgIHRhc2tzOiB0YXNrcyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgICAgICBzYXR1cmF0ZWQ6IG51bGwsXG4gICAgICAgICAgICBlbXB0eTogbnVsbCxcbiAgICAgICAgICAgIGRyYWluOiBudWxsLFxuICAgICAgICAgICAgcHVzaDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYoZGF0YS5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2VhY2goZGF0YSwgZnVuY3Rpb24odGFzaykge1xuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhc2ssXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gY2FsbGJhY2sgOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZ28uc2F0dXJhdGVkICYmIHRhc2tzLmxlbmd0aCA9PT0gcGF5bG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZ28uc2F0dXJhdGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUoY2FyZ28ucHJvY2Vzcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvY2VzczogZnVuY3Rpb24gcHJvY2VzcygpIHtcbiAgICAgICAgICAgICAgICBpZiAod29ya2luZykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FyZ28uZHJhaW4pIGNhcmdvLmRyYWluKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdHMgPSB0eXBlb2YgcGF5bG9hZCA9PT0gJ251bWJlcidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRhc2tzLnNwbGljZSgwLCBwYXlsb2FkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGFza3Muc3BsaWNlKDApO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRzID0gX21hcCh0cywgZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhc2suZGF0YTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmKGNhcmdvLmVtcHR5KSBjYXJnby5lbXB0eSgpO1xuICAgICAgICAgICAgICAgIHdvcmtpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdvcmtlcihkcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB3b3JraW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgICAgIF9lYWNoKHRzLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGVuZ3RoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2tzLmxlbmd0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBydW5uaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjYXJnbztcbiAgICB9O1xuXG4gICAgdmFyIF9jb25zb2xlX2ZuID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncy5jb25jYXQoW2Z1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uc29sZS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjb25zb2xlW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZWFjaChhcmdzLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGVbbmFtZV0oeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dKSk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBhc3luYy5sb2cgPSBfY29uc29sZV9mbignbG9nJyk7XG4gICAgYXN5bmMuZGlyID0gX2NvbnNvbGVfZm4oJ2RpcicpO1xuICAgIC8qYXN5bmMuaW5mbyA9IF9jb25zb2xlX2ZuKCdpbmZvJyk7XG4gICAgYXN5bmMud2FybiA9IF9jb25zb2xlX2ZuKCd3YXJuJyk7XG4gICAgYXN5bmMuZXJyb3IgPSBfY29uc29sZV9mbignZXJyb3InKTsqL1xuXG4gICAgYXN5bmMubWVtb2l6ZSA9IGZ1bmN0aW9uIChmbiwgaGFzaGVyKSB7XG4gICAgICAgIHZhciBtZW1vID0ge307XG4gICAgICAgIHZhciBxdWV1ZXMgPSB7fTtcbiAgICAgICAgaGFzaGVyID0gaGFzaGVyIHx8IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoa2V5IGluIG1lbW8pIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBtZW1vW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoa2V5IGluIHF1ZXVlcykge1xuICAgICAgICAgICAgICAgIHF1ZXVlc1trZXldLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVldWVzW2tleV0gPSBbY2FsbGJhY2tdO1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MuY29uY2F0KFtmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9ba2V5XSA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHEgPSBxdWV1ZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHF1ZXVlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcVtpXS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgbWVtb2l6ZWQubWVtbyA9IG1lbW87XG4gICAgICAgIG1lbW9pemVkLnVubWVtb2l6ZWQgPSBmbjtcbiAgICAgICAgcmV0dXJuIG1lbW9pemVkO1xuICAgIH07XG5cbiAgICBhc3luYy51bm1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoZm4udW5tZW1vaXplZCB8fCBmbikuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGFzeW5jLnRpbWVzID0gZnVuY3Rpb24gKGNvdW50LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudGVyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzeW5jLm1hcChjb3VudGVyLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy50aW1lc1NlcmllcyA9IGZ1bmN0aW9uIChjb3VudCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgY291bnRlci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhc3luYy5tYXBTZXJpZXMoY291bnRlciwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuY29tcG9zZSA9IGZ1bmN0aW9uICgvKiBmdW5jdGlvbnMuLi4gKi8pIHtcbiAgICAgICAgdmFyIGZucyA9IEFycmF5LnByb3RvdHlwZS5yZXZlcnNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICAgICAgICBhc3luYy5yZWR1Y2UoZm5zLCBhcmdzLCBmdW5jdGlvbiAobmV3YXJncywgZm4sIGNiKSB7XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgbmV3YXJncy5jb25jYXQoW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVyciA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgY2IoZXJyLCBuZXh0YXJncyk7XG4gICAgICAgICAgICAgICAgfV0pKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGF0LCBbZXJyXS5jb25jYXQocmVzdWx0cykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBfYXBwbHlFYWNoID0gZnVuY3Rpb24gKGVhY2hmbiwgZm5zIC8qYXJncy4uLiovKSB7XG4gICAgICAgIHZhciBnbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICAgICAgICByZXR1cm4gZWFjaGZuKGZucywgZnVuY3Rpb24gKGZuLCBjYikge1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MuY29uY2F0KFtjYl0pKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgICAgICAgcmV0dXJuIGdvLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdvO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBhc3luYy5hcHBseUVhY2ggPSBkb1BhcmFsbGVsKF9hcHBseUVhY2gpO1xuICAgIGFzeW5jLmFwcGx5RWFjaFNlcmllcyA9IGRvU2VyaWVzKF9hcHBseUVhY2gpO1xuXG4gICAgYXN5bmMuZm9yZXZlciA9IGZ1bmN0aW9uIChmbiwgY2FsbGJhY2spIHtcbiAgICAgICAgZnVuY3Rpb24gbmV4dChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZuKG5leHQpO1xuICAgICAgICB9XG4gICAgICAgIG5leHQoKTtcbiAgICB9O1xuXG4gICAgLy8gQU1EIC8gUmVxdWlyZUpTXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXN5bmM7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBOb2RlLmpzXG4gICAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBhc3luYztcbiAgICB9XG4gICAgLy8gaW5jbHVkZWQgZGlyZWN0bHkgdmlhIDxzY3JpcHQ+IHRhZ1xuICAgIGVsc2Uge1xuICAgICAgICByb290LmFzeW5jID0gYXN5bmM7XG4gICAgfVxuXG59KCkpO1xuIiwidmFyIHByb2Nlc3M9cmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpO2lmICghcHJvY2Vzcy5FdmVudEVtaXR0ZXIpIHByb2Nlc3MuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBFdmVudEVtaXR0ZXIgPSBleHBvcnRzLkV2ZW50RW1pdHRlciA9IHByb2Nlc3MuRXZlbnRFbWl0dGVyO1xudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbi8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4vL1xuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbn07XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgICB2YXIgbTtcbiAgICAgIGlmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAodHlwZW9mIGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgaWYgKGV2LnNvdXJjZSA9PT0gd2luZG93ICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiJdfQ==
;