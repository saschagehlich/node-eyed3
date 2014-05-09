var EyeD3 = require('../index.js')
  , eyed3 = new EyeD3()
  , fs = require('fs')
  , path = require('path')
  , testFile = path.resolve(__dirname, 'assets/test.mp3')
  , tmpTestFile = path.resolve(__dirname, 'assets/tmptest.mp3')
  , testMeta = {
    artist: 'TestArtist',
    title: 'TestTitle',
    album: 'TestAlbum',
    comment: 'TestComment',
    lyrics: 'TestLyrics'
  }

describe('EyeD3', function () {
  it('should correctly generate the command line arguments', function (done) {
    var args = eyed3.buildArgs(testMeta)

    JSON.stringify(args).should.equal(JSON.stringify([
      '-a', 'TestArtist',
      '-t', 'TestTitle',
      '-A', 'TestAlbum',
      '-c', '::TestComment',
      '-L', '::TestLyrics'
    ]))
    done()
  })

  it('should correctly read the meta data of an .mp3 file', function (done) {
    eyed3.readMeta(testFile, function (err, meta) {
      if (err) throw err

      meta.artist.should.equal(testMeta.artist)
      meta.title.should.equal(testMeta.title)
      meta.album.should.equal(testMeta.album)
      meta.comment.should.equal(testMeta.comment)


      done()
    })
  })
  
  it('should correctly read the lyrics from an .mp3 file', function (done) {
    eyed3.readLyrics(testFile, function (err, lyrics) {
      if (err) throw err
  
      lyrics.should.equal(testMeta.lyrics)
  
  
      done()
    })
  })

  it('should correctly update the meta data of an .mp3 file', function (done) {
    fs.createReadStream(testFile).pipe(fs.createWriteStream(tmpTestFile))

    var newMeta = {
      title: testMeta.title + "New",
      artist: testMeta.artist + "New",
      album: testMeta.album + "New",
      comment: testMeta.comment + "New",
      lyrics: testMeta.lyrics + "New"
    }

    eyed3.updateMeta(tmpTestFile, newMeta, function (err) {
      if (err) throw err

      eyed3.readMeta(tmpTestFile, function (err, meta) {
        if (err) throw err

        meta.artist.should.equal(newMeta.artist)
        meta.title.should.equal(newMeta.title)
        meta.album.should.equal(newMeta.album)
        meta.comment.should.equal(newMeta.comment)
        
        eyed3.readLyrics(tmpTestFile, function (err, lyrics) {
          if (err) throw err
        
          lyrics.should.equal(newMeta.lyrics)
        
          done()
        })
      })
    })
  })
})
