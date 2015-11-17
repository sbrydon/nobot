var rapgenius = require("rapgenius-js");
var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:rap|sing)\\s(?:about\\s)?(.+)", "i");

function makeRequest(query, done) {
  var lyricsSearchDone = function (err, lyrics) {
    if (err) return done(err);

    var lines = lyrics
      .getFullLyrics(false)
      .split("\n")
      .filter(function (l) {
        return l;
      });

    var joined = lines.slice(0, 3).join(" / ");
    if (joined.length > 420) return done(null, "Nazty rap", true);

    done(null, joined);
  };

  var songSearchDone = function (err, songs) {
    if (err) return done(err);
    if (!songs.length) return done(null, "Rap not found", true);

    rapgenius.searchSongLyrics(sample(songs).link, "rap", lyricsSearchDone);
  };

  rapgenius.searchSong(query, "rap", songSearchDone);
}

function rap(text, done) {
  var capture = regex.exec(text);
  if (!capture) {
    return false;
  }

  makeRequest(capture[1], done);
  return true;
}

module.exports = rap;