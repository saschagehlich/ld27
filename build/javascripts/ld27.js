;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BackgroundActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BackgroundActor = (function(_super) {
  __extends(BackgroundActor, _super);

  function BackgroundActor(app, game) {
    var cloud, i, index, _i;
    this.app = app;
    this.game = game;
    BackgroundActor.__super__.constructor.call(this, this.game || this.app);
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.backgroundSprite = this.spritesAtlas.createSprite("background.png");
    this.goddamnCloudsMan = [];
    for (i = _i = 0; _i < 10; i = ++_i) {
      index = Math.floor(Math.random() * 3);
      cloud = this.spritesAtlas.createSprite("clouds/cloud-" + index + ".png");
      cloud.setPosition(Math.random() * this.app.getWidth() * 2, Math.random() * this.app.getHeight() / 2);
      cloud.opacity = 0.05 + Math.random() * 0.03;
      cloud.speedX = 10 + -Math.random() * 30;
      cloud.parallaxFactor = [0.5, 0.1, 0.3][index];
      this.goddamnCloudsMan.push(cloud);
    }
  }

  BackgroundActor.prototype.update = function(delta) {
    var cloud, _base, _i, _len, _ref, _results;
    _ref = this.goddamnCloudsMan;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cloud = _ref[_i];
      cloud.getPosition().add(cloud.speedX * delta * cloud.parallaxFactor, 0);
      if (cloud.getPosition().getX() - ((typeof (_base = this.game).getScroll === "function" ? _base.getScroll().getX() : void 0) || 0) * cloud.parallaxFactor + cloud.getWidth() < 0) {
        _results.push(cloud.setPosition(cloud.getPosition().getX() + this.app.getWidth() + Math.random() * (this.app.getWidth() * 2), Math.random() * this.app.getHeight() / 2));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  BackgroundActor.prototype.draw = function(context) {
    var cloud, _base, _i, _len, _ref, _ref1, _ref2;
    this.backgroundSprite.draw(context);
    context.save();
    _ref = this.goddamnCloudsMan;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cloud = _ref[_i];
      context.globalAlpha = cloud.opacity;
      cloud.draw(context, cloud.getPosition().getX() - ((typeof (_base = this.game).getScroll === "function" ? _base.getScroll().getX() : void 0) || 0) * cloud.parallaxFactor + ((_ref1 = this.game.globalRenderOffset) != null ? _ref1.getX() : void 0) || 0, cloud.getPosition().getY() + ((_ref2 = this.game.globalRenderOffset) != null ? _ref2.getY() : void 0) || 0);
    }
    return context.restore();
  };

  return BackgroundActor;

})(LDFW.Actor);

module.exports = BackgroundActor;


},{}],2:[function(require,module,exports){
var BlockActor, Config, Segment,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Config = require("../config/config.json");

Segment = require("../entities/segment.coffee");

BlockActor = (function(_super) {
  __extends(BlockActor, _super);

  BlockActor.prototype.availableBlocks = require("../config/available_blocks.json");

  function BlockActor(app, game, level, options) {
    var i, _i, _ref;
    this.app = app;
    this.game = game;
    this.level = level;
    this.options = options != null ? options : {};
    this.buildMode = this.options.buildMode || false;
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.map = null;
    this.gridPosition = new LDFW.Vector2();
    this.defaultStyle = Math.floor(Math.random() * Config.block_styles);
    this.style = this.options.style || this.defaultStyle;
    this.floatOffset = new LDFW.Vector2(0, 0);
    this.randomize();
    this.randomizeBlockStyles();
    for (i = _i = 0, _ref = Math.round(Math.random() * 3); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.rotate();
    }
    this.totalDelta = 0;
    this.loadSprites();
  }

  BlockActor.prototype.loadSprites = function() {
    var sprite, spriteIndex, style, styles, _base, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _results;
    this.blockSprites = {};
    styles = (function() {
      _results = [];
      for (var _i = 0, _ref = Config.block_styles; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    styles.push("broken");
    for (_j = 0, _len = styles.length; _j < _len; _j++) {
      style = styles[_j];
      if ((_base = this.blockSprites)[style] == null) {
        _base[style] = {};
      }
      for (spriteIndex = _k = 0, _ref1 = Config.sprites_per_block_style; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; spriteIndex = 0 <= _ref1 ? ++_k : --_k) {
        sprite = this.spritesAtlas.createSprite("blocks/" + style + "-" + spriteIndex + ".png");
        this.blockSprites[style][spriteIndex] = sprite;
      }
      this.blockSprites[style]["unbuildable"] = this.spritesAtlas.createSprite("blocks/" + style + "-unbuildable.png");
    }
    this.grassSprites = {};
    for (spriteIndex = _l = 0, _ref2 = Config.sprites_per_block_style; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; spriteIndex = 0 <= _ref2 ? ++_l : --_l) {
      sprite = this.spritesAtlas.createSprite("grass/grass-" + spriteIndex + ".png");
      this.grassSprites[spriteIndex] = sprite;
    }
    this.grassSprites["start"] = this.spritesAtlas.createSprite("grass/grass-start.png");
    this.grassSprites["end"] = this.spritesAtlas.createSprite("grass/grass-end.png");
    return this.grassSprites["single"] = this.spritesAtlas.createSprite("grass/grass-single.png");
  };

  BlockActor.prototype.setStyle = function(style) {
    this.style = style;
  };

  BlockActor.prototype.setDefaultStyle = function() {
    return this.style = this.defaultStyle;
  };

  BlockActor.prototype.randomizeBlockStyles = function() {
    var col, r, row, _i, _j, _len, _len1, _ref, _results;
    this.blockStyles = [];
    _ref = this.map;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      r = [];
      for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
        col = row[_j];
        r.push(Math.floor(Math.random() * Config.sprites_per_block_style));
      }
      _results.push(this.blockStyles.push(r));
    }
    return _results;
  };

  BlockActor.prototype.randomize = function() {
    var index, map, originalMap, r, row, segment, x, y, _i, _j, _len, _len1;
    index = Math.floor(Math.random() * this.availableBlocks.length);
    map = [];
    originalMap = this.availableBlocks[index];
    for (y = _i = 0, _len = originalMap.length; _i < _len; y = ++_i) {
      row = originalMap[y];
      r = [];
      for (x = _j = 0, _len1 = row.length; _j < _len1; x = ++_j) {
        segment = row[x];
        if (segment === 0) {
          r.push(0);
        } else {
          r.push(new Segment(this, this.level));
        }
      }
      map.push(r);
    }
    return this.map = map;
  };

  BlockActor.prototype.getGridPosition = function() {
    return this.gridPosition;
  };

  BlockActor.prototype.setGridPosition = function() {
    return this.gridPosition.set.apply(this.gridPosition, arguments);
  };

  BlockActor.prototype.rotate = function() {
    var i, j, newBlockStyles, newMap, _i, _j, _ref, _ref1;
    newMap = [];
    newBlockStyles = [];
    for (i = _i = _ref = this.map.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      for (j = _j = 0, _ref1 = this.map[i].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        if (!newMap.hasOwnProperty(j)) {
          newMap[j] = [];
          newBlockStyles[j] = [];
        }
        newMap[j].push(this.map[i][j]);
        newBlockStyles[j].push(this.blockStyles[i][j]);
      }
    }
    this.map = newMap;
    return this.blockStyles = newBlockStyles;
  };

  BlockActor.prototype.getMap = function() {
    return this.map;
  };

  BlockActor.prototype.getBlockStyles = function() {
    return this.blockStyles;
  };

  BlockActor.prototype.inBuildMode = function() {
    return this.buildMode;
  };

  BlockActor.prototype.setBuildMode = function(buildMode) {
    return this.buildMode = buildMode;
  };

  BlockActor.prototype.getStyle = function() {
    return this.style;
  };

  BlockActor.prototype.getFloatOffset = function() {
    return this.floatOffset;
  };

  BlockActor.prototype.steppedOn = function(x, width) {
    var i, map, row, segmentEnd, segmentOffset, y, _i, _len, _ref, _results;
    if (this.getStyle() !== "broken") {
      return;
    }
    segmentOffset = Math.floor(x / this.level.GRID_SIZE);
    segmentEnd = Math.ceil((segmentOffset + width) / this.level.GRID_SIZE);
    map = this.getMap();
    _ref = [segmentOffset, segmentEnd];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (y = _j = 0, _len1 = map.length; _j < _len1; y = ++_j) {
          row = map[y];
          if (!map[y][i]) {
            continue;
          }
          _results1.push(map[y][i].setFalling(true));
        }
        return _results1;
      })());
    }
    return _results;
  };

  BlockActor.prototype.update = function(delta) {
    var row, segment, x, y, _i, _j, _len, _len1, _ref;
    _ref = this.map;
    for (y = _i = 0, _len = _ref.length; _i < _len; y = ++_i) {
      row = _ref[y];
      for (x = _j = 0, _len1 = row.length; _j < _len1; x = ++_j) {
        segment = row[x];
        if (segment !== 0) {
          segment.update(delta);
        }
      }
    }
    if (!this.buildMode) {
      this.totalDelta += delta;
      return this.floatOffset.setY(Math.sin(this.totalDelta * 2) * 10);
    }
  };

  BlockActor.prototype.draw = function(context) {
    var blockStyles, buildBlockBuildable, drawGrass, grassSprite, grassXOffset, map, position, row, rx, ry, scroll, segment, sprite, spriteIndex, x, y, _i, _j, _len, _len1;
    scroll = this.level.getScroll();
    context.save();
    position = this.gridPosition.clone().multiply(this.level.GRID_SIZE).substract(scroll);
    buildBlockBuildable = this.level.isBuildBlockBuildable();
    map = this.getMap();
    blockStyles = this.getBlockStyles();
    for (y = _i = 0, _len = map.length; _i < _len; y = ++_i) {
      row = map[y];
      for (x = _j = 0, _len1 = row.length; _j < _len1; x = ++_j) {
        segment = row[x];
        if (segment === 0) {
          continue;
        }
        spriteIndex = blockStyles[y][x];
        sprite = this.blockSprites[this.style][spriteIndex];
        if (!buildBlockBuildable && this.buildMode) {
          sprite = this.blockSprites[this.style].unbuildable;
        }
        rx = position.x + x * this.level.GRID_SIZE;
        ry = position.y + y * this.level.GRID_SIZE + segment.getOffset().getY();
        rx += this.game.globalRenderOffset.x;
        ry += this.game.globalRenderOffset.y;
        if (!this.buildMode) {
          rx += this.floatOffset.x;
          ry += this.floatOffset.y;
        }
        if (rx > this.app.getWidth() || rx + sprite.getWidth() < 0) {
          continue;
        }
        if (this.buildMode) {
          context.globalAlpha = 0.5;
        }
        sprite.draw(context, rx, ry);
        drawGrass = true;
        if (y !== 0) {
          if (map[y - 1][x] !== 0) {
            drawGrass = false;
          }
        }
        if (drawGrass && this.style !== "broken") {
          grassSprite = this.grassSprites[spriteIndex];
          grassXOffset = 0;
          if (!row[x - 1] && !row[x + 1]) {
            grassSprite = this.grassSprites.single;
            grassXOffset = -2;
          } else if (!row[x - 1]) {
            grassSprite = this.grassSprites.start;
            grassXOffset = -2;
          } else if (!row[x + 1]) {
            grassSprite = this.grassSprites.end;
          }
          rx = position.x + x * this.level.GRID_SIZE + grassXOffset;
          ry = position.y + y * this.level.GRID_SIZE + segment.getOffset().getY();
          rx += this.game.globalRenderOffset.x;
          ry += this.game.globalRenderOffset.y;
          if (!this.buildMode) {
            rx += this.floatOffset.x;
            ry += this.floatOffset.y;
          }
          grassSprite.draw(context, rx, ry);
        }
      }
    }
    return context.restore();
  };

  return BlockActor;

})(LDFW.Actor);

