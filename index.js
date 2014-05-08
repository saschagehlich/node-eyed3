var spawn = require("child_process").spawn

function EyeD3(options) {
  if(!options) options = {}
  if(!options.eyed3_path) options.eyed3_path = "eyeD3"

  this.options = options
}

/**
 * Reads the meta data of the given file
 *
 * @param  {String}   file
 * @param  {Function} callback
 */
EyeD3.prototype.readMeta = function(file, callback) {
  var args = ['--no-color', '--rfc822', file]
    , p = spawn(this.options.eyed3_path, args)
    , allData = ''

  p.stdout.on('data', function (data) {
    allData += data
  })

  p.on('exit', function (exitCode) {
    if(exitCode !== 0)
      return callback(new Error('eyeD3 exit code: ' + exitCode))

    var response = {}
      , lines = allData.split('\n')
      , line, match

    for(var i = 0; i < lines.length; i++) {
      line = lines[i]
      if(match = line.match(/^(.*): (.*)$/i)) {
        response[match[1].toLowerCase()] = match[2]
      }
    }

    callback(null, response)
  })
}

/**
 * Updates the meta data of the given file
 *
 * @param  {String}   file
 * @param  {Object}   meta
 * @param  {Function} callback
 */
EyeD3.prototype.updateMeta = function(file, meta, callback) {
  var args = this.buildArgs(meta).concat([file])
    , p = spawn(this.options.eyed3_path, args)

  p.on('exit', function (exitCode) {
    if(exitCode !== 0)
      return callback(new Error('eyeD3 exit code:' + exitCode))

    if(callback) callback()
  })
}

/**
 * Builds an argument error out of the given meta data
 *
 * @param  {Object} meta
 * @return {Array} The arguments for our spawn() call
 */
EyeD3.prototype.buildArgs = function(meta) {
  var args = []

  if(meta.artist)  args.push('-a', meta.artist)
  if(meta.title)   args.push('-t', meta.title)
  if(meta.album)   args.push('-A', meta.album)
  if(meta.comment) args.push('-c', '::' + meta.comment)
  if(meta.lyrics)  args.push('-L', '::' + meta.lyrics)

  return args
}

module.exports = EyeD3
