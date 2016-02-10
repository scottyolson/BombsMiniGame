function bombSystem(spec, graphics) {
    var that = {},
        startingX = GAME.screenWidth / 2 - 200,
        nextPos = {x: startingX, y: GAME.screenHeight / 2 + 250},
        numRows = 2,
        bombImg = GAME.images['images/Bomb.png'],
        explosionImg = GAME.images['images/Explosion.png'],
        checkMarkImg = GAME.images['images/checkmark.png'],
        bombs = {},
        nextName = 1,
        timerImgCounter = 0,
        levels = [
            [3, 3, 2, 2, 1, 1],
            [3, 3, 2, 2, 1, 1, 4, 3, 2],
            [3, 3, 2, 2, 1, 1, 4, 3, 2, 5, 4, 3],
            [3, 3, 2, 2, 1, 1, 4, 3, 2, 5, 4, 3, 6, 5, 4],
            [3, 3, 2, 2, 1, 1, 4, 3, 2, 5, 4, 3, 6, 5, 4, 7, 6, 5]
        ],
        currLevel = 0,
        particles = null,
        score = 0,
        NEXT_TIMER = 3000;

    particles = particleSystem({
        image: GAME.images['images/Explosion.png'],
        center: {x: 10, y: 10},
        size: {mean: 10, std: 2},
        speed: {mean: 20, stdev: 2},
        lifetime: {mean: 2, stdev: 1}  
    }, GAME.graphics);

    var randomTimer = function(array){
        var index = Math.floor(Math.random() * array.length);
        var value = array[index];
        array.splice(index, 1);
        return value;        
    };
    
    var bombTimers = [
        GAME.images['images/glass_numbers_0.png'],
        GAME.images['images/glass_numbers_1.png'],
        GAME.images['images/glass_numbers_2.png'],
        GAME.images['images/glass_numbers_3.png'],
        GAME.images['images/glass_numbers_4.png'],
        GAME.images['images/glass_numbers_5.png'],
        GAME.images['images/glass_numbers_6.png'],
        GAME.images['images/glass_numbers_7.png'],
        GAME.images['images/glass_numbers_8.png'],
        GAME.images['images/glass_numbers_9.png']
    ];

    var newBomb = function() {
        var timerNum = randomTimer(levels[currLevel]);
        var b = {
            image: bombImg,
            center: nextPos,
            size: 90,
            timer: timerNum,
            exploded: false
        };

        bombs[nextName++] = b;
    };
    
    var inCircle = function(centerX, centerY, mouseX, mouseY, r) {
        var dx = centerX - mouseX;
        var dy = centerY - mouseY;
        return ((dx * dx) + (dy * dy) <= r * r);
    };

    that.nextLevel = function(){
        startingX = GAME.screenWidth / 2 - 200;
        nextPos = {x: startingX, y: GAME.screenHeight / 2 + 250};
        currLevel++;
        numRows++;
        timerImgCounter = 0;
    };
    
    that.create = function() {
        //clear bombs array
        bombs = {};
        //for numRows create 3 bombs per row
        for (var row = 0; row < numRows; row++) {
            //3 per row
            for (var col = 0; col < 3; col++) {
                newBomb();
                //move the position of the next bomb's x coord
                nextPos = {x: nextPos.x + 100, y: nextPos.y};
            }
            //move up a row in coordinate system
            nextPos = {x: startingX, y: nextPos.y - 100};
        }
    };
    
    //finds if the mouse clicked event is over any of our objects
    //
    that.findParticle = function(mouseX, mouseY) {
        var value,
                bomb;
        for (value in bombs) {
            if (bombs.hasOwnProperty(value)) {
                bomb = bombs[value];
                //if bomb is still alive put check mark
                if (bomb.timer > 0) {                    
                    //
                    // check if mousex and y are in the diameter of the bomb
                    if (inCircle(bomb.center.x, bomb.center.y, mouseX, mouseY, bomb.size / 2)) {
                        score += bomb.timer;
                        //if isn't exploded change image to check mark
                        bomb.timer = -1;
                    }                    
                }
            }
        }
    };
    
    var canAdvance = function(){
        var value, 
                bomb,
                advance = true;
        for(value in bombs){
            if (bombs.hasOwnProperty(value)) {
                bomb = bombs[value];
                if(bomb.timer !== -1)
                    advance = false;
            }
        }
        return advance;
    };
    
    that.getScore = function(){
        return score;
    };

    that.update = function(elapsedTime) {
        var value,
                bomb;
        timerImgCounter += elapsedTime;
        if (timerImgCounter >= NEXT_TIMER) {
            for (value in bombs) {
                if (bombs.hasOwnProperty(value)) {
                    bomb = bombs[value];
                    if (bomb.timer > 0)
                        bomb.timer--;
                }
            }
            timerImgCounter = 0;
        }
        return canAdvance();
    };
    
    //------------------------------------------------------------------
    //
    // Render all bombs
    //
    //------------------------------------------------------------------
    that.render = function(elapsedTime) {
        var value,
                bomb,
                timerImg;

        for (value in bombs) {
            if (bombs.hasOwnProperty(value)) {
                bomb = bombs[value];
                if(bomb.timer > 0){
                    timerImg = GAME.graphics.Texture({
                        image: bombTimers[bomb.timer],
                        center: {x: bomb.center.x + 12, y: bomb.center.y + 10},
                        width: 70, height: 70
                    });
                }
                else{                    
                    timerImg = GAME.graphics.Texture({
                        image: explosionImg,
                        center: {x: bomb.center.x + 12, y: bomb.center.y + 10},
                        width: 70, height: 70
                    });
                    if(!bomb.exploded && bomb.timer !== -1){
                        particles.updatePos(bomb.center.x, bomb.center.y);
                        for(var i = 0; i < 30; i++)
                            particles.create();
                        bomb.exploded = true;
                    }
                }
                //if bomb timer === -1 it has been clicked and should be a checkmark
                if(bomb.timer === -1){
                    timerImg = GAME.graphics.Texture({
                        image: checkMarkImg,
                        center: {x: bomb.center.x + 12, y: bomb.center.y + 10},
                        width: 70, height: 70
                    });
                }
                
                graphics.drawImage(bomb);
                timerImg.draw();
                particles.update(elapsedTime/1000);
                particles.render();
            }
        }
    };

    return that;
}