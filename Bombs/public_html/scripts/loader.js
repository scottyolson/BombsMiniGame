//various parts of this code borrowed from Dean Mathias' class examples
var GAME = {
	images : {},
	screens : {},
//	sounds : {},

	status : {
		preloadRequest : 0,
		preloadComplete : 0
	}
};

//------------------------------------------------------------------
//
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//
//------------------------------------------------------------------
window.addEventListener('load', function() {
	console.log('Loading resources...');
	Modernizr.load([
		{
			load : [
                            'preload!scripts/game.js',
                            'preload!scripts/particleSystem.js',
                            'preload!scripts/graphics.js',
                            'preload!scripts/input.js',
                            'preload!scripts/gameplay.js',                            
                            'preload!scripts/mainmenu.js',
                            'preload!scripts/highscores.js',
                            'preload!scripts/credits.js',
                            'preload!scripts/random.js',
                            'preload!scripts/bombSystem.js',
                            'preload!images/Background.png',
                            'preload!images/Bomb.png',
                            'preload!images/Explosion.png',
                            'preload!images/checkmark.png',
                            'preload!images/glass_numbers_0.png',
                            'preload!images/glass_numbers_1.png',
                            'preload!images/glass_numbers_2.png',
                            'preload!images/glass_numbers_3.png',
                            'preload!images/glass_numbers_4.png',
                            'preload!images/glass_numbers_5.png',
                            'preload!images/glass_numbers_6.png',
                            'preload!images/glass_numbers_7.png',
                            'preload!images/glass_numbers_8.png',
                            'preload!images/glass_numbers_9.png'
                            
			],
			complete : function() {
				console.log('All files requested for loading...');
			}
		}
	]);
}, false);

//Code taken from Dean Mathias' class examples
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
	console.log('preloading: ' + resource.url);
	
	GAME.status.preloadRequest += 1;
	var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
//	var isSound = /.+\.(mp3|wav)$/i.test(resource.url);

	resource.noexec = isImage;
	resource.autoCallback = function(e) {
		if (isImage) {
			var image = new Image();
			image.src = resource.url;
			GAME.images[resource.url] = image;
		}
//		if (isSound) {
//			var sound = new Sound();
//			sound.src = resource.url;
//			GAME.sounds[resource.url] = sound;
//		}

		GAME.status.preloadComplete += 1;
		
		//
		// When everything has finished preloading, go ahead and start the game
		if (GAME.status.preloadComplete === GAME.status.preloadRequest) {
			console.log('Preloading complete!');
			GAME.game.initialize();
		}
	};
	
	return resource;
});
