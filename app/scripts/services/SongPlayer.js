/*global angular*/
/*global buzz*/
(function() {
  function SongPlayer($rootScope, Fixtures) {
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
      
      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });
      
      SongPlayer.currentSong = song;
    };
    
    /**
    * @function playSong
    * @desc Plays the currently set song.
    * @param {Object} song
    */
    var playSong = function(song) {
      SongPlayer.setVolume(SongPlayer.volume);
      currentBuzzObject.play();
      song.playing = true;
    };
    /**
    * @function stopSong
    * @desc Plays the currently set song.
    * @param {Object} song
    */
    var stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = false;
    };
    
    /**
    * @function getSongIndex
    * @desc return index of song
    * @return int
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
    * @desc Currently set volume
    * @type int;
    */
    SongPlayer.volume = 100;
    
    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;
    
    /**
    * @function setVolume
    * @desc sets the volume of the song
    * @param {int} volume
    */
    SongPlayer.setVolume = function(volume)
    {
      currentBuzzObject.setVolume(volume);
      SongPlayer.volume = volume;
    };
    
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
    * exists. Otherwise sets it stops playing.
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;
      var song = currentAlbum.songs[currentSongIndex];
      if (currentSongIndex < 0) {
        stopSong(song);
      } else {
        setSong(song);
        playSong(song);
      }
    };
    
    
    /**
    * @function next
    * @desc Sets the song to the next song on the index and plays it if it 
    * exists. Otherwise sets it stops playing.
    */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;
      var song = currentAlbum.songs[currentSongIndex];
      if (currentSongIndex >= currentAlbum.songs.length) {
        stopSong(song);
      } else {
        setSong(song);
        playSong(song);
      }
    };
    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };
    return SongPlayer;
  }
 
  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();