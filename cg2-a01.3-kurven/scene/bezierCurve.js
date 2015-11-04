/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Tronico 04.11.2015
 *
 * Module: bezier curve
 *
 * A bezierCurve knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object.
 *
 */


/* requireJS module definition */
define(["vec2", "PointDragger"],
    (function(vec2, PointDragger) {

        "use strict";

        /**
         *  A bezier curve
         *  Parameters:
         *  - point0 - point3 are control polygon
         *  - minT: minimum t,
         *  - maxT: maximum t,
         *  - segm: number of line segments
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var BezierCurve = function(point0, point1, point2, point3, segm, lineStyle) {

            console.log("creating parametic curve with x-formula " +
             " & y-formula "  );

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
            
            var p = [];
            var minT = 0;
            var maxT = 1;
            this.controllP0 = point0 || [100, 50];
            this.controllP1 = point1 || [150, 80];
            this.controllP2 = point2 || [180, 100];
            this.controllP3 = point3 || [120, 150];
            
            // draw this parametic curve into the provided 2D rendering context
            this.draw = function(context) {
                
                for(var i = 0, t, x, y, t, b0, b1, b2, b3; i <= segm; i++){
                t = minT + (maxT - minT) / segm * i;
                
                b0 = Math.pow((1-t), 3);
                b1 = 3*Math.pow((1-t), 2)*t;
                b2 = 3*(1-t)*Math.pow(t, 2);
                b3 = Math.pow(t, 3);
                
                x = b0*this.controllP0[0] + b1*this.controllP1[0] + b2*this.controllP2[0] + b3*this.controllP3[0];
                y = b0*this.controllP0[1] + b1*this.controllP1[1] + b2*this.controllP2[1] + b3*this.controllP3[1];
                
                p[i] = [x, y];
            }
                 
                // draw actual line
                context.beginPath();

                context.moveTo(p[0][0], p[0][1]);
                
                // i=1, weil erster punkt schon bei moveTo abgearbeitet
                for (var i = 1; i < p.length; i++) {
                    context.lineTo(p[i][0], p[i][1]);
                }

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke();

            };

            // test whether the mouse position is on this parametic curve segment
            this.isHit = function(context, pos) {
                
                for(var i = 0; i < (p.length - 1); i++){
                    
                    // project point on line, get parameter of that projection point
                    var tr = vec2.projectPointOnLine(pos, p[i], p[i+1]);

                    // outside the line segment?
                    if(tr<0.0 || tr>1.0) {
                        continue;
                    }
                    
                // coordinates of the projected point
                var a = vec2.add(p[i], vec2.mult( vec2.sub(p[i+1],p[i]), tr ));

                // distance of the point from the line
                var b = vec2.length(vec2.sub(a,pos));
                
                // print out hit or no hit
                console.log(b<=(this.lineStyle.width/2)+2);
                
                // allow 2 pixels extra "sensitivity"
                return b<=(this.lineStyle.width/2)+2;
                
                }
            };

            // return a empty list
            this.createDraggers = function() {
                
                var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true };
                var draggers = [];

                // create closure and callbacks for dragger
                var curve = this;
                var getP0 = function() { return curve.controllP0; };
                var getP1 = function() { return curve.controllP1; };
                var getP2 = function() { return curve.controllP2; };
                var getP3 = function() { return curve.controllP3; };
                
                var setP0 = function(dragEvent) { curve.controllP0 = dragEvent.position; };
                var setP1 = function(dragEvent) { curve.controllP1 = dragEvent.position; };
                var setP2 = function(dragEvent) { curve.controllP2 = dragEvent.position; };
                var setP3 = function(dragEvent) { curve.controllP3 = dragEvent.position; };
                
                draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
                draggers.push( new PointDragger(getP1, setP1, draggerStyle) );
                draggers.push( new PointDragger(getP2, setP2, draggerStyle) );
                draggers.push( new PointDragger(getP3, setP3, draggerStyle) );

                return draggers;

            };


        };

        // this module only exports the constructor for parametic curve objects
        return BezierCurve;

    })); // define

    
