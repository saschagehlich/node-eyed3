var spawn = require("child_process").spawn
var path = require("path")

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
  var args = ['--no-color', file]
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
* Reads the lyrics of the given file
*
* @param  {String}   file
* @param  {Function} callback
*/
EyeD3.prototype.readLyrics = function(file, callback) {
  var args = ['--no-color', '--verbose', file]
    , p = spawn(this.options.eyed3_path, args)
    , allData = ''

  p.stdout.on('data', function (data) {
    allData += data
  })

  p.on('exit', function (exitCode) {
    if(exitCode !== 0)
      return callback(new Error('eyeD3 exit code: ' + exitCode))

    var response = '';

    if(match = allData.match(/<.*lyric\/text.*:\s(.*)\s\[Lang:[^\]]*\]\s*\[Desc:[^\]]*\]>/im)) {
      response = match[1]
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
    , p = spawn(this.options.eyed3_path, args, { cwd: path.dirname(this.options.eyed3_path) } )

	// console.log(this.options.eyed3_path, args);

  var errors = '';

	p.stderr.on('data', (d) => {
    errors += `${d}`;
    //console.log(`eyeD3 error: ${d}`);
  });
	// p.stdout.on('data', (d) => console.log(`eye: ${d}`));

  p.on('exit', exitCode => {
    if(exitCode !== 0)
      return callback(new Error('eyeD3 exit code:' + exitCode + '\nInput: ' + this.options.eyed3_path + ' ' + JSON.stringify(args) + '\n' + errors))

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
  if(meta.track)   args.push('-n', meta.track)
  if(meta.trackTotal)   args.push('-N', meta.trackTotal)
  if(meta.disc)    args.push('-d', meta.disc)
  if(meta.year)    args.push('-Y', meta.year, '--release-date', meta.year, '--recording-date', meta.year, '--encoding-date', meta.year)
  if(meta.genre)    args.push('--genre', meta.genre)
  if(meta.image)   args.push('--add-image', meta.image+':FRONT_COVER')
  if(meta.comment) args.push('-c', meta.comment)
  if(meta.lyrics)  args.push('--add-lyrics', meta.lyrics)

  args.push('--encoding', 'utf8')
  args.push('--to-v2.3') // Prefer v2.3 for Windows Explorer and Groove compatibility

  return args
}

module.exports = EyeD3
