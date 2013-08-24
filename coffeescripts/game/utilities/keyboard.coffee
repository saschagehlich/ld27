class Keyboard
  Keys:
    LEFT: 37
    UP: 38
    RIGHT: 39
    DOWN: 40

    W: 87
    A: 65
    S: 83
    D: 68

    SPACE: 32
    ESC: 27

  constructor: ->
    @keyStates = []
    for key, keyCode of @Keys
      @keyStates[keyCode] = false

    $(window).keydown @onKeyDown
    $(window).keyup   @onKeyUp

  onKeyDown: (e) =>
    keyCode = e.keyCode
    if @keyStates[keyCode]?
      @keyStates[keyCode] = true

  onKeyUp: (e) =>
    keyCode = e.keyCode
    if @keyStates[keyCode]?
      @keyStates[keyCode] = false

  pressed: (keyCode) ->
    @keyStates[keyCode] | false

module.exports = Keyboard