module.exports = BlockActor;


},{"../config/available_blocks.json":15,"../config/config.json":16,"../entities/segment.coffee":18}],3:[function(require,module,exports){
var BackgroundActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BackgroundActor = (function(_super) {
  __extends(BackgroundActor, _super);

  function BackgroundActor(app) {
    this.app = app;
    BackgroundActor.__super__.constructor.call(this, this.app);
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.footerSprite = this.spritesAtlas.createSprite("splash/footer.png");
    this.initialY = this.app.getHeight();
    this.finalY = this.app.getHeight() - this.footerSprite.getHeight();
    this.setY(this.initialY);
    this.deltaSum = 0;
    this.animationDuration = 1;
  }

  BackgroundActor.prototype.update = function(delta) {
    this.setY((this.finalY - this.initialY) * (-Math.pow(2, -10 * this.deltaSum / this.animationDuration) + 1) + this.initialY);
    this.footerSprite.setPosition(this.position);
    this.deltaSum += delta;
    return this.deltaSum = Math.min(this.deltaSum, this.animationDuration);
  };

  BackgroundActor.prototype.draw = function(context) {
    return this.footerSprite.draw(context);
  };

  return BackgroundActor;

})(LDFW.Actor);

module.exports = BackgroundActor;


},{}],4:[function(require,module,exports){
var Config, FuckingPiranhasActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Config = require("../config/config.json");

FuckingPiranhasActor = (function(_super) {
  __extends(FuckingPiranhasActor, _super);

  function FuckingPiranhasActor(app, game, options) {
    var bubbleSprite, i, _i;
    this.app = app;
    this.game = game;
    this.options = options != null ? options : {};
    this.position = this.options.position || new LDFW.Vector2(0, 0);
    this.width = 6;
    this.height = 6;
    this.waterTop = 54;
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.backgroundSprite = this.spritesAtlas.createSprite("obstacles/fucking-piranhas/fucking-piranhas-background.png");
    this.glassSprite = this.spritesAtlas.createSprite("obstacles/fucking-piranhas/fucking-piranhas-glass.png");
    this.ploppSprite = this.spritesAtlas.createSprite("obstacles/fucking-piranhas/fucking-piranhas-plopp.png");
    this.bubbles = [];
    for (i = _i = 0; _i < 50; i = ++_i) {
      bubbleSprite = this.spritesAtlas.createSprite("obstacles/fucking-piranhas/fucking-piranhas-bubble.png");
      this.randomizePosition(bubbleSprite);
      bubbleSprite.ploppedAt = null;
      this.bubbles.push(bubbleSprite);
    }
  }

  FuckingPiranhasActor.prototype.randomizePosition = function(bubbleSprite) {
    return bubbleSprite.setPosition(Math.random() * (this.backgroundSprite.getWidth() - bubbleSprite.getWidth()), this.waterTop + Math.random() * (this.backgroundSprite.getHeight() - this.waterTop));
  };

  FuckingPiranhasActor.prototype.update = function(delta) {
    var bubble, curY, newY, pos, _i, _len, _ref, _results;
    _ref = this.bubbles;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bubble = _ref[_i];
      pos = bubble.getPosition();
      curY = pos.getY();
      newY = curY - 40 * delta;
      pos.setY(newY);
      if (pos.getY() <= this.waterTop && !bubble.ploppedAt) {
        _results.push(bubble.ploppedAt = Date.now());
      } else if (bubble.ploppedAt && Date.now() - bubble.ploppedAt > 500) {
        this.randomizePosition(bubble);
        _results.push(bubble.ploppedAt = null);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  FuckingPiranhasActor.prototype.draw = function(context, x, y) {
    var bubble, pos, _i, _len, _ref, _results;
    this.backgroundSprite.draw(context, x, y);
    this.glassSprite.draw(context, x, y);
    _ref = this.bubbles;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bubble = _ref[_i];
      pos = bubble.getPosition();
      if (pos.getY() > this.waterTop) {
        _results.push(bubble.draw(context, x + pos.getX(), y + pos.getY()));
      } else {
        _results.push(this.ploppSprite.draw(context, x + pos.getX(), y + this.waterTop - this.ploppSprite.getHeight()));
      }
    }
    return _results;
  };

  FuckingPiranhasActor.prototype.getWidth = function() {
    return this.width;
  };

  FuckingPiranhasActor.prototype.getHeight = function() {
    return this.height;
  };

  return FuckingPiranhasActor;

})(LDFW.Actor);

module.exports = FuckingPiranhasActor;


},{"../config/config.json":16}],5:[function(require,module,exports){
var HeadlineActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HeadlineActor = (function(_super) {
  __extends(HeadlineActor, _super);

  function HeadlineActor(app, game) {
    this.app = app;
    this.game = game;
    HeadlineActor.__super__.constructor.call(this, this.game);
    this.fontOffset = new LDFW.Vector2(16, 8);
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.fontsAtlas = this.app.getFontsAtlas();
    this.background = this.spritesAtlas.createSprite("ui/headline.png");
    this.font = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-white.fnt"), this.fontsAtlas.findRegion("pixel-8-white.png"));
    this.redFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-red.fnt"), this.fontsAtlas.findRegion("pixel-8-red.png"));
  }

  HeadlineActor.prototype.drawScore = function(context) {
    var scoreBounds, scoreText;
    scoreText = "" + (this.game.getScore()) + "m";
    scoreBounds = this.font.getBounds(scoreText);
    return this.font.drawText(context, scoreText, this.app.getWidth() - this.fontOffset.getX() - scoreBounds.getWidth(), this.fontOffset.getY());
  };

  HeadlineActor.prototype.drawPowerup = function(context) {
    /* Draw powerup*/

    var captionBounds, captionText, fullBounds, fullText, powerup, powerupBounds, powerupText;
    if (powerup = this.game.getActivePowerup()) {
      captionText = "CURRENT POWERUP: ";
      powerupText = powerup.sub;
      fullText = captionText + powerupText;
      fullBounds = this.redFont.getBounds(fullText);
      captionBounds = this.font.getBounds(captionText);
      powerupBounds = this.redFont.getBounds(powerupText);
      this.font.drawText(context, captionText, this.app.getWidth() / 2 - fullBounds.getWidth() / 2, this.fontOffset.getY());
      return this.redFont.drawText(context, powerupText, this.app.getWidth() / 2 - fullBounds.getWidth() / 2 + captionBounds.getWidth(), this.fontOffset.getY());
    }
  };

  HeadlineActor.prototype.draw = function(context) {
    this.background.draw(context);
    this.drawScore(context);
    return this.drawPowerup(context);
  };

  return HeadlineActor;

})(LDFW.Actor);

module.exports = HeadlineActor;


},{}],6:[function(require,module,exports){
var HighscoreActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HighscoreActor = (function(_super) {
  __extends(HighscoreActor, _super);

  function HighscoreActor(app, game) {
    var _this = this;
    this.app = app;
    this.game = game;
    HighscoreActor.__super__.constructor.call(this, this.game);
    this.fontsAtlas = this.app.getFontsAtlas();
    this.scoreFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-white.fnt"), this.fontsAtlas.findRegion("pixel-8-white.png"));
    this.headlineFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-24-white.fnt"), this.fontsAtlas.findRegion("pixel-24-white.png"));
    this.redFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-red.fnt"), this.fontsAtlas.findRegion("pixel-8-red.png"));
    this.blockInput = false;
    this.keyboard = this.app.getKeyboard();
    this.keyboard.on("keydown", function(e) {
      if (_this.blockInput) {
        return;
      }
      if (e.keyCode === _this.keyboard.Keys.ESC) {
        _this.app.switchToSplashScreen();
        return _this.blockInput = true;
      }
    });
    this.scores = null;
  }

  HighscoreActor.prototype.draw = function(context) {
    this.drawHeadline(context);
    if (!this.scores) {
      this.drawLoading(context);
    } else {
      this.drawScores(context);
    }
    return this.drawQuitMessage(context);
  };

  HighscoreActor.prototype.drawQuitMessage = function(context) {
    var escText, fullBounds, fullQuitText, quitText, rBounds;
    escText = "PRESS ESC ";
    quitText = "TO QUIT TO MENU";
    fullQuitText = escText + quitText;
    rBounds = this.scoreFont.getBounds(escText);
    fullBounds = this.redFont.getBounds(fullQuitText);
    this.redFont.drawText(context, escText, this.app.getWidth() / 2 - fullBounds.width / 2, 400);
    return this.scoreFont.drawText(context, quitText, this.app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 400);
  };

  HighscoreActor.prototype.drawScores = function(context) {
    var score, scoreBounds, scoreText, yOffset, _i, _len, _ref, _results;
    yOffset = 130;
    _ref = this.scores.slice(0, 10);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      score = _ref[_i];
      this.scoreFont.drawText(context, score.name, 100, yOffset);
      scoreText = score.score + "m";
      scoreBounds = this.scoreFont.getBounds(scoreText);
      this.scoreFont.drawText(context, scoreText, this.app.getWidth() - 100 - scoreBounds.width, yOffset);
      _results.push(yOffset += 20);
    }
    return _results;
  };

  HighscoreActor.prototype.drawHeadline = function(context) {
    var headlineBounds, headlineText;
    headlineText = "HIGHSCORES";
    headlineBounds = this.headlineFont.getBounds(headlineText);
    return this.headlineFont.drawText(context, headlineText, this.app.getWidth() / 2 - headlineBounds.getWidth() / 2, 60);
  };

  HighscoreActor.prototype.drawLoading = function(context) {
    var loadingBounds, loadingText;
    loadingText = "LOADING...";
    loadingBounds = this.scoreFont.getBounds(loadingText);
    return this.scoreFont.drawText(context, loadingText, this.app.getWidth() / 2 - loadingBounds.getWidth() / 2, 132);
  };

  HighscoreActor.prototype.setScores = function(scores) {
    this.scores = scores;
  };

  return HighscoreActor;

})(LDFW.Actor);

module.exports = HighscoreActor;


},{}],7:[function(require,module,exports){
var Config, LevelActor, Powerups,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Config = require("../config/config.json");

Powerups = require("../powerups.coffee");

LevelActor = (function(_super) {
  __extends(LevelActor, _super);

  function LevelActor(app, game) {
    this.app = app;
    this.game = game;
    LevelActor.__super__.constructor.call(this, this.game);
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.prepareSprites();
    this.level = this.game.getLevel();
  }

  LevelActor.prototype.prepareSprites = function() {
    var sprite, spriteIndex, _i, _j, _ref, _ref1;
    this.grassSprites = {};
    for (spriteIndex = _i = 0, _ref = Config.sprites_per_block_style; 0 <= _ref ? _i < _ref : _i > _ref; spriteIndex = 0 <= _ref ? ++_i : --_i) {
      sprite = this.spritesAtlas.createSprite("grass/grass-" + spriteIndex + ".png");
      this.grassSprites[spriteIndex] = sprite;
    }
    this.grassSprites["start"] = this.spritesAtlas.createSprite("grass/grass-start.png");
    this.grassSprites["end"] = this.spritesAtlas.createSprite("grass/grass-end.png");
    this.grassSprites["single"] = this.spritesAtlas.createSprite("grass/grass-single.png");
    this.tileSprites = {};
    for (spriteIndex = _j = 0, _ref1 = Config.sprites_per_block_style; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; spriteIndex = 0 <= _ref1 ? ++_j : --_j) {
      sprite = this.spritesAtlas.createSprite("platform/platform-" + spriteIndex + ".png");
      this.tileSprites[spriteIndex] = sprite;
    }
    this.tileSprites["start"] = this.spritesAtlas.createSprite("platform/platform-start.png");
    return this.tileSprites["end"] = this.spritesAtlas.createSprite("platform/platform-end.png");
  };

  LevelActor.prototype.update = function(delta) {
    var block, blocks, obstacle, obstacles, _i, _j, _len, _len1, _results;
    obstacles = this.level.getObstacles();
    for (_i = 0, _len = obstacles.length; _i < _len; _i++) {
      obstacle = obstacles[_i];
      obstacle.update(delta);
    }
    blocks = this.level.getBlocks();
    _results = [];
    for (_j = 0, _len1 = blocks.length; _j < _len1; _j++) {
      block = blocks[_j];
      _results.push(block.update(delta));
    }
    return _results;
  };

  LevelActor.prototype.draw = function(context) {
    context.save();
    this.drawPlatforms(context);
    this.drawBlocks(context);
    this.drawObstacles(context);
    this.drawBuildBlock(context);
    return context.restore();
  };

  LevelActor.prototype.drawObstacles = function(context) {
    var obstacle, obstacles, obstaclesRendered, position, scroll, _i, _len;
    obstacles = this.level.getObstacles();
    scroll = this.level.getScroll();
    obstaclesRendered = 0;
    for (_i = 0, _len = obstacles.length; _i < _len; _i++) {
      obstacle = obstacles[_i];
      position = obstacle.getPosition().clone().multiply(this.level.GRID_SIZE).add(this.game.globalRenderOffset);
      obstacle.draw(context, position.x - scroll.getX(), position.y - scroll.getY());
      obstaclesRendered++;
    }
    return {
      obstacles: obstaclesRendered
    };
  };

  LevelActor.prototype.drawPlatforms = function(context) {
    var grassRendered, grassSprite, grassXOffset, height, platform, platforms, position, rx, ry, scroll, spriteIndex, stylesMap, tileSprite, tilesRendered, width, x, y, _i, _j, _k, _l, _len, _ref, _ref1, _ref2;
    tilesRendered = 0;
    grassRendered = 0;
    platforms = this.level.getPlatforms();
    scroll = this.level.getScroll();
    for (_i = 0, _len = platforms.length; _i < _len; _i++) {
      platform = platforms[_i];
      stylesMap = platform.getStylesMap();
      position = platform.getPosition().clone().multiply(this.level.GRID_SIZE).add(this.game.globalRenderOffset);
      width = platform.getWidth() * this.level.GRID_SIZE;
      height = platform.getHeight() * this.level.GRID_SIZE;
      for (y = _j = 0, _ref = platform.getHeight(); 0 <= _ref ? _j < _ref : _j > _ref; y = 0 <= _ref ? ++_j : --_j) {
        for (x = _k = 0, _ref1 = platform.getWidth(); 0 <= _ref1 ? _k < _ref1 : _k > _ref1; x = 0 <= _ref1 ? ++_k : --_k) {
          spriteIndex = stylesMap[y][x];
          tileSprite = this.tileSprites[spriteIndex];
          if (x === 0) {
            tileSprite = this.tileSprites.start;
          }
          if (x === platform.getWidth() - 1) {
            tileSprite = this.tileSprites.end;
          }
          rx = position.x + x * this.level.GRID_SIZE - scroll.getX();
          ry = position.y + y * this.level.GRID_SIZE - scroll.getY();
          if (rx + tileSprite.getWidth() < 0 || rx > this.app.getWidth()) {
            continue;
          }
          tilesRendered++;
          tileSprite.draw(context, rx, ry);
        }
      }
      for (x = _l = 0, _ref2 = platform.width; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; x = 0 <= _ref2 ? ++_l : --_l) {
        grassSprite = this.grassSprites[0];
        grassXOffset = 0;
        if (platform.width === 1) {
          grassSprite = this.grassSprites.single;
          grassXOffset = -2;
        } else if (x === 0) {
          grassSprite = this.grassSprites.start;
          grassXOffset = -2;
        } else if (x === platform.width - 1) {
          grassSprite = this.grassSprites.end;
        }
        rx = position.x + x * this.level.GRID_SIZE + grassXOffset - scroll.getX();
        ry = position.y - scroll.getY();
        if (rx + grassSprite.getWidth() < 0 || rx > this.app.getWidth()) {
          continue;
        }
        grassRendered++;
        grassSprite.draw(context, rx, ry);
      }
    }
    return {
      tiles: tilesRendered,
      grass: grassRendered
    };
  };

  LevelActor.prototype.drawBuildBlock = function(context) {
    if (!this.level.inBuildMode()) {
      return;
    }
    return this.level.getBuildBlock().draw(context);
  };

  LevelActor.prototype.drawBlocks = function(context) {
    var block, blocks, _i, _len, _results;
    blocks = this.level.getBlocks();
    _results = [];
    for (_i = 0, _len = blocks.length; _i < _len; _i++) {
      block = blocks[_i];
      _results.push(block.draw(context));
    }
    return _results;
  };

  return LevelActor;

})(LDFW.Actor);

module.exports = LevelActor;


},{"../config/config.json":16,"../powerups.coffee":23}],8:[function(require,module,exports){
var Char, LogoActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Char = (function() {
  function Char(char, atlas) {
    this.char = char;
    this.sprite = atlas.createSprite("logo/" + char + ".png");
    this.initialY = -this.sprite.getHeight();
    this.toY = 110;
    this.position = new LDFW.Vector2(0, this.initialY);
    this.sumDelta = 0;
    this.animDuration = 1.5;
    this.delay = Math.random() * 0.5;
    this.sprite.setPosition(this.position);
  }

  Char.prototype.update = function(delta) {
    var overshoot, time, y;
    this.sumDelta += delta;
    if (this.sumDelta < this.delay) {
      return;
    }
    overshoot = 1.70158;
    if (this.sumDelta - this.delay < this.animDuration) {
      y = (this.toY - this.initialY) * ((time = (this.sumDelta - this.delay) / this.animDuration - 1) * time * ((overshoot + 1) * time + overshoot) + 1) + this.initialY;
    } else {
      y = this.toY;
    }
    y += Math.sin((-this.sumDelta - this.delay) * 4) * 5;
    this.position.setY(y);
    return this.sprite.setPosition(this.position);
  };

  Char.prototype.draw = function(context) {
    return this.sprite.draw(context);
  };

  return Char;

})();

LogoActor = (function(_super) {
  __extends(LogoActor, _super);

  function LogoActor(app) {
    var char, charObj, i, sumWidth, totalWidth, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    this.app = app;
    LogoActor.__super__.constructor.call(this, this.app);
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.chars = [];
    _ref = "runtris";
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      char = _ref[_i];
      charObj = new Char(char, this.spritesAtlas);
      this.chars.push(charObj);
    }
    totalWidth = 0;
    _ref1 = this.chars;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      char = _ref1[_j];
      totalWidth += char.sprite.getWidth() + 10;
    }
    sumWidth = 0;
    _ref2 = this.chars;
    for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
      char = _ref2[i];
      char.position.setX(this.app.getWidth() / 2 - totalWidth / 2 + sumWidth);
      sumWidth += char.sprite.getWidth() + 10;
    }
  }

  LogoActor.prototype.update = function(delta) {
    var char, _i, _len, _ref, _results;
    _ref = this.chars;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      char = _ref[_i];
      _results.push(char.update(delta));
    }
    return _results;
  };

  LogoActor.prototype.draw = function(context) {
    var char, _i, _len, _ref, _results;
    _ref = this.chars;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      char = _ref[_i];
      _results.push(char.draw(context));
    }
    return _results;
  };

  return LogoActor;

})(LDFW.Actor);

