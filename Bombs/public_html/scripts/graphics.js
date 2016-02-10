//Scott Olson
//Code adapted from course examples from Dr. James Dean Mathias

GAME.graphics = (function() {
    'use strict';

    var canvas = document.getElementById('mainCanvas'),
            context = canvas.getContext('2d');
            
    GAME.screenWidth = canvas.width = window.innerWidth;
    GAME.screenHeight = canvas.height = window.innerHeight;

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clear() {
        context.clear();
    }
    
    //------------------------------------------------------------------
    //
    // Expose an ability to draw an image/texture on the canvas.
    //
    //------------------------------------------------------------------
    function drawImage(spec) {
        context.save();

        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
                spec.image,
                spec.center.x - spec.size / 2,
                spec.center.y - spec.size / 2,
                spec.size, spec.size);

        context.restore();
    }

    function Texture(spec) {
        var that = {},
            xMax = GAME.screenWidth,
            yMax = GAME.screenHeight,
            goRight = true;

        var wrap = function(){
            //check both min and max of x bounds
            if(spec.center.x > xMax){
                spec.center.x -= xMax;
            }else if(spec.center.x < 0){
                spec.center.x += xMax;
            }
            //check y bounds at max and min
            if(spec.center.y > yMax){
                spec.center.y -= yMax;
            }else if(spec.center.y < 0){
                spec.center.y += yMax;
            }
        };
        
        that.setWidth = function(width){
            spec.width = width;
        };
        
        /************************
         * 
         * GETTERS
         */
        that.getWidth = function() {
            return spec.width;
        };

        that.getHeight = function() {
            return spec.height;
        };

        that.getRadius = function() {
            return spec.height / 2;
        };

        that.getX = function() {
            return spec.center.x;
        };
        
        that.getY = function() {
            return spec.center.y;
        };

        that.getPos = function() {
            return spec.center;
        };

        that.getRotation = function() {
            return spec.rotation;
        };
        
        /*****************
         * 
         * DOERS/Setters
         * 
         */
        that.moveLeft = function(elapsedTime) {
            spec.center.x -= spec.moveRate * (elapsedTime / 1000);
        };

        that.moveRight = function(elapsedTime) {
            spec.center.x += spec.moveRate * (elapsedTime / 1000);
        };

        that.moveUp = function(elapsedTime) {
            spec.center.y -= spec.moveRate * (elapsedTime / 1000);
        };

        that.moveDown = function(elapsedTime) {
            spec.center.y += spec.moveRate * (elapsedTime / 1000);
        };
        
        that.updatePlayer = function(xMin, xMax, elapsedTime){
            {
                //go right until you hit xMax
                if (goRight) {
                    if (spec.center.x < xMax)
                        that.moveRight(elapsedTime);
                    else
                        goRight = false;
                }
                //else go left until you hit xMin
                else {
                    if (spec.center.x > xMin)
                        that.moveLeft(elapsedTime);
                    else
                        goRight = true;
                }
            }
        };

        that.draw = function() {
            context.save();

            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);

            context.drawImage(
                    spec.image,
                    spec.center.x - spec.width / 2,
                    spec.center.y - spec.height / 2,
                    spec.width,
                    spec.height);
            context.restore();
        };

        return that;
    }

    //code for rendering text
    function Text(spec) {
        var that = {};

        that.updateRotation = function(angle) {
            spec.rotation += angle;
        };
        
        that.updateScore = function(score){
            spec.text = score;
        };
        
        that.countDown = function(){
            spec.text--;
        };
        
        that.getText = function(){
            return spec.text;
        };
        
        that.setText = function(text){
            spec.text = text;
        };

        function measureTextHeight(spec) {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            var height = context.measureText('C').width;

            context.restore();

            return height;
        }

        function measureTextWidth(spec) {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            var width = context.measureText(spec.text).width;

            context.restore();

            return width;
        }

        that.draw = function() {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;
            context.textBaseline = 'top';

            context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

            context.fillText(spec.text, spec.pos.x, spec.pos.y);
            context.strokeText(spec.text, spec.pos.x, spec.pos.y);

            context.restore();
        };

        that.height = measureTextHeight(spec);
        that.width = measureTextWidth(spec);
        that.pos = spec.pos;

        return that;
    }

    //------------------------------------------------------------------
    //
    // This is used to create a rectange function that can be used by client
    // code for rendering.
    //
    //------------------------------------------------------------------
    function Rectangle(spec) {
        var that = {};

        that.updateRotation = function(angle) {
            spec.rotation += angle;
        };

        that.draw = function() {
            context.save();
            context.translate(spec.x + spec.width / 2, spec.y + spec.height / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.x + spec.width / 2), -(spec.y + spec.height / 2));

            context.fillStyle = spec.fill;
            context.fillRect(spec.x, spec.y, spec.width, spec.height);

            context.strokeStyle = spec.stroke;
            context.strokeRect(spec.x, spec.y, spec.width, spec.height);

            context.restore();
        };

        return that;
    }
    
    return{
        clear : clear,
        drawImage : drawImage,
        Texture : Texture,
        Text : Text,
        Rectangle : Rectangle
    };
}());//end graphics


