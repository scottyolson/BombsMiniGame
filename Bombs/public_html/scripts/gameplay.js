/*jslint browser: true, white: true, plusplus: true */
/*global GAME, console, KeyEvent, requestAnimationFrame, performance */
GAME.screens['game-play'] = (function() {
    'use strict';

    var myKeyboard = GAME.input.Keyboard(),
            mouse = GAME.input.Mouse(),
            mouseClick = null,
            cancelNextRequest = false,
            level = 1,
            changeLevel = false,
            scoreText = null,
            score = null,
            pause = 0,
            gameOverCount = 0,
            gameOver = false,
            gameOverText = null,
            countdownText = null,
            countdownTimer = 0,
            newLevel = true,
            countSound = null,
            myBombs = null,
            createBombs = true,
            levelCounter = 0,
            levelLength = 8000;
            
    function initialize() {
        console.log('game initializing...');

        //
        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            //
            // Stop the game loop by canceling the request for the next animation frame
//            cancelNextRequest = true;
//            //
//            // Then, return to the main menu
//            GAME.game.showScreen('main-menu');
                location.reload();
        });

        mouse.registerCommand('mousedown', function(e, elapsedTime) {
            mouseClick = true;
            //find what was clicked
            //offset logic found at http://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
            var mouseX, mouseY;
            if (e.offsetX) {
                mouseX = e.offsetX;
                mouseY = e.offsetY;
            }
            else if (e.layerX) {
                mouseX = e.layerX;
                mouseY = e.layerY;
            }
            ///find if mouse x and y are in any radii'
            ////console.log('x: ' + mouseX + ' y: ' + mouseY);
            if(!newLevel)
                myBombs.findParticle(mouseX, mouseY);
        });
        
        mouse.registerCommand('mouseup', function(e, elapsedTime) {
            mouseClick = false;
        });
        
        countSound = function(){
            var sound = new Audio('sounds/buzz.wav');
            sound.play();
        };
        
        scoreText = GAME.graphics.Text({
            text: 'Score ',
            font: '60px Arial, sans-serif',
            fill: 'rgba(0, 255, 0, 1)',
            stroke: 'rgba(255, 255, 255, 1)',
            pos: {x: 50, y: 20},
            rotation: 0
        });
        
        score = GAME.graphics.Text({
            text: 0,
            font: '60px Arial, sans-serif',
            fill: 'rgba(0, 255, 0, 1)',
            stroke: 'rgba(255, 255, 255, 1)',
            pos: {x: 300, y: 20},
            rotation: 0
        });
        
        countdownText = GAME.graphics.Text({
            text: 3,
            font: '150px Arial, sans-serif',
            fill: 'rgba(0, 255, 0, 1)',
            stroke: 'rgba(255, 255, 255, 1)',
            pos: {x: GAME.screenWidth/2, y: GAME.screenHeight/2 - 200}
        });
        
        gameOverText = GAME.graphics.Text({
            text: 'GAME OVER!',
            font: '90px Arial, sans-serif',
            fill: 'rgba(255, 0, 0, 1)',
            stroke: 'rgba(255, 255, 255, 1)',
            pos: {x: GAME.screenWidth/2 - 200, y: 20},
            rotation: 0
        });
        
        myBombs = bombSystem({/*for future use if we want some specs*/}, GAME.graphics);
    }

    //This is the main update function where various frameworks can be updated
    //
    function gameUpdate(elapsedTime) {
        myKeyboard.update(elapsedTime);
        mouse.update(elapsedTime);
                
        if(gameOver)
            //start counting up this counter
            gameOverCount += elapsedTime;
        
        if(gameOverCount >= 3000){
            //go back to main menu after 3 seconds
             // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main menu
            location.reload();
        }
        
        //update countdown variables
        if(newLevel){
            //update new level counter
            countdownTimer += elapsedTime;
            if(countdownTimer >= 1000){
                if(countdownText.getText() === 'Go!'){
                    newLevel = false;
                    return;
                }
                countSound();
                countdownText.countDown();
                countdownTimer = 0;
            }
            if(countdownText.getText() === 0){
                countdownText.setText('Go!');
            }
        }
        //this is the stuff to execute after the countdown
        else{
            changeLevel = myBombs.update(elapsedTime);
            levelCounter += elapsedTime;
        }
        
        if(createBombs){
            myBombs.create();
            createBombs = false;
        }
        
        if (levelCounter >= levelLength) {
            //then level is over and it is time to either go to next level or say game over
            if (changeLevel) {
                level++;
                if(level === 6){
                    gameOverText.setText('You Win!!!!');
                    gameOver = true;
                }
                else{
                    //reset countdown variables and level up bombsystem
                    newLevel = true;
                    createBombs = true;                    
                    changeLevel = false;
                    myBombs.nextLevel();

                    countdownText = GAME.graphics.Text({
                        text: 3,
                        font: '150px Arial, sans-serif',
                        fill: 'rgba(0, 255, 0, 1)',
                        stroke: 'rgba(255, 255, 255, 1)',
                        pos: {x: GAME.screenWidth / 2, y: GAME.screenHeight / 2 - 200}
                    });
                }
                levelCounter = 0;
            }
            else{
                //game over
                gameOver = true;
            }
        }
        
        score.updateScore(myBombs.getScore());
    }

    //This is the main render function where various frameworks are rendered
    //
    function gameRender(elapsedTime) {
        GAME.graphics.clear();
                
        //draw score
        scoreText.draw();
        score.draw();
        
        //draw bombs
        myBombs.render(elapsedTime);
        
        if(newLevel)
            countdownText.draw();
        
        if(gameOver)
            //display game over text
            gameOverText.draw();
    }

    //------------------------------------------------------------------
    //
    // This is the Game Loop function!
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        GAME.elapsedTime = time - GAME.lastTimeStamp;
        GAME.lastTimeStamp = time;

        gameUpdate(GAME.elapsedTime);
        gameRender(GAME.elapsedTime);

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function run() {
        GAME.lastTimeStamp = performance.now();
        countSound();
        //
        // Start the animation loop 
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };
}());