module.exports = LogoActor;


},{}],9:[function(require,module,exports){
var Keyboard, MenuActor,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Keyboard = require("../utilities/keyboard.coffee");

MenuActor = (function(_super) {
  __extends(MenuActor, _super);

  function MenuActor(app) {
    this.app = app;
    this.onKeyDown = __bind(this.onKeyDown, this);
    MenuActor.__super__.constructor.call(this, this.app);
    this.fontsAtlas = this.app.getFontsAtlas();
    this.opacity = 0;
    this.menuFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-16-white.fnt"), this.fontsAtlas.findRegion("pixel-16-white.png"));
    this.selectedIndex = 0;
    this.options = ["START", "HIGHSCORE", "ABOUT"];
  }

  MenuActor.prototype.onKeyDown = function(e) {
    var keyboard;
    keyboard = this.app.getKeyboard();
    if (e.keyCode === keyboard.Keys.UP) {
      this.selectedIndex--;
      if (this.selectedIndex < 0) {
        return this.selectedIndex = this.options.length - 1;
      }
    } else if (e.keyCode === keyboard.Keys.DOWN) {
      this.selectedIndex++;
      if (this.selectedIndex > this.options.length - 1) {
        return this.selectedIndex = 0;
      }
    }
  };

  MenuActor.prototype.update = function(delta) {
    this.opacity += delta;
    return this.opacity = Math.min(1, this.opacity);
  };

  MenuActor.prototype.draw = function(context) {
    var i, lineHeight, option, optionBounds, optionText, yOffset, _i, _len, _ref;
    context.save();
    context.globalAlpha = this.opacity;
    yOffset = 250;
    lineHeight = 40;
    _ref = this.options;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      option = _ref[i];
      optionText = option;
      if (this.selectedIndex === i) {
        optionText = "[ " + option + " ]";
      }
      optionBounds = this.menuFont.getBounds(optionText);
      this.menuFont.drawText(context, optionText, this.app.getWidth() / 2 - optionBounds.width / 2, yOffset + i * lineHeight);
    }
    return context.restore();
  };

  MenuActor.prototype.getSelectedIndex = function() {
    return this.selectedIndex;
  };

  return MenuActor;

})(LDFW.Actor);

module.exports = MenuActor;


},{"../utilities/keyboard.coffee":32}],10:[function(require,module,exports){
var FuckingPiranhasActor, MinimapActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FuckingPiranhasActor = require("./fuckingpiranhasactor.coffee");

MinimapActor = (function(_super) {
  __extends(MinimapActor, _super);

  function MinimapActor(app, game) {
    this.app = app;
    this.game = game;
    MinimapActor.__super__.constructor.call(this, this.game);
    this.level = this.game.getLevel();
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.piranhasSprite = this.spritesAtlas.createSprite("ui/minimap-fucking-piranhas.png");
    this.background = this.spritesAtlas.createSprite("ui/minimap.png");
    this.background.setPosition(0, this.app.getHeight() - this.background.getHeight());
    this.fontsAtlas = this.app.getFontsAtlas();
    this.font = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-white.fnt"), this.fontsAtlas.findRegion("pixel-8-white.png"));
  }

  MinimapActor.prototype.update = function(delta) {};

  MinimapActor.prototype.draw = function(context) {
    this.background.draw(context);
    return this.drawMinimapContents(context);
  };

  MinimapActor.prototype.drawMinimapContents = function(context) {
    var blocks, drawOptions, drawPadding, obstacles, platforms, player, scale, scroll;
    platforms = this.level.getPlatforms();
    blocks = this.level.getBlocks();
    obstacles = this.level.getObstacles();
    player = this.game.getPlayer();
    drawPadding = new LDFW.Vector2(8, 8);
    drawOptions = {
      offset: this.background.getPosition().clone().floor(),
      padding: drawPadding,
      height: this.background.getHeight() - drawPadding.getY() * 2,
      width: this.background.getWidth() - drawPadding.getX() * 2
    };
    scale = drawOptions.height / this.app.getHeight();
    drawOptions.scaledGridSize = Math.round(this.level.GRID_SIZE * scale);
    drawOptions.scale = scale;
    scroll = this.game.getScroll().clone().multiply(scale).substract(this.app.getWidth() / 2, 0);
    if (scroll.getX() * scale < drawOptions.width / 2) {
      this.drawStartIndicator(context, scroll, drawOptions);
    }
    this.drawPlayer(context, player, scroll, drawOptions);
    this.drawPlatforms(context, platforms, scroll, drawOptions);
    this.drawObstacles(context, obstacles, scroll, drawOptions);
    return this.drawBlocks(context, blocks, scroll, drawOptions);
  };

  MinimapActor.prototype.drawStartIndicator = function(context, scroll, options) {
    var startBounds, startText;
    context.save();
    context.globalAlpha = 0.03;
    context.fillStyle = "rgba(255, 255, 255)";
    context.fillRect(-scroll.getX(), options.offset.getY() + options.padding.getY(), 2, options.height);
    context.globalAlpha = 0.1;
    startText = "START >";
    startBounds = this.font.getBounds(startText);
    this.font.drawText(context, startText, -scroll.getX() - startBounds.width - 8, options.offset.getY() + options.padding.getY() + options.height / 2 - startBounds.getHeight() / 2);
    return context.restore();
  };

  MinimapActor.prototype.drawPlayer = function(context, player, scroll, options) {
    var position, rh, rmy, roy, rw, rx, ry;
    context.save();
    context.fillStyle = "#af2f2f";
    position = player.getPosition().clone().multiply(options.scale);
    roy = options.offset.getY() + options.padding.getY();
    rmy = options.offset.getY() + options.padding.getY() + options.width;
    rx = Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX());
    ry = Math.floor(options.offset.getY() + options.padding.getY() + position.getY() - options.scaledGridSize * 2);
    rw = options.scaledGridSize * 3;
    rh = options.scaledGridSize;
    if (ry < roy) {
      rh -= roy - ry;
      ry = roy;
    }
    if (ry + rh < roy) {
      rh = 0;
    }
    if (ry + rh > rmy) {
      rh -= (ry + rh) - rmy;
    }
    context.fillRect(rx, ry, rw, rh);
    rx = Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX() + options.scaledGridSize);
    ry = Math.floor(options.offset.getY() + options.padding.getY() + position.getY() - options.scaledGridSize * 3);
    rw = options.scaledGridSize;
    rh = options.scaledGridSize * 3;
    if (ry < roy) {
      rh += ry - roy;
      ry = roy;
    }
    if (ry + rh > rmy) {
      rh -= (ry + rh) - rmy;
    }
    context.fillRect(rx, ry, rw, rh);
    return context.restore();
  };

  MinimapActor.prototype.drawBlocks = function(context, blocks, scroll, options) {
    var block, map, position, rh, rmx, row, rox, rw, rx, ry, scaledX, scaledY, segment, x, y, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = blocks.length; _i < _len; _i++) {
      block = blocks[_i];
      position = block.getGridPosition().clone().multiply(options.scaledGridSize);
      map = block.getMap();
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (y = _j = 0, _len1 = map.length; _j < _len1; y = ++_j) {
          row = map[y];
          _results1.push((function() {
            var _k, _len2, _results2;
            _results2 = [];
            for (x = _k = 0, _len2 = row.length; _k < _len2; x = ++_k) {
              segment = row[x];
              if (segment === 0) {
                continue;
              }
              scaledX = x * options.scaledGridSize;
              scaledY = y * options.scaledGridSize;
              rx = Math.floor(options.offset.getX() + options.padding.getX() + position.getX() + scaledX - scroll.getX());
              ry = Math.floor(options.offset.getY() + options.padding.getY() + position.getY() + scaledY);
              rw = options.scaledGridSize;
              rh = options.scaledGridSize;
              rox = options.offset.getX() + options.padding.getX();
              rmx = options.offset.getX() + options.padding.getX() + options.width;
              if (rx + rw < rox || rx > rmx) {
                continue;
              }
              if (rx < rox) {
                rw += rx - rox;
                rx = rox;
              }
              _results2.push(context.fillRect(rx, ry, rw, rh));
            }
            return _results2;
          })());
        }
        return _results1;
      })());
    }
    return _results;
  };

  MinimapActor.prototype.drawObstacles = function(context, obstacles, scroll, options) {
    var height, obstacle, position, rh, rmx, rox, rw, rx, ry, width, _i, _len;
    context.save();
    context.fillStyle = "#af2f2f";
    for (_i = 0, _len = obstacles.length; _i < _len; _i++) {
      obstacle = obstacles[_i];
      position = obstacle.getPosition().clone().multiply(options.scaledGridSize);
      width = obstacle.getWidth() * options.scaledGridSize;
      height = obstacle.getHeight() * options.scaledGridSize;
      rx = Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX());
      ry = Math.floor(options.offset.getY() + options.padding.getY() + position.getY());
      rw = width;
      rh = height;
      rox = options.offset.getX() + options.padding.getX();
      rmx = options.offset.getX() + options.padding.getX() + options.width;
      if (rx + rw < rox || rx > rmx) {
        continue;
      }
      if (rx < rox) {
        rw += rx - rox;
        rx = rox;
      }
      if (rx + rw > rmx) {
        rw -= (rx + rw) - rmx;
      }
      context.fillRect(rx, ry, rw, rh);
      if (obstacle instanceof FuckingPiranhasActor) {
        this.piranhasSprite.draw(context, Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX() + +width / 2 - this.piranhasSprite.getWidth() / 2), Math.floor(options.offset.getY() + options.padding.getY() + position.getY() + +height / 2 - this.piranhasSprite.getHeight() / 2));
      }
    }
    return context.restore();
  };

  MinimapActor.prototype.drawPlatforms = function(context, platforms, scroll, options) {
    var height, platform, position, rh, rmx, rox, rw, rx, ry, width, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = platforms.length; _i < _len; _i++) {
      platform = platforms[_i];
      position = platform.getPosition().clone().multiply(options.scaledGridSize);
      width = platform.getWidth();
      height = platform.getHeight();
      context.fillStyle = "white";
      rx = options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX();
      ry = options.offset.getY() + options.padding.getY() + position.getY();
      rw = width * options.scaledGridSize;
      rh = height * options.scaledGridSize;
      rox = options.offset.getX() + options.padding.getX();
      rmx = options.offset.getX() + options.padding.getX() + options.width;
      if (rx + rw < rox || rx > rmx) {
        continue;
      }
      if (rx < rox) {
        rw += rx - rox;
        rx = rox;
      }
      if (rx + rw > rmx) {
        rw -= (rx + rw) - rmx;
      }
      context.fillRect(rx + options.scaledGridSize, ry, rw - options.scaledGridSize * 2, options.scaledGridSize);
      _results.push(context.fillRect(rx, ry + options.scaledGridSize, rw, rh - options.scaledGridSize));
    }
    return _results;
  };

  return MinimapActor;

})(LDFW.Actor);

