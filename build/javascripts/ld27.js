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


},{"./screens/gamescreen.coffee":3}],3:[function(require,module,exports){
var GameScreen,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameScreen = (function(_super) {
  __extends(GameScreen, _super);

  function GameScreen(game) {
    this.game = game;
    this.spriteAtlas = this.game.getSpritesAtlas();
    this.exampleSprite = this.spriteAtlas.createSprite("example.png");
    GameScreen.__super__.constructor.apply(this, arguments);
  }

  GameScreen.prototype.update = function(delta) {};

  GameScreen.prototype.draw = function(context) {
    this.exampleSprite.draw(context);
  };

  return GameScreen;

})(LDFW.Screen);

module.exports = GameScreen;


},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZ2FtZS9hcHBsaWNhdGlvbi5jb2ZmZWUiLCIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZ2FtZS9sZDI3LmNvZmZlZSIsIi9Vc2Vycy9zYXNjaGFnZWhsaWNoL2RldmVsb3BtZW50L2pzL2xkMjcvY29mZmVlc2NyaXB0cy9nYW1lL3NjcmVlbnMvZ2FtZXNjcmVlbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsQ0FBQSxFQUFPLENBQVAsR0FBTyxRQUFBOztBQUVQLENBRkEsRUFFMEIsR0FBcEIsR0FBcUIsT0FBM0I7Q0FDRSxFQUdRLENBRkEsRUFETSxFQUdOLENBSEEsWUFBQSxHQUFBLEdBQUE7Q0FJUyxDQUFxQixDQUFPLENBQVAsRUFBdEIsRUFBTixFQUFBLENBQUE7Q0FKVixFQUdRO0NBSmlCOztBQVEzQixDQVZBLEVBVUUsTUFBQTtDQUNBLEtBQUEsT0FBQTtDQUFBLENBQUEsQ0FBVSxJQUFWLFVBQVU7Q0FFTSxFQUFMLENBQVgsR0FBVyxFQUFYO0NBSEE7Ozs7QUNWRixJQUFBLFlBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQWUsSUFBQSxHQUFmLG1CQUFlOztBQUVULENBRk47Q0FHRTs7Q0FBYSxDQUFBLENBQUEsV0FBQTtDQUNYLE9BQUEsSUFBQTtDQUFBLEdBQUEsS0FBQSw4QkFBQTtDQUFBLENBSUUsQ0FGZSxDQUFqQixLQUFBLFdBQWdDLENBQUE7Q0FGaEMsQ0FNQSxDQUFzQixDQUF0QixFQUFBLEdBQVU7Q0FDUixTQUFBLGVBQUE7Q0FBQSxFQUFjLEVBQUMsQ0FBZixHQUF3QixFQUF4QixVQUFjO0NBQWQsRUFDZSxFQUFDLENBQWhCLEdBQXlCLEdBQXpCLFFBQWU7Q0FEZixDQUcwRCxDQUF0QyxDQUFBLENBQW5CLENBQUQsS0FBaUQsQ0FBakQ7Q0FIQSxFQUlvQixDQUFBLENBQW5CLENBQUQsSUFBb0I7Q0FDbkIsRUFBRCxFQUFDLFFBQUQ7Q0FORixJQUFzQjtDQU50QixHQWFBLEtBQVU7Q0FkWixFQUFhOztDQWdCYjs7O0NBaEJBOztDQUFBLEVBbUJpQixNQUFBLE1BQWpCO0NBQW9CLEdBQVEsT0FBRCxDQUFQO0NBbkJwQixFQW1CaUI7O0NBbkJqQjs7Q0FEaUIsR0FBSTs7QUFzQnZCLENBeEJBLEVBd0JpQixDQXhCakIsRUF3Qk0sQ0FBTjs7OztBQ3hCQSxJQUFBLE1BQUE7R0FBQTtrU0FBQTs7QUFBTSxDQUFOO0NBQ0U7O0NBQWEsQ0FBQSxDQUFBLENBQUEsZ0JBQUU7Q0FDYixFQURhLENBQUQ7Q0FDWixFQUFlLENBQWYsT0FBQSxJQUFlO0NBQWYsRUFFaUIsQ0FBakIsT0FBNkIsQ0FBWixDQUFqQjtDQUZBLEdBR0EsS0FBQSxvQ0FBQTtDQUpGLEVBQWE7O0NBQWIsRUFNUSxFQUFBLENBQVIsR0FBUzs7Q0FOVCxFQVNNLENBQU4sR0FBTSxFQUFDO0NBQ0wsR0FBQSxHQUFBLE1BQWM7Q0FWaEIsRUFTTTs7Q0FUTjs7Q0FEdUIsR0FBSTs7QUFjN0IsQ0FkQSxFQWNpQixHQUFYLENBQU4sR0FkQSIsInNvdXJjZXNDb250ZW50IjpbIkxEMjcgPSByZXF1aXJlIFwiLi9sZDI3LmNvZmZlZVwiXG5cbndpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gKC0+XG4gIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgICAgICAgKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQgY2FsbGJhY2ssIDEwMDAgLyA2MFxuICApKClcblxuJCAtPlxuICB3cmFwcGVyID0gJChcIi5jYW52YXMtd3JhcHBlclwiKVxuXG4gIGdhbWUgPSBuZXcgTEQyNyh3cmFwcGVyKVxuIiwiR2FtZVNjcmVlbiAgID0gcmVxdWlyZSBcIi4vc2NyZWVucy9nYW1lc2NyZWVuLmNvZmZlZVwiXG5cbmNsYXNzIExEMjcgZXh0ZW5kcyBMREZXLkdhbWVcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcblxuICAgIEBwcmVsb2FkZXIgPSBuZXcgTERGVy5QcmVsb2FkZXIgW1xuICAgICAgXCJhc3NldHMvc3ByaXRlcy5qc29uXCIsXG4gICAgICBcImFzc2V0cy9zcHJpdGVzLnBuZ1wiXG4gICAgXVxuICAgIEBwcmVsb2FkZXIub24gXCJkb25lXCIsID0+XG4gICAgICBzcHJpdGVzSlNPTiA9IEBwcmVsb2FkZXIuZ2V0IFwiYXNzZXRzL3Nwcml0ZXMuanNvblwiXG4gICAgICBzcHJpdGVzSW1hZ2UgPSBAcHJlbG9hZGVyLmdldCBcImFzc2V0cy9zcHJpdGVzLnBuZ1wiXG5cbiAgICAgIEBzcHJpdGVzQXRsYXMgPSBuZXcgTERGVy5UZXh0dXJlQXRsYXMgc3ByaXRlc0pTT04uZnJhbWVzLCBzcHJpdGVzSW1hZ2VcbiAgICAgIEBzY3JlZW4gICAgICAgPSBuZXcgR2FtZVNjcmVlbiB0aGlzXG4gICAgICBAcnVuKClcbiAgICBAcHJlbG9hZGVyLmxvYWQoKVxuXG4gICMjI1xuICAgKiBHZXR0ZXJzIC8gc2V0dGVyc1xuICAjIyNcbiAgZ2V0U3ByaXRlc0F0bGFzOiAtPiByZXR1cm4gQHNwcml0ZXNBdGxhc1xuXG5tb2R1bGUuZXhwb3J0cyA9IExEMjdcbiIsImNsYXNzIEdhbWVTY3JlZW4gZXh0ZW5kcyBMREZXLlNjcmVlblxuICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxuICAgIEBzcHJpdGVBdGxhcyA9IEBnYW1lLmdldFNwcml0ZXNBdGxhcygpXG5cbiAgICBAZXhhbXBsZVNwcml0ZSA9IEBzcHJpdGVBdGxhcy5jcmVhdGVTcHJpdGUoXCJleGFtcGxlLnBuZ1wiKVxuICAgIHN1cGVyXG5cbiAgdXBkYXRlOiAoZGVsdGEpIC0+XG4gICAgcmV0dXJuXG5cbiAgZHJhdzogKGNvbnRleHQpIC0+XG4gICAgQGV4YW1wbGVTcHJpdGUuZHJhdyBjb250ZXh0XG4gICAgcmV0dXJuXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVNjcmVlblxuIl19
;