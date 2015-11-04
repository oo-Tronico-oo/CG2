/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Tronico 04.11.2015
 * 
 * Module: polygon
 *
 * this draw a polygon for bezier curve
 *
 */


/* requireJS module definition */
define([],
    (function() {

        "use strict";

        /**
         *  Polygon
         */

        var Polygon = function(point0, point1, point2, point3, lineStyle) {

            
            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
            
            // initial values in case either point is undefined
            this.p0 = point0 || [10,10];
            this.p1 = point1 || [50,50];
            this.p2 = point2 || [100,50];
            this.p3 = point3 || [150,10];

            // draw this Polygon into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual line
                context.beginPath();

                // set points to be drawn
                context.moveTo(this.p0[0],this.p0[1]);
                context.lineTo(this.p1[0],this.p1[1]);
                context.lineTo(this.p2[0],this.p2[1]);
                context.lineTo(this.p3[0],this.p3[1]);

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke();
            };

            // return false
            this.isHit = function(context,pos) {

                return false;
            };

            // return a empty list
            this.createDraggers = function() {
                
                var emptyList = [];
                
                return emptyList;

            };


        };

        // this module only exports the constructor for StraightLine objects
        return Polygon;

    })); // define

    