module.exports = MinimapActor;


},{"./fuckingpiranhasactor.coffee":4}],11:[function(require,module,exports){
var PlayerActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlayerActor = (function(_super) {
  __extends(PlayerActor, _super);

  function PlayerActor(app, game) {
    this.app = app;
    PlayerActor.__super__.constructor.call(this, this.game);
    this.game = game;
    this.level = this.game.getLevel();
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.idleSprite = this.spritesAtlas.createSprite("player/idle.png");
    this.player = this.game.getPlayer();
    this.player.setSize(this.idleSprite.getWidth(), this.idleSprite.getHeight());
    this.runAnimSprite = this.spritesAtlas.createAnimSprite("player/run.png", 2, 0.05);
    this.offgroundAnimSprite = this.spritesAtlas.createAnimSprite("player/offground.png", 3, 0.1);
    this.caretSprite = this.spritesAtlas.createSprite("ui/caret.png");
  }

  PlayerActor.prototype.update = function(delta) {
    this.runAnimSprite.update(delta);
    return this.offgroundAnimSprite.update(delta);
  };

  PlayerActor.prototype.draw = function(context) {
    var mirrored, offset, onGroundObject, playerPosition, rx, ry, scroll;
    playerPosition = this.player.getPosition();
    scroll = this.level.getScroll();
    rx = playerPosition.x - scroll.getX();
    ry = playerPosition.y - this.idleSprite.getHeight() - scroll.getY();
    rx += this.game.globalRenderOffset.x;
    ry += this.game.globalRenderOffset.y;
    mirrored = this.player.getDirection() === -1;
    if (this.player.isOnGround()) {
      onGroundObject = this.player.getOnGroundObject();
      if (offset = typeof onGroundObject.getFloatOffset === "function" ? onGroundObject.getFloatOffset() : void 0) {
        ry += offset.y;
      }
    }
    if (!this.player.isOnGround()) {
      this.offgroundAnimSprite.draw(context, rx, ry, mirrored);
    } else if (this.player.getVelocity().getX() !== 0) {
      this.runAnimSprite.draw(context, rx, ry, mirrored);
    } else {
      this.idleSprite.draw(context, rx, ry, mirrored);
    }
    if (ry + this.idleSprite.getHeight() < 40) {
      return this.caretSprite.draw(context, rx + this.idleSprite.getWidth() / 2 - this.caretSprite.getWidth() / 2, 40);
    }
  };

  return PlayerActor;

})(LDFW.Actor);

module.exports = PlayerActor;


},{}],12:[function(require,module,exports){
var PowerupActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PowerupActor = (function(_super) {
  __extends(PowerupActor, _super);

  function PowerupActor(app, game) {
    this.app = app;
    this.game = game;
    PowerupActor.__super__.constructor.call(this, this.game);
    this.fontsAtlas = this.app.getFontsAtlas();
    this.powerupFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-16-white.fnt"), this.fontsAtlas.findRegion("pixel-16-white.png"));
    this.subFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-white.fnt"), this.fontsAtlas.findRegion("pixel-8-white.png"));
  }

  PowerupActor.prototype.draw = function(context) {
    var powerup, powerupBounds, subBounds;
    powerup = this.game.getActivePowerup();
    if (powerup == null) {
      return;
    }
    powerupBounds = this.powerupFont.getBounds(powerup.name);
    this.powerupFont.drawText(context, powerup.name, this.app.getWidth() / 2 - powerupBounds.width / 2, 50);
    subBounds = this.subFont.getBounds(powerup.sub);
    return this.subFont.drawText(context, powerup.sub, this.app.getWidth() / 2 - subBounds.width / 2, 50 + powerupBounds.height + 4);
  };

  return PowerupActor;

})(LDFW.Actor);

module.exports = PowerupActor;


},{}],13:[function(require,module,exports){
var TimerActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TimerActor = (function(_super) {
  __extends(TimerActor, _super);

  function TimerActor(app, game) {
    this.app = app;
    this.game = game;
    TimerActor.__super__.constructor.call(this, this.game);
    this.fontsAtlas = this.app.getFontsAtlas();
    this.timerFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-16-white.fnt"), this.fontsAtlas.findRegion("pixel-16-white.png"));
    this.textFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-white.fnt"), this.fontsAtlas.findRegion("pixel-8-white.png"));
  }

  TimerActor.prototype.drawPowerupCountdown = function(context) {
    var powerupTimeLeft, timeleftBounds, untilBounds, untilText;
    powerupTimeLeft = Math.ceil(this.game.getPowerupTimeleft() / 1000).toString() + " SECONDS";
    timeleftBounds = this.timerFont.getBounds(powerupTimeLeft);
    this.timerFont.drawText(context, powerupTimeLeft, this.app.getWidth() / 2 - timeleftBounds.getWidth() / 2, 340);
    untilText = "UNTIL THE NEXT POWERUP";
    untilBounds = this.textFont.getBounds(untilText);
    return this.textFont.drawText(context, untilText, this.app.getWidth() / 2 - untilBounds.getWidth() / 2, 370);
  };

  TimerActor.prototype.draw = function(context) {
    return this.drawPowerupCountdown(context);
  };

  return TimerActor;

})(LDFW.Actor);

module.exports = TimerActor;


},{}],14:[function(require,module,exports){
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


},{"./ld27.coffee":20}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
module.exports=module.exports={
  "block_styles": 3,
  "sprites_per_block_style": 3,

  "ui_minimap_height": 74,
  "highscore_host": "//localhost:8080"
}

},{}],17:[function(require,module,exports){
var Config, Platform;

Config = require("../config/config.json");

Platform = (function() {
  function Platform(app, game, options) {
    var x, y, _i, _j, _ref, _ref1;
    this.app = app;
    this.game = game;
    this.options = options != null ? options : {};
    this.position = this.options.position || new LDFW.Vector2(2, 4);
    this.width = this.options.width || 3;
    this.height = this.options.height || 10;
    this.stylesMap = [];
    for (y = _i = 0, _ref = this.height; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
      this.stylesMap[y] = [];
      for (x = _j = 0, _ref1 = this.width; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        this.stylesMap[y].push(Math.floor(Math.random() * Config.sprites_per_block_style));
      }
    }
  }

  Platform.prototype.getPosition = function() {
    return this.position;
  };

  Platform.prototype.getWidth = function() {
    return this.width;
  };

  Platform.prototype.getHeight = function() {
    return this.height;
  };

  Platform.prototype.getStylesMap = function() {
    return this.stylesMap;
  };

  return Platform;

})();

module.exports = Platform;


},{"../config/config.json":16}],18:[function(require,module,exports){
var Segment;

Segment = (function() {
  Segment.prototype.fallingDelay = 300;

  function Segment(block, level) {
    this.block = block;
    this.level = level;
    this.offset = new LDFW.Vector2(0, 0);
    this.velocity = new LDFW.Vector2();
    this.falling = false;
    this.fallingDelayStart = 0;
  }

  Segment.prototype.update = function(delta) {
    var gravity, gravityStep, velocityStep;
    if (this.falling && Date.now() - this.fallingDelayStart >= this.fallingDelay) {
      gravity = this.level.getGravity().clone();
      gravityStep = gravity.multiply(delta);
      this.velocity.add(gravityStep);
      velocityStep = this.velocity.clone().multiply(delta);
      return this.offset.add(velocityStep);
    }
  };

  Segment.prototype.getOffset = function() {
    return this.offset;
  };

  Segment.prototype.setFalling = function(falling) {
    if (falling && !this.falling) {
      this.fallingDelayStart = Date.now();
    }
    return this.falling = falling;
  };

  return Segment;

})();

module.exports = Segment;


},{}],19:[function(require,module,exports){
var EventEmitter, Game, Keyboard, Level, Mouse, Player, Powerups,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Level = require("./level.coffee");

Player = require("./player.coffee");

Keyboard = require("./utilities/keyboard.coffee");

Mouse = require("./utilities/mouse.coffee");

Powerups = require("./powerups.coffee");

EventEmitter = require("events").EventEmitter;

Game = (function(_super) {
  __extends(Game, _super);

  Game.prototype.powerupDuration = 10000;

  function Game(app) {
    var firstPlatform;
    this.app = app;
    this.gameover = false;
    this.defaultScrollSpeed = 200;
    this.scrollSpeed = this.defaultScrollSpeed;
    this.globalRenderingOffset = new LDFW.Vector2(0, 0);
    this.increaseScrollSpeedAfter = 100;
    this.scrollSpeedIncreaseFactor = 100;
    this.scroll = new LDFW.Vector2(0, 0);
    this.keyboard = new Keyboard();
    this.mouse = new Mouse(this.app);
    this.level = new Level(this.app, this);
    this.player = new Player(this.app, this);
    this.activePowerup = null;
    this.powerupStart = +new Date();
    firstPlatform = this.level.getPlatforms()[0];
    this.player.setPosition(firstPlatform.getPosition().x * this.level.GRID_SIZE + firstPlatform.getWidth() * this.level.GRID_SIZE / 2, firstPlatform.getPosition().y * this.level.GRID_SIZE - 100);
  }

  Game.prototype.endGame = function() {
    this.gameover = true;
    this.player.getVelocity().setX(0);
    return this.emit("gameover");
  };

  Game.prototype.update = function(delta) {
    if (!this.gameover) {
      this.scroll.setX(Math.round(this.scroll.getX() + this.scrollSpeed * delta));
      if (this.getScore() > this.increaseScrollSpeedAfter) {
        this.defaultScrollSpeed += 50;
        this.setDefaultScrollSpeed();
        this.increaseScrollSpeedAfter += this.scrollSpeedIncreaseFactor;
        this.scrollSpeedIncreaseFactor += 50;
      }
      this.level.update(delta);
    }
    this.player.update(delta);
    if (+new Date() - this.powerupStart >= this.powerupDuration && !this.gameover) {
      this.activePowerup = this.getRandomPowerup();
      return this.powerupStart = +new Date();
    }
  };

  Game.prototype.getRandomPowerup = function() {
    var powerupKey, powerups;
    powerups = Object.keys(Powerups);
    powerupKey = powerups[Math.floor(Math.random() * powerups.length)];
    return Powerups[powerupKey];
  };

  Game.prototype.setScrollSpeed = function(scrollSpeed) {
    this.scrollSpeed = scrollSpeed;
  };

  Game.prototype.setDefaultScrollSpeed = function() {
    return this.scrollSpeed = this.defaultScrollSpeed;
  };

  Game.prototype.getPowerupTimeleft = function() {
    return this.powerupDuration - (+new Date() - this.powerupStart);
  };

  Game.prototype.getActivePowerup = function() {
    return this.activePowerup;
  };

  Game.prototype.getScore = function() {
    return Math.round(this.scroll.getX() / 50);
  };

  Game.prototype.getScroll = function() {
    return this.scroll;
  };

  Game.prototype.getScrollSpeed = function() {
    return this.scrollSpeed;
  };

  Game.prototype.getDefaultScrollSpeed = function() {
    return this.defaultScrollSpeed;
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

  Game.prototype.getMouse = function() {
    return this.mouse;
  };

  Game.prototype.isOver = function() {
    return this.gameover;
  };

  return Game;

})(EventEmitter);

module.exports = Game;


},{"./level.coffee":21,"./player.coffee":22,"./powerups.coffee":23,"./utilities/keyboard.coffee":32,"./utilities/mouse.coffee":34,"events":35}],20:[function(require,module,exports){
var AboutScreen, Config, GameScreen, HighScoreScreen, Keyboard, LD27, Mouse, SplashScreen, TutorialScreen,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameScreen = require("./screens/gamescreen.coffee");

SplashScreen = require("./screens/splashscreen.coffee");

HighScoreScreen = require("./screens/highscorescreen.coffee");

AboutScreen = require("./screens/aboutscreen.coffee");

TutorialScreen = require("./screens/tutorialscreen.coffee");

Mouse = require("./utilities/mouse.coffee");

Keyboard = require("./utilities/keyboard.coffee");

Config = require("./config/config.json");

LD27 = (function(_super) {
  __extends(LD27, _super);

  function LD27() {
    var _this = this;
    LD27.__super__.constructor.apply(this, arguments);
    this.debugDiv = $("<div>").addClass("debug");
    this.debugDiv.appendTo(this.getWrapper());
    this.scoreShared = false;
    this.keyboard = new Keyboard();
    this.preloader = new LDFW.Preloader(["assets/sprites.json", "assets/sprites.png", "assets/fonts.json", "assets/fonts.png", "assets/fonts/pixel-8-white.fnt", "assets/fonts/pixel-8-red.fnt", "assets/fonts/pixel-16-white.fnt", "assets/fonts/pixel-16-red.fnt", "assets/fonts/pixel-24-white.fnt"]);
    this.preloader.on("done", function() {
      var fontsImage, fontsJSON, spritesImage, spritesJSON;
      spritesJSON = _this.preloader.get("assets/sprites.json");
      spritesImage = _this.preloader.get("assets/sprites.png");
      _this.spritesAtlas = new LDFW.TextureAtlas(spritesJSON.frames, spritesImage);
      fontsJSON = _this.preloader.get("assets/fonts.json");
      fontsImage = _this.preloader.get("assets/fonts.png");
      _this.fontsAtlas = new LDFW.TextureAtlas(fontsJSON.frames, fontsImage);
      _this.screen = new SplashScreen(_this);
      return _this.run();
    });
    this.preloader.load();
  }

  LD27.prototype.switchToGameScreen = function() {
    this.screen = new GameScreen(this);
    return this.scoreShared = false;
  };

  LD27.prototype.switchToSplashScreen = function() {
    return this.screen = new SplashScreen(this);
  };

  LD27.prototype.switchToAboutScreen = function() {
    return this.screen = new AboutScreen(this);
  };

  LD27.prototype.switchToHighScoreScreen = function() {
    return this.screen = new HighScoreScreen(this);
  };

  LD27.prototype.switchToTutorialScreen = function() {
    return this.screen = new TutorialScreen(this);
  };

  LD27.prototype.shareScore = function(score) {
    var askForName, name,
      _this = this;
    if (this.scoreShared) {
      return alert("You already shared this score!");
    }
    name = null;
    askForName = function() {
      name = prompt("Please enter your name:");
      if (name !== null && name.trim().length === 0) {
        alert("You didn't enter anything!");
        return askForName();
      }
    };
    askForName();
    if (name === null) {
      return;
    }
    this.scoreShared = true;
    name = encodeURIComponent(name);
    score = encodeURIComponent(score);
    return $.getJSON(Config.highscore_host + "/highscore/add.json?name=" + name + "&score=" + score + "&jsoncallback=?", function(result) {
      return alert("Your score has been posted to the highscore! :)\n\nThanks for playing!");
    });
  };

  /*
   * Getters / setters
  */


  LD27.prototype.getSpritesAtlas = function() {
    return this.spritesAtlas;
  };

  LD27.prototype.getFontsAtlas = function() {
    return this.fontsAtlas;
  };

  LD27.prototype.getPreloader = function() {
    return this.preloader;
  };

  LD27.prototype.getKeyboard = function() {
    return this.keyboard;
  };

  LD27.prototype.setDebugText = function(text) {
    return this.debugDiv.text(text);
  };

  return LD27;

})(LDFW.Game);

module.exports = LD27;


},{"./config/config.json":16,"./screens/aboutscreen.coffee":24,"./screens/gamescreen.coffee":25,"./screens/highscorescreen.coffee":26,"./screens/splashscreen.coffee":27,"./screens/tutorialscreen.coffee":28,"./utilities/keyboard.coffee":32,"./utilities/mouse.coffee":34}],21:[function(require,module,exports){
var BlockActor, Config, FuckingPiranhasActor, Level, LevelGenerator, Platform, Powerups,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Config = require("./config/config.json");

Platform = require("./entities/platform.coffee");

LevelGenerator = require("./utilities/levelgenerator.coffee");

Powerups = require("./powerups.coffee");

BlockActor = require("./actors/blockactor.coffee");

FuckingPiranhasActor = require("./actors/fuckingpiranhasactor.coffee");

Level = (function() {
  Level.prototype.GRID_SIZE = 32;

  Level.prototype.BUILDMODE_COOLDOWN = 300;

  function Level(app, game) {
    var appTileHeight;
    this.app = app;
    this.game = game;
    this.onClick = __bind(this.onClick, this);
    this.onRightClick = __bind(this.onRightClick, this);
    this.onKeyDown = __bind(this.onKeyDown, this);
    this.renderOffset = new LDFW.Vector2(0, Config.ui_minimap_height);
    this.buildMode = true;
    this.buildBlock = new BlockActor(this.app, this.game, this, {
      buildMode: true
    });
    this.keyboard = this.game.getKeyboard();
    this.keyboard.on("keydown", this.onKeyDown);
    this.mouse = this.game.getMouse();
    this.mouse.on("click", this.onClick);
    this.mouse.on("rightclick", this.onRightClick);
    this.defaultGravity = new LDFW.Vector2(0, 1800);
    this.gravity = this.defaultGravity.clone();
    this.generator = new LevelGenerator(this.app, this.game, this);
    this.platforms = [
      new Platform(this.app, this.game, {
        position: new LDFW.Vector2(10, 10),
        width: 10,
        height: 5
      })
    ];
    this.blocks = [];
    appTileHeight = Math.round(this.app.getHeight() / this.GRID_SIZE);
    this.obstacles = [];
    this.pregeneratedScreensAmount = 10;
    this.generator.generate(this.pregeneratedScreensAmount);
  }

  Level.prototype.onKeyDown = function(event) {
    var _ref;
    if (!this.buildMode) {
      return;
    }
    if ((_ref = event.keyCode) === this.keyboard.Keys.R || _ref === this.keyboard.Keys.SHIFT) {
      return this.buildBlock.rotate();
    }
  };

  Level.prototype.onRightClick = function(position) {
    if (this.game.isOver()) {
      return;
    }
    if (!this.buildMode) {
      return;
    }
    return this.buildBlock.rotate();
  };

  Level.prototype.onClick = function(position) {
    if (this.game.isOver()) {
      return;
    }
    if (!this.buildMode) {
      return;
    }
    if (!this.isBuildBlockBuildable()) {
      return;
    }
    this.buildBlock.setBuildMode(false);
    this.buildMode = false;
    this.blocks.push(this.buildBlock);
    this.buildBlock = null;
    this.buildMode = false;
    this.buildBlock = new BlockActor(this.app, this.game, this, {
      buildMode: true
    });
    return this.buildModeCooldownStart = Date.now();
  };

  Level.prototype.update = function(delta) {
    var blockMap, gridPosition, mousePosition, obstacle, tilesXPerScreen, xOffset, _i, _len, _ref, _results;
    xOffset = this.generator.xOffset;
    tilesXPerScreen = this.app.getWidth() / this.GRID_SIZE;
    if (this.game.getScroll().getX() / this.GRID_SIZE > xOffset - 5 * tilesXPerScreen) {
      this.generator.generate(this.pregeneratedScreensAmount);
    }
    if (Date.now() - this.buildModeCooldownStart > this.BUILDMODE_COOLDOWN) {
      this.buildMode = true;
    }
    if (this.game.getActivePowerup() === Powerups.BROKEN_BLOCKS && this.buildMode) {
      this.buildBlock.setStyle("broken");
    } else {
      this.buildBlock.setDefaultStyle();
    }
    if (this.game.getActivePowerup() === Powerups.LOW_GRAVITY) {
      this.gravity.setY(this.defaultGravity.getY() / 2);
    } else {
      this.gravity.setY(this.defaultGravity.getY());
    }
    if (this.game.getActivePowerup() === Powerups.EARTHQUAKE) {
      this.game.globalRenderOffset = new LDFW.Vector2(-10 + Math.random() * 20, -10 + Math.random() * 20);
    } else {
      this.game.globalRenderOffset = new LDFW.Vector2(0, 0);
    }
    if (this.game.getActivePowerup() === Powerups.BOOST) {
      this.game.setScrollSpeed(this.game.getDefaultScrollSpeed() * 1.5);
    } else if (this.game.getActivePowerup() === Powerups.SLOW) {
      this.game.setScrollSpeed(this.game.getDefaultScrollSpeed() * 0.5);
    } else {
      this.game.setDefaultScrollSpeed();
    }
    mousePosition = this.mouse.getPosition();
    if (this.buildMode) {
      blockMap = this.buildBlock.getMap();
      gridPosition = mousePosition.clone().add(this.getScroll()).substract(blockMap[0].length * this.GRID_SIZE / 2, blockMap.length * this.GRID_SIZE / 2).divideBy(this.GRID_SIZE).round();
      this.buildBlock.setGridPosition(gridPosition);
    }
    _ref = this.obstacles;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obstacle = _ref[_i];
      if (this.game.getPlayer().collidesWithObstacle(obstacle)) {
        _results.push(this.game.endGame());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Level.prototype.isBuildBlockBuildable = function() {
    var block, buildable, buildableBlockMap, buildableBlockPosition, buildableSegment, height, map, obstacle, offsetX, offsetY, platform, position, row, segment, width, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _m, _n, _o, _p, _q, _ref, _ref1, _ref2;
    buildable = true;
    buildableBlockMap = this.buildBlock.getMap();
    buildableBlockPosition = this.buildBlock.getGridPosition();
    _ref = this.blocks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      block = _ref[_i];
      map = block.getMap();
      position = block.getGridPosition();
      if (position.x * this.GRID_SIZE + map[0].length * this.GRID_SIZE - this.game.getScroll().x < 0) {
        continue;
      }
      for (y = _j = 0, _len1 = map.length; _j < _len1; y = ++_j) {
        row = map[y];
        for (x = _k = 0, _len2 = row.length; _k < _len2; x = ++_k) {
          segment = row[x];
          if (segment === 0) {
            continue;
          }
          offsetX = position.x + x - buildableBlockPosition.x;
          offsetY = position.y + y - buildableBlockPosition.y;
          if ((buildableBlockMap[offsetY] != null) && (buildableBlockMap[offsetY][offsetX] != null)) {
            buildableSegment = buildableBlockMap[offsetY][offsetX];
            if (buildableSegment !== 0) {
              buildable = false;
            }
          }
        }
      }
    }
    _ref1 = this.platforms;
    for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
      platform = _ref1[_l];
      position = platform.getPosition();
      width = platform.getWidth();
      height = platform.getHeight();
      if (position.x * this.GRID_SIZE + width * this.GRID_SIZE - this.game.getScroll().x < 0) {
        continue;
      }
      platform = {
        top: position.y,
        right: position.x + width,
        bottom: position.y + height,
        left: position.x
      };
      for (y = _m = 0, _len4 = buildableBlockMap.length; _m < _len4; y = ++_m) {
        row = buildableBlockMap[y];
        for (x = _n = 0, _len5 = row.length; _n < _len5; x = ++_n) {
          segment = row[x];
          if (segment === 0) {
            continue;
          }
          segment = {
            top: buildableBlockPosition.y + y,
            right: buildableBlockPosition.x + x + 1,
            bottom: buildableBlockPosition.y + y + 1,
            left: buildableBlockPosition.x + x
          };
          if (!(platform.left >= segment.right || platform.right <= segment.left || platform.top >= segment.bottom || platform.bottom <= segment.top)) {
            buildable = false;
          }
        }
      }
    }
    _ref2 = this.obstacles;
    for (_o = 0, _len6 = _ref2.length; _o < _len6; _o++) {
      obstacle = _ref2[_o];
      position = obstacle.getPosition();
      width = obstacle.getWidth();
      height = obstacle.getHeight();
      if (position.x * this.GRID_SIZE + width * this.GRID_SIZE - this.game.getScroll().x < 0) {
        continue;
      }
      obstacle = {
        top: position.y,
        right: position.x + width,
        bottom: position.y + height,
        left: position.x
      };
      for (y = _p = 0, _len7 = buildableBlockMap.length; _p < _len7; y = ++_p) {
        row = buildableBlockMap[y];
        for (x = _q = 0, _len8 = row.length; _q < _len8; x = ++_q) {
          segment = row[x];
          if (segment === 0) {
            continue;
          }
          segment = {
            top: buildableBlockPosition.y + y,
            right: buildableBlockPosition.x + x + 1,
            bottom: buildableBlockPosition.y + y + 1,
            left: buildableBlockPosition.x + x
          };
          if (!(obstacle.left >= segment.right || obstacle.right <= segment.left || obstacle.top >= segment.bottom || obstacle.bottom <= segment.top)) {
            buildable = false;
          }
        }
      }
    }
    return buildable;
  };

  Level.prototype.getBoundariesForPlayer = function(player) {
    var block, boundaries, map, platform, position, row, segment, x, y, yOffset, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
    player = {
      top: player.getPosition().getY() - player.getWidth(),
      bottom: player.getPosition().getY(),
      left: player.getPosition().getX(),
      right: player.getPosition().getX() + player.getHeight()
    };
    boundaries = {
      x: {
        min: 0,
        max: player.left + this.app.getWidth(),
        object: null
      },
      y: {
        min: -this.app.getHeight(),
        max: this.app.getHeight() * 2,
        object: null
      }
    };
    _ref = this.platforms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      platform = _ref[_i];
      position = platform.getPosition().clone().multiply(this.GRID_SIZE);
      platform = {
        top: position.y,
        bottom: position.y + platform.getHeight() * this.GRID_SIZE,
        left: position.x,
        right: position.x + platform.getWidth() * this.GRID_SIZE
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
          if (map[y - 1] && map[y - 1][x] !== 0) {
            continue;
          }
          yOffset = segment.getOffset().getY();
          segment = {
            left: position.getX() + x * this.GRID_SIZE,
            right: position.getX() + (x + 1) * this.GRID_SIZE,
            top: position.getY() + y * this.GRID_SIZE + yOffset,
            bottom: position.getY() + (y + 1) * this.GRID_SIZE + yOffset
          };
          if (!(player.bottom <= segment.top || player.top >= segment.bottom)) {
            if (player.right <= segment.left) {
              boundaries.x.max = Math.min(segment.left, boundaries.x.max);
            } else if (player.left >= segment.right) {
              boundaries.x.min = Math.max(segment.right, boundaries.x.min);
            }
          }
          if (!(player.left >= segment.right || player.right <= segment.left || player.bottom > segment.top)) {
            boundaries.y.max = Math.min(segment.top, boundaries.y.max);
            if (boundaries.y.max === segment.top) {
              boundaries.y.object = block;
            }
          }
        }
      }
    }
    return boundaries;
  };

  Level.prototype.addPlatform = function(platform) {
    return this.platforms.push(platform);
  };

  Level.prototype.addObstacle = function(obstacle) {
    return this.obstacles.push(obstacle);
  };

  Level.prototype.getScroll = function() {
    return this.game.getScroll().clone().add(this.renderOffset);
  };

  Level.prototype.getPlatforms = function() {
    return this.platforms;
  };

  Level.prototype.getBlocks = function() {
    return this.blocks;
  };

  Level.prototype.getObstacles = function() {
    return this.obstacles;
  };

  Level.prototype.getGravity = function() {
    return this.gravity;
  };

  Level.prototype.inBuildMode = function() {
    return this.buildMode;
  };

  Level.prototype.setBuildMode = function(buildMode) {
    this.buildMode = buildMode;
  };

  Level.prototype.getBuildBlock = function() {
    return this.buildBlock;
  };

  Level.prototype.getScrollSpeed = function() {
    return this.scrollSpeed;
  };

  return Level;

})();

module.exports = Level;


},{"./actors/blockactor.coffee":2,"./actors/fuckingpiranhasactor.coffee":4,"./config/config.json":16,"./entities/platform.coffee":17,"./powerups.coffee":23,"./utilities/levelgenerator.coffee":33}],22:[function(require,module,exports){
var BlockActor, JUMP_FORCE, Player;

JUMP_FORCE = -700;

BlockActor = require("./actors/blockactor.coffee");

Player = (function() {
  function Player(app, game) {
    this.app = app;
    this.game = game;
    this.keyboard = this.game.getKeyboard();
    this.velocity = new LDFW.Vector2();
    this.position = new LDFW.Vector2();
    this.level = this.game.getLevel();
    this.width = 0;
    this.height = 0;
    this.onGround = false;
    this.onGroundObject = false;
    this.direction = 1;
  }

  Player.prototype.setWidth = function(width) {
    this.width = width;
  };

  Player.prototype.setHeight = function(height) {
    this.height = height;
  };

  Player.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
  };

  Player.prototype.getWidth = function() {
    return this.width;
  };

  Player.prototype.getHeight = function() {
    return this.height;
  };

  Player.prototype.getDirection = function() {
    return this.direction;
  };

  Player.prototype.isOnGround = function() {
    return this.onGround;
  };

  Player.prototype.getOnGroundObject = function() {
    return this.onGroundObject;
  };

  Player.prototype.getVelocity = function() {
    return this.velocity;
  };

  Player.prototype.update = function(delta) {
    var aspiredPosition, boundaries;
    if (!this.game.isOver()) {
      this.handleKeyboard();
    }
    aspiredPosition = this.getAspiredPosition(delta);
    if (!this.game.isOver()) {
      boundaries = this.level.getBoundariesForPlayer(this);
      this.handleXMovement(aspiredPosition, boundaries);
      this.handleYMovement(aspiredPosition, boundaries);
    }
    this.position.set(aspiredPosition);
    if (this.position.getY() > this.app.getHeight() + this.height) {
      return this.game.endGame();
    }
  };

  Player.prototype.getAspiredPosition = function(delta) {
    var gravity, gravityStep, velocityStep;
    gravity = this.level.getGravity().clone();
    gravityStep = gravity.multiply(delta);
    this.velocity.add(gravityStep);
    velocityStep = this.velocity.clone().multiply(delta);
    if (this.velocity.getX() > 0) {
      this.direction = 1;
    } else if (this.velocity.getX() < 0) {
      this.direction = -1;
    }
    return this.position.clone().add(velocityStep);
  };

  Player.prototype.handleXMovement = function(aspiredPosition, boundaries) {
    if (aspiredPosition.getX() < this.level.getScroll().x) {
      aspiredPosition.setX(this.level.getScroll().x);
    }
    if (aspiredPosition.getX() > this.level.getScroll().x + this.app.getWidth() - this.getWidth()) {
      aspiredPosition.setX(this.level.getScroll().x + this.app.getWidth() - this.getWidth());
    }
    if (aspiredPosition.getX() <= boundaries.x.min) {
      return aspiredPosition.setX(boundaries.x.min);
    } else if (aspiredPosition.getX() + this.getWidth() >= boundaries.x.max) {
      return aspiredPosition.setX(boundaries.x.max - this.getWidth());
    }
  };

  Player.prototype.handleYMovement = function(aspiredPosition, boundaries) {
    var obj;
    if (aspiredPosition.getY() > boundaries.y.max) {
      aspiredPosition.setY(boundaries.y.max);
    }
    if (aspiredPosition.getY() >= boundaries.y.max) {
      this.jumping = false;
      this.onGround = true;
      this.velocity.setY(0);
    } else {
      this.onGround = false;
    }
    if (this.onGround && boundaries.y.object instanceof BlockActor) {
      this.onGroundObject = boundaries.y.object;
      obj = boundaries.y.object;
      return obj.steppedOn(aspiredPosition.getX() - obj.getGridPosition().getX() * this.level.GRID_SIZE, this.getWidth());
    } else if (this.onGround) {
      return this.onGroundObject = false;
    }
  };

  Player.prototype.collidesWithObstacle = function(obstacle) {
    var obstaclePosition, player;
    obstaclePosition = obstacle.getPosition().clone().multiply(this.level.GRID_SIZE);
    obstacle = {
      top: obstaclePosition.y,
      right: obstaclePosition.x + obstacle.getWidth() * this.level.GRID_SIZE,
      bottom: obstaclePosition.y + obstacle.getHeight() * this.level.GRID_SIZE,
      left: obstaclePosition.x
    };
    player = {
      top: this.position.getY() + this.getHeight(),
      right: this.position.getX() + this.getWidth(),
      bottom: this.position.getY(),
      left: this.position.getX()
    };
    if (!(player.left > obstacle.right || player.right < obstacle.left || player.bottom < obstacle.top || player.top > obstacle.bottom)) {
      return true;
    }
    return false;
  };

  Player.prototype.handleKeyboard = function() {
    if (this.keyboard.pressed(this.keyboard.Keys.RIGHT) || this.keyboard.pressed(this.keyboard.Keys.D)) {
      this.velocity.setX(this.game.getScrollSpeed() * 2);
    } else if (this.keyboard.pressed(this.keyboard.Keys.LEFT) || this.keyboard.pressed(this.keyboard.Keys.A)) {
      this.velocity.setX(-this.game.getScrollSpeed() * 2);
    } else {
      this.velocity.setX(0);
    }
    if (this.keyboard.upPressed() && this.onGround) {
      return this.velocity.setY(JUMP_FORCE);
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


},{"./actors/blockactor.coffee":2}],23:[function(require,module,exports){
var Powerups;

Powerups = {
  BOOST: {
    id: 0,
    name: "RUN FOREST!",
    sub: "SPEED BOOST"
  },
  SLOW: {
    id: 1,
    name: "BLUE OR RED PILL?",
    sub: "SLOWMO"
  },
  BROKEN_BLOCKS: {
    id: 2,
    name: "DON'T BREAK IT!",
    sub: "BROKEN BLOCKS"
  },
  EARTHQUAKE: {
    id: 3,
    name: "WAAAAH!",
    sub: "EARTHQUAKE"
  },
  LOW_GRAVITY: {
    id: 4,
    name: "SMALL STEP FOR A MAN",
    sub: "LOW GRAVITY"
  }
};

module.exports = Powerups;


},{}],24:[function(require,module,exports){
var AboutScreen, BackgroundActor,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BackgroundActor = require("../actors/backgroundactor.coffee");

AboutScreen = (function(_super) {
  __extends(AboutScreen, _super);

  function AboutScreen(app) {
    this.app = app;
    this.onKeyDown = __bind(this.onKeyDown, this);
    AboutScreen.__super__.constructor.call(this, this.app);
    this.backgroundActor = new BackgroundActor(this.app);
    this.fontsAtlas = this.app.getFontsAtlas();
    this.textFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-white.fnt"), this.fontsAtlas.findRegion("pixel-8-white.png"));
    this.headlineFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-24-white.fnt"), this.fontsAtlas.findRegion("pixel-24-white.png"));
    this.redFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-red.fnt"), this.fontsAtlas.findRegion("pixel-8-red.png"));
    this.blockInput = false;
    this.keyboard = this.app.getKeyboard();
    this.keyboard.removeAllListeners("keydown");
    this.keyboard.on("keydown", this.onKeyDown);
  }

  AboutScreen.prototype.onKeyDown = function(e) {
    var blockInput;
    if (this.blockInput) {
      return;
    }
    if (e.keyCode === this.keyboard.Keys.ESC) {
      this.game.switchToSplashScreen();
      return blockInput = true;
    }
  };

  AboutScreen.prototype.update = function(delta) {
    this.backgroundActor.update(delta);
  };

  AboutScreen.prototype.drawAboutHeadline = function(context) {
    var headlineBounds, headlineText;
    headlineText = "ABOUT RUNTRIS";
    headlineBounds = this.headlineFont.getBounds(headlineText);
    return this.headlineFont.drawText(context, headlineText, this.app.getWidth() / 2 - headlineBounds.getWidth() / 2, 60);
  };

  AboutScreen.prototype.drawQuitMessage = function(context) {
    var escText, fullBounds, fullQuitText, quitText, rBounds;
    escText = "PRESS ESC ";
    quitText = "TO QUIT TO MENU";
    fullQuitText = escText + quitText;
    rBounds = this.textFont.getBounds(escText);
    fullBounds = this.redFont.getBounds(fullQuitText);
    this.redFont.drawText(context, escText, this.app.getWidth() / 2 - fullBounds.width / 2, 400);
    return this.textFont.drawText(context, quitText, this.app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 400);
  };

  AboutScreen.prototype.drawAboutText = function(context) {
    var line, lineHeight, text, yOffset, _i, _len, _results;
    text = ["Runtris has been created by Sascha Gehlich within", "less than 48 hours during the 27th \"Ludum Dare\" ", "game development competition in August 2013.", "", "Tools used: Adobe Photoshop, TexturePacker, Sublime", "Text, Google Chrome, bmGlyph, CoffeeScript, node.js", "and Redis"];
    yOffset = 150;
    lineHeight = 20;
    _results = [];
    for (_i = 0, _len = text.length; _i < _len; _i++) {
      line = text[_i];
      this.textFont.drawText(context, line, 100, yOffset);
      _results.push(yOffset += lineHeight);
    }
    return _results;
  };

  AboutScreen.prototype.draw = function(context) {
    context.save();
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.backgroundActor.draw(context);
    context.fillRect(0, 0, this.app.getWidth(), this.app.getHeight());
    this.drawAboutHeadline(context);
    this.drawAboutText(context);
    this.drawQuitMessage(context);
    return context.restore();
  };

  return AboutScreen;

})(LDFW.Screen);

module.exports = AboutScreen;


},{"../actors/backgroundactor.coffee":1}],25:[function(require,module,exports){
var Game, GameOverStage, GameScreen, GameStage, UIStage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameStage = require("../stages/gamestage.coffee");

GameOverStage = require("../stages/gameoverstage.coffee");

UIStage = require("../stages/uistage.coffee");

Game = require("../game.coffee");

GameScreen = (function(_super) {
  __extends(GameScreen, _super);

  function GameScreen(app) {
    var _this = this;
    this.app = app;
    GameScreen.__super__.constructor.call(this, this.app);
    this.app.getKeyboard().removeAllListeners("keydown");
    this.game = new Game(this.app);
    this.uiStage = new UIStage(this.app, this.game);
    this.gameStage = new GameStage(this.app, this.game);
    this.gameOverStage = new GameOverStage(this.app, this.game);
    this.game.on("gameover", function() {
      return _this.gameOverStage.show();
    });
  }

  GameScreen.prototype.update = function(delta) {
    this.game.update(delta);
    this.gameStage.update(delta);
    this.uiStage.update(delta);
    this.gameOverStage.update(delta);
  };

  GameScreen.prototype.draw = function(context) {
    this.gameStage.draw(context);
    this.uiStage.draw(context);
    this.gameOverStage.draw(context);
  };

  return GameScreen;

})(LDFW.Screen);

module.exports = GameScreen;


},{"../game.coffee":19,"../stages/gameoverstage.coffee":29,"../stages/gamestage.coffee":30,"../stages/uistage.coffee":31}],26:[function(require,module,exports){
var BackgroundActor, Config, HighscoreActor, HighscoreScreen,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BackgroundActor = require("../actors/backgroundactor.coffee");

HighscoreActor = require("../actors/highscoreactor.coffee");

Config = require("../config/config.json");

HighscoreScreen = (function(_super) {
  __extends(HighscoreScreen, _super);

  function HighscoreScreen(app) {
    var _this = this;
    this.app = app;
    HighscoreScreen.__super__.constructor.call(this, this.app);
    this.app.getKeyboard().removeAllListeners("keydown");
    this.backgroundActor = new BackgroundActor(this.app);
    this.highscoreActor = new HighscoreActor(this.app);
    $.getJSON(Config.highscore_host + "/highscore.json?jsoncallback=?", function(scores) {
      _this.scores = scores;
      return _this.highscoreActor.setScores(_this.scores);
    });
  }

  HighscoreScreen.prototype.update = function(delta) {
    this.backgroundActor.update(delta);
    this.highscoreActor.update(delta);
  };

  HighscoreScreen.prototype.draw = function(context) {
    context.save();
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.backgroundActor.draw(context);
    context.fillRect(0, 0, this.app.getWidth(), this.app.getHeight());
    this.highscoreActor.draw(context);
    return context.restore();
  };

  return HighscoreScreen;

})(LDFW.Screen);

module.exports = HighscoreScreen;


},{"../actors/backgroundactor.coffee":1,"../actors/highscoreactor.coffee":6,"../config/config.json":16}],27:[function(require,module,exports){
var BackgroundActor, FooterActor, LogoActor, MenuActor, SplashScreen,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BackgroundActor = require("../actors/backgroundactor.coffee");

LogoActor = require("../actors/logoactor.coffee");

FooterActor = require("../actors/footeractor.coffee");

MenuActor = require("../actors/menuactor.coffee");

SplashScreen = (function(_super) {
  __extends(SplashScreen, _super);

  function SplashScreen(app) {
    this.app = app;
    this.onKeyDown = __bind(this.onKeyDown, this);
    SplashScreen.__super__.constructor.call(this, this.app);
    this.backgroundActor = new BackgroundActor(this.app);
    this.footerActor = new FooterActor(this.app);
    this.logoActor = new LogoActor(this.app);
    this.menuActor = new MenuActor(this.app);
    this.blockInput = false;
    this.keyboard = this.app.getKeyboard();
    this.keyboard.removeAllListeners("keydown");
    this.keyboard.on("keydown", this.onKeyDown);
  }

  SplashScreen.prototype.onKeyDown = function(e) {
    if (this.blockInput) {
      return;
    }
    if (e.keyCode === this.keyboard.Keys.ENTER) {
      switch (this.menuActor.getSelectedIndex()) {
        case 0:
          if (!localStorage.getItem("seen_tutorial")) {
            this.app.switchToTutorialScreen();
          } else {
            this.app.switchToGameScreen();
          }
          this.blockInput = true;
          return;
        case 1:
          this.app.switchToHighScoreScreen();
          this.blockInput = true;
          return;
        case 2:
          this.app.switchToAboutScreen();
          this.blockInput = true;
          return;
      }
    }
    return this.menuActor.onKeyDown(e);
  };

  SplashScreen.prototype.update = function(delta) {
    this.backgroundActor.update(delta);
    this.footerActor.update(delta);
    this.logoActor.update(delta);
    return this.menuActor.update(delta);
  };

  SplashScreen.prototype.draw = function(context) {
    this.backgroundActor.draw(context);
    this.footerActor.draw(context);
    this.logoActor.draw(context);
    return this.menuActor.draw(context);
  };

  return SplashScreen;

})(LDFW.Screen);

module.exports = SplashScreen;


},{"../actors/backgroundactor.coffee":1,"../actors/footeractor.coffee":3,"../actors/logoactor.coffee":8,"../actors/menuactor.coffee":9}],28:[function(require,module,exports){
var BackgroundActor, TutorialScreen,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BackgroundActor = require("../actors/backgroundactor.coffee");

TutorialScreen = (function(_super) {
  __extends(TutorialScreen, _super);

  function TutorialScreen(app) {
    this.app = app;
    this.onKeyDown = __bind(this.onKeyDown, this);
    TutorialScreen.__super__.constructor.call(this, this.app);
    this.spritesAtlas = this.app.getSpritesAtlas();
    this.stepIndex = 0;
    this.steps = [
      {
        title: "MOVING AROUND",
        sprite: this.spritesAtlas.createSprite("tutorial/tutorial-moving.png")
      }, {
        title: "BUILDING BLOCKS",
        sprite: this.spritesAtlas.createSprite("tutorial/tutorial-building.png")
      }, {
        title: "BEWARE OF POWERUPS",
        sprite: this.spritesAtlas.createSprite("tutorial/tutorial-powerups.png")
      }
    ];
    this.backgroundActor = new BackgroundActor(this.app);
    this.fontsAtlas = this.app.getFontsAtlas();
    this.headlineFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-24-white.fnt"), this.fontsAtlas.findRegion("pixel-24-white.png"));
    this.subFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-16-red.fnt"), this.fontsAtlas.findRegion("pixel-16-red.png"));
    this.smallFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-white.fnt"), this.fontsAtlas.findRegion("pixel-8-white.png"));
    this.blockInput = false;
    this.keyboard = this.app.getKeyboard();
    this.keyboard.removeAllListeners("keydown");
    this.keyboard.on("keydown", this.onKeyDown);
  }

  TutorialScreen.prototype.onKeyDown = function(e) {
    if (this.blockInput) {
      return;
    }
    if (e.keyCode === this.keyboard.Keys.ENTER) {
      this.stepIndex++;
      if (this.stepIndex > this.steps.length - 1) {
        this.blockInput = true;
        localStorage.setItem("seen_tutorial", true);
        return this.app.switchToGameScreen();
      }
    }
  };

  TutorialScreen.prototype.update = function(delta) {
    this.backgroundActor.update(delta);
  };

  TutorialScreen.prototype.drawAboutHeadline = function(context) {
    var headlineBounds, headlineText;
    headlineText = "TUTORIAL";
    headlineBounds = this.headlineFont.getBounds(headlineText);
    return this.headlineFont.drawText(context, headlineText, this.app.getWidth() / 2 - headlineBounds.getWidth() / 2, 50);
  };

  TutorialScreen.prototype.drawTutorialStep = function(context) {
    var instructionBounds, instructionText, sprite, step, titleBounds, titleText;
    step = this.steps[this.stepIndex];
    titleText = step.title;
    titleBounds = this.subFont.getBounds(titleText);
    this.subFont.drawText(context, titleText, this.app.getWidth() / 2 - titleBounds.getWidth() / 2, 94);
    if (this.stepIndex < this.steps.length - 1) {
      instructionText = "PRESS ENTER TO SEE THE NEXT TIP";
    } else {
      instructionText = "PRESS ENTER TO START THE GAME";
    }
    instructionBounds = this.smallFont.getBounds(instructionText);
    this.smallFont.drawText(context, instructionText, this.app.getWidth() / 2 - instructionBounds.getWidth() / 2, 126);
    sprite = step.sprite;
    return sprite.draw(context, this.app.getWidth() / 2 - sprite.getWidth() / 2, 160);
  };

  TutorialScreen.prototype.draw = function(context) {
    context.save();
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.backgroundActor.draw(context);
    context.fillRect(0, 0, this.app.getWidth(), this.app.getHeight());
    this.drawAboutHeadline(context);
    this.drawTutorialStep(context);
    return context.restore();
  };

  return TutorialScreen;

})(LDFW.Screen);

module.exports = TutorialScreen;


},{"../actors/backgroundactor.coffee":1}],29:[function(require,module,exports){
var GameOverStage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameOverStage = (function(_super) {
  __extends(GameOverStage, _super);

  function GameOverStage(app, game) {
    this.app = app;
    this.game = game;
    this.onKeyDown = __bind(this.onKeyDown, this);
    GameOverStage.__super__.constructor.call(this, this.game);
    this.opacity = 0;
    this.toOpacity = 0;
    this.fontsAtlas = this.app.getFontsAtlas();
    this.booFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-16-red.fnt"), this.fontsAtlas.findRegion("pixel-16-red.png"));
    this.messageFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-white.fnt"), this.fontsAtlas.findRegion("pixel-8-white.png"));
    this.redFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-8-red.fnt"), this.fontsAtlas.findRegion("pixel-8-red.png"));
    this.scoreFont = new LDFW.BitmapFont(this.app.getPreloader().get("assets/fonts/pixel-16-white.fnt"), this.fontsAtlas.findRegion("pixel-16-white.png"));
    this.keyboard = this.app.getKeyboard();
    this.keyboard.on("keydown", this.onKeyDown);
    this.visible = false;
  }

  GameOverStage.prototype.onKeyDown = function(e) {
    if (!this.visible) {
      return;
    }
    if (e.keyCode === this.keyboard.Keys.R) {
      return this.app.switchToGameScreen();
    } else if (e.keyCode === this.keyboard.Keys.ESC) {
      return this.app.switchToSplashScreen();
    } else if (e.keyCode === this.keyboard.Keys.ENTER) {
      return this.app.shareScore(this.game.getScore());
    }
  };

  GameOverStage.prototype.update = function(delta) {
    return this.opacity += (this.toOpacity - this.opacity) / 10;
  };

  GameOverStage.prototype.show = function() {
    this.toOpacity = 1;
    return this.visible = true;
  };

  GameOverStage.prototype.hide = function() {
    this.toOpacity = 0;
    return this.visible = false;
  };

  GameOverStage.prototype.draw = function(context) {
    var appHeight, appWidth;
    context.save();
    context.globalAlpha = this.opacity;
    appWidth = this.app.getWidth();
    appHeight = this.app.getHeight();
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    context.fillRect(0, 0, appWidth, appHeight);
    this.drawMessage(context);
    this.drawScore(context);
    this.drawInstructions(context);
    return context.restore();
  };

  GameOverStage.prototype.drawScore = function(context) {
    var scoreBounds, scoreText, yourScoreBounds, yourScoreText;
    yourScoreText = "YOUR SCORE:";
    yourScoreBounds = this.messageFont.getBounds(yourScoreText);
    this.messageFont.drawText(context, yourScoreText, this.app.getWidth() / 2 - yourScoreBounds.width / 2, 230);
    scoreText = "" + (this.game.getScore()) + "m";
    scoreBounds = this.scoreFont.getBounds(scoreText);
    return this.scoreFont.drawText(context, scoreText, this.app.getWidth() / 2 - scoreBounds.width / 2, 250);
  };

  GameOverStage.prototype.drawInstructions = function(context) {
    var enterText, escText, fullBounds, fullHighscoreText, fullQuitText, fullRetryText, highscoreText, quitText, rBounds, rText, retryText;
    rText = "PRESS R ";
    retryText = "TO TRY AGAIN";
    fullRetryText = rText + retryText;
    rBounds = this.messageFont.getBounds(rText);
    fullBounds = this.redFont.getBounds(fullRetryText);
    this.redFont.drawText(context, rText, this.app.getWidth() / 2 - fullBounds.width / 2, 330);
    this.messageFont.drawText(context, retryText, this.app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 330);
    escText = "PRESS ESC ";
    quitText = "TO QUIT TO MENU";
    fullQuitText = escText + quitText;
    rBounds = this.messageFont.getBounds(escText);
    fullBounds = this.redFont.getBounds(fullQuitText);
    this.redFont.drawText(context, escText, this.app.getWidth() / 2 - fullBounds.width / 2, 350);
    this.messageFont.drawText(context, quitText, this.app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 350);
    enterText = "PRESS ENTER ";
    highscoreText = "TO ADD YOUR SCORE TO THE HIGHSCORE TABLE";
    fullHighscoreText = enterText + highscoreText;
    rBounds = this.messageFont.getBounds(enterText);
    fullBounds = this.redFont.getBounds(fullHighscoreText);
    this.redFont.drawText(context, enterText, this.app.getWidth() / 2 - fullBounds.width / 2, 370);
    return this.messageFont.drawText(context, highscoreText, this.app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 370);
  };

  GameOverStage.prototype.drawMessage = function(context) {
    var booBounds, booText, cantWinBounds, cantWinText, dontTellBounds, dontTellText, lostBounds, lostText;
    booText = "BOO!";
    booBounds = this.booFont.getBounds(booText);
    this.booFont.drawText(context, booText, this.app.getWidth() / 2 - booBounds.width / 2, 75);
    lostText = "YOU LOST THE GAME!";
    lostBounds = this.messageFont.getBounds(lostText);
    this.messageFont.drawText(context, lostText, this.app.getWidth() / 2 - lostBounds.width / 2, 131);
    cantWinText = "ACTUALLY, YOU CAN'T WIN.";
    cantWinBounds = this.messageFont.getBounds(cantWinText);
    this.messageFont.drawText(context, cantWinText, this.app.getWidth() / 2 - cantWinBounds.width / 2, 151);
    dontTellText = "PLEASE DON'T TELL ANYONE.";
    dontTellBounds = this.messageFont.getBounds(dontTellText);
    return this.messageFont.drawText(context, dontTellText, this.app.getWidth() / 2 - dontTellBounds.width / 2, 171);
  };

  return GameOverStage;

})(LDFW.Stage);

module.exports = GameOverStage;


},{}],30:[function(require,module,exports){
var BackgroundActor, GameStage, LevelActor, PlayerActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BackgroundActor = require("../actors/backgroundactor.coffee");

PlayerActor = require("../actors/playeractor.coffee");

LevelActor = require("../actors/levelactor.coffee");

GameStage = (function(_super) {
  __extends(GameStage, _super);

  function GameStage(app, game) {
    this.app = app;
    this.game = game;
    GameStage.__super__.constructor.call(this, this.game);
    this.backgroundActor = new BackgroundActor(this.app, this.game);
    this.addActor(this.backgroundActor);
    this.levelActor = new LevelActor(this.app, this.game);
    this.addActor(this.levelActor);
    this.playerActor = new PlayerActor(this.app, this.game);
    this.addActor(this.playerActor);
  }

  return GameStage;

})(LDFW.Stage);

module.exports = GameStage;


},{"../actors/backgroundactor.coffee":1,"../actors/levelactor.coffee":7,"../actors/playeractor.coffee":11}],31:[function(require,module,exports){
var HeadlineActor, MinimapActor, PowerupActor, TimerActor, UIStage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MinimapActor = require("../actors/minimapactor.coffee");

HeadlineActor = require("../actors/headlineactor.coffee");

PowerupActor = require("../actors/powerupactor.coffee");

TimerActor = require("../actors/timeractor.coffee");

UIStage = (function(_super) {
  __extends(UIStage, _super);

  function UIStage(app, game) {
    this.app = app;
    this.game = game;
    UIStage.__super__.constructor.call(this, this.game);
    this.minimapActor = new MinimapActor(this.app, this.game);
    this.addActor(this.minimapActor);
    this.headlineActor = new HeadlineActor(this.app, this.game);
    this.addActor(this.headlineActor);
    this.timerActor = new TimerActor(this.app, this.game);
    this.addActor(this.timerActor);
  }

  UIStage.prototype.draw = function(context) {
    this.minimapActor.draw(context);
    this.headlineActor.draw(context);
    if (!this.game.isOver()) {
      return this.timerActor.draw(context);
    }
  };

  return UIStage;

})(LDFW.Stage);

module.exports = UIStage;


},{"../actors/headlineactor.coffee":5,"../actors/minimapactor.coffee":10,"../actors/powerupactor.coffee":12,"../actors/timeractor.coffee":13}],32:[function(require,module,exports){
var EventEmitter, Keyboard,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require("events").EventEmitter;

Keyboard = (function(_super) {
  __extends(Keyboard, _super);

  Keyboard.prototype.Keys = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    R: 82,
    SHIFT: 16,
    SPACE: 32,
    ENTER: 13,
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
    this.emit("keydown", e);
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
    return this.keyStates[keyCode] || false;
  };

  Keyboard.prototype.upPressed = function() {
    return this.keyStates[this.Keys.UP] || this.keyStates[this.Keys.W] || this.keyStates[this.Keys.SPACE];
  };

  return Keyboard;

})(EventEmitter);

module.exports = Keyboard;


},{"events":35}],33:[function(require,module,exports){
var FuckingPiranhas, LevelGenerator, Platform;

Platform = require("../entities/platform.coffee");

FuckingPiranhas = require("../actors/fuckingpiranhasactor.coffee");

LevelGenerator = (function() {
  function LevelGenerator(app, game, level) {
    var screenTilesX, screenTilesY;
    this.app = app;
    this.game = game;
    this.level = level;
    screenTilesX = Math.round(this.app.getWidth() / this.level.GRID_SIZE);
    screenTilesY = Math.round(this.app.getHeight() / this.level.GRID_SIZE);
    this.xOffset = screenTilesX;
  }

  LevelGenerator.prototype.generate = function(screens) {
    var gapSize, maxGapSize, maxPlatformWidth, minGapSize, minPlatformWidth, newMaxOffset, obstacle, placedWidth, platform, screenTilesX, screenTilesY;
    if (screens == null) {
      screens = 10;
    }
    screenTilesX = Math.round(this.app.getWidth() / this.level.GRID_SIZE);
    screenTilesY = Math.round(this.app.getHeight() / this.level.GRID_SIZE);
    newMaxOffset = this.xOffset + screenTilesX * screens;
    minGapSize = screenTilesX / 2;
    maxGapSize = screenTilesX * 2;
    while (this.xOffset < newMaxOffset) {
      placedWidth = 0;
      gapSize = minGapSize + Math.round(Math.random() * (maxGapSize - minGapSize));
      this.xOffset += gapSize;
      switch (Math.floor(Math.random() * 2)) {
        case 0:
          obstacle = new FuckingPiranhas(this.app, this.game, {
            position: new LDFW.Vector2(this.xOffset, screenTilesY - 6)
          });
          this.level.addObstacle(obstacle);
          placedWidth = 6;
          break;
        case 1:
          minPlatformWidth = 4;
          maxPlatformWidth = 13;
          placedWidth = minPlatformWidth + Math.round(Math.random() * (maxPlatformWidth - minPlatformWidth));
          platform = new Platform(this.app, this.game, {
            position: new LDFW.Vector2(this.xOffset, 10),
            width: placedWidth,
            height: screenTilesY - 10
          });
          this.level.addPlatform(platform);
          placedWidth = 10;
      }
    }
    return this.xOffset += placedWidth;
  };

  return LevelGenerator;

})();

module.exports = LevelGenerator;


},{"../actors/fuckingpiranhasactor.coffee":4,"../entities/platform.coffee":17}],34:[function(require,module,exports){
var EventEmitter, Mouse,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require("events").EventEmitter;

Mouse = (function(_super) {
  __extends(Mouse, _super);

  function Mouse(app) {
    this.app = app;
    this.onMouseDown = __bind(this.onMouseDown, this);
    this.onClick = __bind(this.onClick, this);
    this.onMouseMove = __bind(this.onMouseMove, this);
    this.position = new LDFW.Vector2();
    this.app.getWrapper().mousemove(this.onMouseMove);
    this.app.getWrapper().click(this.onClick);
    this.app.getWrapper().mousedown(this.onMouseDown);
    this.app.getWrapper().contextmenu(function(e) {
      return e.preventDefault();
    });
  }

  Mouse.prototype.onMouseMove = function(e) {
    return this.position.set(e.offsetX, e.offsetY);
  };

  Mouse.prototype.onClick = function(e) {
    return this.emit("click", this.position);
  };

  Mouse.prototype.onMouseDown = function(e) {
    if (e.which === 3) {
      e.preventDefault();
      return this.emit("rightclick", this.position);
    }
  };

  Mouse.prototype.getPosition = function() {
    return this.position;
  };

  return Mouse;

})(EventEmitter);

module.exports = Mouse;


},{"events":35}],35:[function(require,module,exports){
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

},{"__browserify_process":36}],36:[function(require,module,exports){
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

},{}]},{},[14])
;