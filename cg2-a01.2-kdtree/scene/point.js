/*
 *
 * Module: point
 *
 * A point knows how to draw itself into a specified 2D context,
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
         *  - pointStyle: object defining color attributes for point drawing,
         *       begin of the form { color: "#00FF00" }
         */

        var Point = function(point, radius,  lineStyle) {

            console.log("creating point on position [" +
            point[0] + "," + point[1] + "].");

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
            
            // initial values in case either point is undefined
            this.center = point || [10,10];
            this.radius = radius || 20;
            

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                // what shape to draw
                context.beginPath();
                context.arc(this.center[0], this.center[1],       // position
                    this.radius,                        // radius
                    0.0, Math.PI*2,           // start and end angle
                    true);                    // clockwise
                context.closePath();

                // draw style
                context.lineWidth   = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;
                context.fillStyle   = this.lineStyle.color;

                // trigger the actual drawing
                //if(this.pointStyle.fill) {
                    context.fill();
                //};
                context.stroke();
            };

            // test whether the mouse position is on this line segment
            this.isHit = function(context, pos) {

                // check whether distance between mouse and dragger's center
                // is less or equal ( radius + (line width)/2 )
                var dx = pos[0] - this.center[0];
                var dy = pos[1] - this.center[1];
                var r = 6;
                return (dx*dx + dy*dy) <= (r*r);

            };

            // return list of draggers to manipulate this line
            this.createDraggers = function() {

                var draggerStyle = { radius:5, color: this.lineStyle.color, width:2, fill:false };
                var draggers = [];

                // create closure and callbacks for dragger
                var _point = this;
                var getP0 = function() { return _point.center; };
                var setP0 = function(dragEvent) { _point.center = dragEvent.position; };
                draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
                

                return draggers;

            };


        };

        // this module only exports the constructor for StraightLine objects
        return Point;

    })); // define

    
