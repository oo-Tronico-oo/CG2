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
define(["vec2"],
    (function(vec2) {

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

        var ParametricCurve = function(xt, yt, minT, maxT, segm, lineStyle) {

            console.log("creating parametic curve with x-formula " +
            xt + " & y-formula " + yt );

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
            
            var p = [];
            
            try{
                for(var i = 0; i <= segm; i++){
                    var t = minT + (maxT - minT) / segm * i;
                    p[i] = [eval(xt), eval(yt)];
                }
            } catch(e){
                alert(e);
                return;
            }
            console.log(p);
            // draw this parametic curve into the provided 2D rendering context
            this.draw = function(context) {
                
                 
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
                
                for(i = 0; i < (p.length - 1); i++){
                    
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
                
                var emptyList = [];
                
                return emptyList;

            };


        };

        // this module only exports the constructor for parametic curve objects
        return ParametricCurve;

    })); // define

    
