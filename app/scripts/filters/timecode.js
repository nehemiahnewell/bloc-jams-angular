/* global angular*/
(function() {
  function timecode(SongPlayer) {
    return function(seconds) {
      var seconds = Number.parseFloat(seconds);
      
      if (Number.isNaN(seconds)) {
        return '-:--';
      }
      
      return SongPlayer.toTime(seconds);
    };
  }
 
  angular
    .module('blocJams')
    .filter('timecode', ['SongPlayer', timecode]);
})();