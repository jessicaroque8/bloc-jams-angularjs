(function() {
     function SongPlayer($rootScope, Fixtures) {

         var SongPlayer = {};



         /**
         * @desc Holds album info, including song array
         * @type {Object}
         */
         var currentAlbum = Fixtures.getAlbum();



         /**
         * @desc Buzz object audio file
         * @type {Object}
         */
         var currentBuzzObject = null;


         /**
         * @desc Active song object from list of songs
         * @type {Object}
         */
         SongPlayer.currentSong = null;

         /**
         * @desc Current playback time (in seconds) of currently playing song
         * @type {Number}
         */
         SongPlayer.currentTime = null;

         /**
         * @desc Current volume of the song player
         * @type {Number}
         */
         SongPlayer.volume = 50;



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


            currentBuzzObject.bind('volumechange', function() {
               $rootScope.$apply(function() {
                  SongPlayer.volume = currentBuzzObject.getVolume();
               });
            });


           SongPlayer.currentSong = song;
         };



         /**
         * @function playSong
         * @desc Plays the audio file currentBuzzObject and sets the playing property
         *       on song to true
         * @param {Object} song
         */
         var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
         };



         /**
         * @function stopSong
         * @desc Stops the audio file currentBuzzObject and sets the playing property
         *       on song to false
         * @param {Object} song
         */
         var stopSong = function(song) {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
         };



         /**
         * @function getSongIndex
         * @desc Gets the clicked song's array index from the album object
         * @param {Object} song
         * @returns The index of the clicked song from the album object
         */
         var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
         };



         /**
         * @function SongPlayer.play
         * @desc Plays the selected song, and if needed stops the currently playing song.
         * @param {Object} song
         */
         SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
               setSong(song);
               playSong(song);
            } else if (SongPlayer.currentSong === song) {
               if (currentBuzzObject.isPaused()) {
                   playSong(song);
               }
            }
         };



         /**
         * @function SongPlayer.pause
         * @desc Pauses the currently playing song.
         * @param {Object} song
         */
         SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            stopSong(song);
            };



         /**
         * @function SongPlayer.previous
         * @desc Goes the previous song in the album.
         */
         SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
               stopSong(currentSong);
            } else {
               var song = currentAlbum.songs[currentSongIndex];
               setSong(song);
               playSong(song);
            }

         };



         /**
         * @function SongPlayer.next
         * @desc Goes the next song in the album.
         */
         SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex > currentAlbum.songs.length) {
               stopSong(currentSong);
            } else {
               var song = currentAlbum.songs[currentSongIndex];
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



         /**
         * @function SongPlayer.setVolume
         * @desc Change the volume of the song player.
         * @param {Object} song
         */
         SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
               currentBuzzObject.setVolume(volume);
            }
         };
         return SongPlayer;
     }





     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
