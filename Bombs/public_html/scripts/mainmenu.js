/*jslint browser: true, white: true, plusplus: true */
/*global GAME */
GAME.screens['main-menu'] = (function() {
	'use strict';
	
	function initialize() {
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() { 
				GAME.game.showScreen('game-play');
			},
			false);
		
//		document.getElementById('id-settings').addEventListener(
//				'click',
//				function() {
//					GAME.game.showScreen('settings');
//					active = true;
//				},
//				false);
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { 
				GAME.game.showScreen('high-scores');
			},
			false);
		
//		document.getElementById('id-help').addEventListener(
//			'click',
//			function() { 
//				GAME.game.showScreen('help');
//			},
//			false);
		
		document.getElementById('id-credits').addEventListener(
			'click',
			function() { 
				GAME.game.showScreen('credits');
			},
			false);
	}
	
	function run() {
		//start AI after 10 seconds

	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
