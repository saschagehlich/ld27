;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ExampleActor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ExampleActor = (function(_super) {
  __extends(ExampleActor, _super);

  function ExampleActor() {
    ExampleActor.__super__.constructor.apply(this, arguments);
    this.spritesAtlas = this.game.getSpritesAtlas();
    this.sprite = this.spritesAtlas.createSprite("example.png");
  }

  ExampleActor.prototype.update = function(delta) {
    return this.sprite.setPosition(this.sprite.getX() + 10 * delta, this.sprite.getY() + 10 * delta);
  };

  ExampleActor.prototype.draw = function(context) {
    return this.sprite.draw(context);
  };

  return ExampleActor;

})(LDFW.Actor);

module.exports = ExampleActor;


},{}],2:[function(require,module,exports){
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


},{"./ld27.coffee":3}],3:[function(require,module,exports){
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


},{"./screens/gamescreen.coffee":4}],4:[function(require,module,exports){
var ExampleActor, GameScreen,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ExampleActor = require("../actors/exampleactor.coffee");

GameScreen = (function(_super) {
  __extends(GameScreen, _super);

  function GameScreen(game) {
    this.game = game;
    this.spriteAtlas = this.game.getSpritesAtlas();
    this.exampleActor = new ExampleActor(this.game);
    GameScreen.__super__.constructor.apply(this, arguments);
  }

  GameScreen.prototype.update = function(delta) {
    return this.exampleActor.update(delta);
  };

  GameScreen.prototype.draw = function(context) {
    this.exampleActor.draw(context);
  };

  return GameScreen;

})(LDFW.Screen);

module.exports = GameScreen;


},{"../actors/exampleactor.coffee":1}]},{},[2])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2FzY2hhZ2VobGljaC9kZXZlbG9wbWVudC9qcy9sZDI3L2NvZmZlZXNjcmlwdHMvZ2FtZS9hY3RvcnMvZXhhbXBsZWFjdG9yLmNvZmZlZSIsIi9Vc2Vycy9zYXNjaGFnZWhsaWNoL2RldmVsb3BtZW50L2pzL2xkMjcvY29mZmVlc2NyaXB0cy9nYW1lL2FwcGxpY2F0aW9uLmNvZmZlZSIsIi9Vc2Vycy9zYXNjaGFnZWhsaWNoL2RldmVsb3BtZW50L2pzL2xkMjcvY29mZmVlc2NyaXB0cy9nYW1lL2xkMjcuY29mZmVlIiwiL1VzZXJzL3Nhc2NoYWdlaGxpY2gvZGV2ZWxvcG1lbnQvanMvbGQyNy9jb2ZmZWVzY3JpcHRzL2dhbWUvc2NyZWVucy9nYW1lc2NyZWVuLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxRQUFBO0dBQUE7a1NBQUE7O0FBQU0sQ0FBTjtDQUNFOztDQUFhLENBQUEsQ0FBQSxtQkFBQTtDQUNYLEdBQUEsS0FBQSxzQ0FBQTtDQUFBLEVBRWdCLENBQWhCLFFBQUEsR0FBZ0I7Q0FGaEIsRUFHVSxDQUFWLEVBQUEsTUFBdUIsQ0FBYjtDQUpaLEVBQWE7O0NBQWIsRUFNUSxFQUFBLENBQVIsR0FBUztDQUNOLENBQ2tCLENBQUEsQ0FEbEIsQ0FBRCxDQUFPLEtBQVA7Q0FQRixFQU1ROztDQU5SLEVBWU0sQ0FBTixHQUFNLEVBQUM7Q0FDSixHQUFBLEVBQU0sQ0FBUCxJQUFBO0NBYkYsRUFZTTs7Q0FaTjs7Q0FEeUIsR0FBSTs7QUFnQi9CLENBaEJBLEVBZ0JpQixHQUFYLENBQU4sS0FoQkE7Ozs7QUNBQSxJQUFBOztBQUFBLENBQUEsRUFBTyxDQUFQLEdBQU8sUUFBQTs7QUFFUCxDQUZBLEVBRTBCLEdBQXBCLEdBQXFCLE9BQTNCO0NBQ0UsRUFHUSxDQUZBLEVBRE0sRUFHTixDQUhBLFlBQUEsR0FBQSxHQUFBO0NBSVMsQ0FBcUIsQ0FBTyxDQUFQLEVBQXRCLEVBQU4sRUFBQSxDQUFBO0NBSlYsRUFHUTtDQUppQjs7QUFRM0IsQ0FWQSxFQVVFLE1BQUE7Q0FDQSxLQUFBLE9BQUE7Q0FBQSxDQUFBLENBQVUsSUFBVixVQUFVO0NBRU0sRUFBTCxDQUFYLEdBQVcsRUFBWDtDQUhBOzs7O0FDVkYsSUFBQSxZQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFlLElBQUEsR0FBZixtQkFBZTs7QUFFVCxDQUZOO0NBR0U7O0NBQWEsQ0FBQSxDQUFBLFdBQUE7Q0FDWCxPQUFBLElBQUE7Q0FBQSxHQUFBLEtBQUEsOEJBQUE7Q0FBQSxDQUlFLENBRmUsQ0FBakIsS0FBQSxXQUFnQyxDQUFBO0NBRmhDLENBTUEsQ0FBc0IsQ0FBdEIsRUFBQSxHQUFVO0NBQ1IsU0FBQSxlQUFBO0NBQUEsRUFBYyxFQUFDLENBQWYsR0FBd0IsRUFBeEIsVUFBYztDQUFkLEVBQ2UsRUFBQyxDQUFoQixHQUF5QixHQUF6QixRQUFlO0NBRGYsQ0FHMEQsQ0FBdEMsQ0FBQSxDQUFuQixDQUFELEtBQWlELENBQWpEO0NBSEEsRUFJb0IsQ0FBQSxDQUFuQixDQUFELElBQW9CO0NBQ25CLEVBQUQsRUFBQyxRQUFEO0NBTkYsSUFBc0I7Q0FOdEIsR0FhQSxLQUFVO0NBZFosRUFBYTs7Q0FnQmI7OztDQWhCQTs7Q0FBQSxFQW1CaUIsTUFBQSxNQUFqQjtDQUFvQixHQUFRLE9BQUQsQ0FBUDtDQW5CcEIsRUFtQmlCOztDQW5CakI7O0NBRGlCLEdBQUk7O0FBc0J2QixDQXhCQSxFQXdCaUIsQ0F4QmpCLEVBd0JNLENBQU47Ozs7QUN4QkEsSUFBQSxvQkFBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBZSxJQUFBLEtBQWYsbUJBQWU7O0FBRVQsQ0FGTjtDQUdFOztDQUFhLENBQUEsQ0FBQSxDQUFBLGdCQUFFO0NBQ2IsRUFEYSxDQUFEO0NBQ1osRUFBZSxDQUFmLE9BQUEsSUFBZTtDQUFmLEVBQ29CLENBQXBCLFFBQUE7Q0FEQSxHQUVBLEtBQUEsb0NBQUE7Q0FIRixFQUFhOztDQUFiLEVBS1EsRUFBQSxDQUFSLEdBQVM7Q0FDTixHQUFBLENBQUQsQ0FBQSxLQUFBLENBQWE7Q0FOZixFQUtROztDQUxSLEVBUU0sQ0FBTixHQUFNLEVBQUM7Q0FDTCxHQUFBLEdBQUEsS0FBYTtDQVRmLEVBUU07O0NBUk47O0NBRHVCLEdBQUk7O0FBYTdCLENBZkEsRUFlaUIsR0FBWCxDQUFOLEdBZkEiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBFeGFtcGxlQWN0b3IgZXh0ZW5kcyBMREZXLkFjdG9yXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAc3ByaXRlc0F0bGFzID0gQGdhbWUuZ2V0U3ByaXRlc0F0bGFzKClcbiAgICBAc3ByaXRlID0gQHNwcml0ZXNBdGxhcy5jcmVhdGVTcHJpdGUgXCJleGFtcGxlLnBuZ1wiXG5cbiAgdXBkYXRlOiAoZGVsdGEpIC0+XG4gICAgQHNwcml0ZS5zZXRQb3NpdGlvbihcbiAgICAgIEBzcHJpdGUuZ2V0WCgpICsgMTAgKiBkZWx0YSxcbiAgICAgIEBzcHJpdGUuZ2V0WSgpICsgMTAgKiBkZWx0YVxuICAgIClcblxuICBkcmF3OiAoY29udGV4dCkgLT5cbiAgICBAc3ByaXRlLmRyYXcgY29udGV4dFxuXG5tb2R1bGUuZXhwb3J0cyA9IEV4YW1wbGVBY3RvclxuIiwiTEQyNyA9IHJlcXVpcmUgXCIuL2xkMjcuY29mZmVlXCJcblxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoLT5cbiAgcmV0dXJuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG4gICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgfHxcbiAgICAgICAgICAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCBjYWxsYmFjaywgMTAwMCAvIDYwXG4gICkoKVxuXG4kIC0+XG4gIHdyYXBwZXIgPSAkKFwiLmNhbnZhcy13cmFwcGVyXCIpXG5cbiAgZ2FtZSA9IG5ldyBMRDI3KHdyYXBwZXIpXG4iLCJHYW1lU2NyZWVuICAgPSByZXF1aXJlIFwiLi9zY3JlZW5zL2dhbWVzY3JlZW4uY29mZmVlXCJcblxuY2xhc3MgTEQyNyBleHRlbmRzIExERlcuR2FtZVxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuXG4gICAgQHByZWxvYWRlciA9IG5ldyBMREZXLlByZWxvYWRlciBbXG4gICAgICBcImFzc2V0cy9zcHJpdGVzLmpzb25cIixcbiAgICAgIFwiYXNzZXRzL3Nwcml0ZXMucG5nXCJcbiAgICBdXG4gICAgQHByZWxvYWRlci5vbiBcImRvbmVcIiwgPT5cbiAgICAgIHNwcml0ZXNKU09OID0gQHByZWxvYWRlci5nZXQgXCJhc3NldHMvc3ByaXRlcy5qc29uXCJcbiAgICAgIHNwcml0ZXNJbWFnZSA9IEBwcmVsb2FkZXIuZ2V0IFwiYXNzZXRzL3Nwcml0ZXMucG5nXCJcblxuICAgICAgQHNwcml0ZXNBdGxhcyA9IG5ldyBMREZXLlRleHR1cmVBdGxhcyBzcHJpdGVzSlNPTi5mcmFtZXMsIHNwcml0ZXNJbWFnZVxuICAgICAgQHNjcmVlbiAgICAgICA9IG5ldyBHYW1lU2NyZWVuIHRoaXNcbiAgICAgIEBydW4oKVxuICAgIEBwcmVsb2FkZXIubG9hZCgpXG5cbiAgIyMjXG4gICAqIEdldHRlcnMgLyBzZXR0ZXJzXG4gICMjI1xuICBnZXRTcHJpdGVzQXRsYXM6IC0+IHJldHVybiBAc3ByaXRlc0F0bGFzXG5cbm1vZHVsZS5leHBvcnRzID0gTEQyN1xuIiwiRXhhbXBsZUFjdG9yID0gcmVxdWlyZSBcIi4uL2FjdG9ycy9leGFtcGxlYWN0b3IuY29mZmVlXCJcblxuY2xhc3MgR2FtZVNjcmVlbiBleHRlbmRzIExERlcuU2NyZWVuXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUpIC0+XG4gICAgQHNwcml0ZUF0bGFzID0gQGdhbWUuZ2V0U3ByaXRlc0F0bGFzKClcbiAgICBAZXhhbXBsZUFjdG9yID0gbmV3IEV4YW1wbGVBY3RvciBAZ2FtZVxuICAgIHN1cGVyXG5cbiAgdXBkYXRlOiAoZGVsdGEpIC0+XG4gICAgQGV4YW1wbGVBY3Rvci51cGRhdGUgZGVsdGFcblxuICBkcmF3OiAoY29udGV4dCkgLT5cbiAgICBAZXhhbXBsZUFjdG9yLmRyYXcgY29udGV4dFxuICAgIHJldHVyblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTY3JlZW5cbiJdfQ==
;