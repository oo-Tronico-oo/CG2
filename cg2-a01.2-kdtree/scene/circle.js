/*
 *
 * Module: circle
 *
 * A circle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 *
 */


/* requireJS module definition */
define(["util", "Scene", "PointDragger"],
    (function(util,Scene,PointDragger) {

        "use strict";

        /**
         *  A simple point that can be dragged.
         *  Parameters:
         *  - point: array objects representing [x,y] coordinates of middle point
         *  - radius: number for radius
         *  - circleStyle: object defining color attributes for point drawing,
         *       begin of the form { color: "#00FF00" }
         */

        var Circle = function(point, radius,  circleStyle) {

            console.log("creating circle on position [" +
            point[0] + "," + point[1] + "] with the radius " + radius + ".");

            // draw style for drawing the line
            this.style = circleStyle || { width: "2", color: "#0000AA" };
            
            // initial values in case either point is [10,10]
            this.p = point || [10,10];
            // initial values in case either radiust is 20
            this.radius = radius || 20;
            

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                // what shape to draw
                context.beginPath();
                context.arc(this.p[0], this.p[1],       // position
                    this.radius,                             // radius
                    0.0, Math.PI*2,                     // start and end angle
                    true);                              // clockwise
                context.closePath();

                // draw style
                context.lineWidth   = this.style.width;
                context.strokeStyle = this.style.color;
                
                context.stroke();
            };

            // test whether the mouse position is on this line segment
            this.isHit = function(context, pos) {

                // check whether distance between mouse and dragger's center
                // is less or equal ( radius + (line width)/2 )
                var dx = pos[0] - this.p[0];
                var dy = pos[1] - this.p[1];
                var r = radius + this.style.width/2;
                return (dx*dx + dy*dy) <= (r*r + r*5) && (dx*dx + dy*dy) >= (r*r - r*5);

            };

            // return list of draggers to manipulate this circle
            this.createDraggers = function() {

                var draggerStyle = { radius:5, color: this.style.color, width:2, fill:true };
                var draggers = [];

                // create closure and callbacks for dragger
                var _circle = this;
                
                var getP0 = function() { return _circle.p; };
                var getP1 = function() { return [(_circle.p[0] + _circle.radius * Math.cos(-45)), (_circle.p[1] + _circle.radius * Math.sin(-45))]; };
                var setP0 = function(dragEvent) { _circle.p = dragEvent.position; };
                var setP1 = function(dragEvent) {
                    var tempX = dragEvent.position[0] - _circle.p[0];
                    var tempY = dragEvent.position[1] - _circle.p[1];
                    
                    _circle.radius = Math.sqrt((tempX*tempX) + (tempY*tempY));
                };
                draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
                draggers.push( new PointDragger(getP1, setP1, draggerStyle) );
                

                return draggers;

            };


        };

        // this module only exports the constructor for StraightLine objects
        return Circle;

    })); // define

    
