{EventEmitter} = require "events"
async = require "../vendor/async.js"

class Preloader extends EventEmitter
  constructor: (@itemFilenames) ->
    @items = {}

  ###
   * Starts the loading process
  ###
  load: ->
    async.map @itemFilenames, @loadItem, (err, items) =>
      for item in items
        @items[item.filename] = item.item

      @emit "done"

  ###
   * Returns the item for the given filename
  ###
  get: (filename) ->
    unless @items[filename]?
      throw new Error("The file #{filename} has not been preloaded!")

    return @items[filename]

  ###
   * Initiates the loading process for the given filename
   * @param  [String] filename
   * @param  [Function] callback
   * @private
  ###
  loadItem: (filename, callback) =>
    extension = filename.split(".").pop()

    loadingMethod = @["load" + extension.toUpperCase()]
    unless loadingMethod?
      throw new Error("No loading method for " + filename)

    loadingMethod filename, callback

  ###
   * Loads a JSON file via AJAX
   * @param  [String] filename
   * @param  [Function] callback
   * @private
  ###
  loadJSON: (filename, callback) ->
    $.getJSON filename, (data) ->
      callback null, {
        filename: filename
        item: data
      }

  ###
   * Loads a FNT file via AJAX
   * @param  [String]   filename
   * @param  [Function] callback
  ###
  loadFNT: (filename, callback) ->
    $.get filename, (data) ->
      callback null, {
        filename: filename,
        item: data
      }

  ###
   * Loads an image item
   * @param  [String] filename
   * @param  [Function] callback
   * @private
  ###
  loadImage: (filename, callback) ->
    image = new Image()
    image.onload = ->
      callback null, {
        filename: filename
        item: image
      }
    image.src = filename

  loadPNG:  => @loadImage.apply(this, arguments)
  loadJPG:  => @loadImage.apply(this, arguments)
  loadJPEG: => @loadImage.apply(this, arguments)

module.exports = Preloader
