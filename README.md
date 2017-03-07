# node-eyed3

A wrapper for reading and updating ID3 data of (e.g.) MP3 files using eyeD3.

[![NPM](https://nodei.co/npm/eyed3.png)](https://nodei.co/npm/eyed3/)

## Notice

Make sure you have `eyeD3` installed.

## API

```js
  var EyeD3 = require('eyed3')
    , eyed3 = new EyeD3({
      eyed3_executable: 'eyeD3'
    })

  eyed3.readMeta('file.mp3', function (err, meta) {
    // Meta contains a hash with the following properties:
    // artist, title, album, comment
  })

  eyed3.readLyrics('file.mp3', function (err, lyrics) {
    // lyrics will be returned as a string
  })

  var meta = {
    artist:  "MyArtist",
    title:   "MyTitle",
    album:   "MyAlbum",
    comment: "MyComment",
    lyrics:  "MyLyrics",
    image:   "/path/to/my/beautiful/cover.jpg",
    year:    "2016",
    track:   "5",
    trackTotal: "13",
    disc:    "1",
    genre:   "Pop"
  }
  eyed3.updateMeta('file.mp3', meta, function (err) {
    // file.mp3 now has updated meta data
  })  
```

## Running tests

    $ npm install
    $ make test

## License

(The MIT License)

Copyright (c) 2013 Sascha Gehlich <sascha@gehlich.us>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
