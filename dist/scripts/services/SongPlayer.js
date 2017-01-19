/*global angular*/
/*global buzz*/
(function() {
  function SongPlayer(Fixtures) {
    var SongPlayer = {};
    
    /**
    * @desc Album information
    * @type {Object}
    */
    var currentAlbum = Fixtures.getAlbum();
    
    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;
    
    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });
 
      SongPlayer.currentSong = song;
    };
    
    /**
    * @function playSong
    * @desc Plays the currently set song.
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };
    
    /**
    * @desc index of song
    * @type int
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };
    /**
    * @desc Currently set song
    * @type {Boolean}
    */
    SongPlayer.currentSong = null;

    /**
    * @function play
    * @desc Handles the logic of playing a song.
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } 
      else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          playSong(song);
        }
      } 
    };
    
    /**
    * @function pause
    * @desc Pauses the currently set song.
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };
    
    /**
    * @function previous
    * @desc Sets the song to the previous song on the index and plays it if it 
    * exists. Otherwise sets it to the first song.
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;
      
      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };
    
    return SongPlayer;
  }
 
  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();