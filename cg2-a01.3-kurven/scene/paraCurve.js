/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Tronico 04.11.2015
 *
 * Module: parametic curve
 *
 * A parameticCurve knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object.
 *
 */


/* requireJS module definition */
define([],
    (function() {

        "use strict";

        /**
         *  A parametic curve
         *  Parameters:
         *  - xt: x formula for any t,
         *  - yt: y formula for any t,
         *  - minT: minimum t,
         *  - maxT: maximum t,
         *  - segm: number of line segments
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var Curve = function(xt, yt, minT, maxT, segm, lineStyle) {

            console.log("creating parametic curve with x-formula " +
            xt + " & y-formula " + yt );

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
            
            // draw this parametic curve into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual line
                context.beginPath();

                

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke();

            };

            // test whether the mouse position is on this parametic curve segment
            this.isHit = function(context, pos) {

            };

            // return a empty list
            this.createDraggers = function() {
                
                var emptyList = [];
                
                return emptyList;

            };


        };

        // this module only exports the constructor for parametic curve objects
        return Curve;

    })); // define

    
