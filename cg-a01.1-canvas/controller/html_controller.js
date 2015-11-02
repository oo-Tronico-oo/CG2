/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "SceneController", "Line", "Point", "Circle"],
    (function($, SceneController, Line, Point, Circle) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context,scene,sceneController) {


            // generate random X coordinate within the canvas
            var randomX = function() {
                return Math.floor(Math.random()*(context.canvas.width-10))+5;
            };

            // generate random Y coordinate within the canvas
            var randomY = function() {
                return Math.floor(Math.random()*(context.canvas.height-10))+5;
            };
            
            //generate a random radius within the canvas
            var randomRadius = function() {
                return parseInt(Math.random()*100+15);
            }

            // generate random color in hex notation
            var randomColor = function() {

                // convert a byte (0...255) to a 2-digit hex string
                var toHex2 = function(byte) {
                    var s = byte.toString(16); // convert to hex string
                    if(s.length == 1) s = "0"+s; // pad with leading 0
                    return s;
                };

                var r = Math.floor(Math.random()*25.9)*10;
                var g = Math.floor(Math.random()*25.9)*10;
                var b = Math.floor(Math.random()*25.9)*10;

                // convert to hex notation
                return "#"+toHex2(r)+toHex2(g)+toHex2(b);
            };

            /*
             * event handler for "new line button".
             */
            $("#btnNewLine").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };
                
                $("#radiusBox").css({'display' : 'none'});
                $("#lineBox").css({'display' : 'none'});
                
                var line = new Line( [randomX(),randomY()],
                    [randomX(),randomY()],
                    style );
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));

            /*
             * event handler for "new point button".
             */
            $("#btnNewPoint").click( (function() {

                // create the actual point and add it to the scene
                var style = {
                    width: 2,
                    color: randomColor()
                };

                $("#radiusBox").css({'display' : 'none'});
                $("#lineBox").css({'display' : 'none'});
                
                var point = new Point( [randomX(),randomY()],
                    style );
                scene.addObjects([point]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));
            
            /*
             * event handler for "new circle button".
             */
            $("#btnNewCircle").click( (function() {

                // create the actual circle and add it to the scene
                var style = {
                    width: 2,
                    color: randomColor()
                };
                
                $("#radiusBox").css({'display' : 'none'});
                $("#lineBox").css({'display' : 'none'});
                
                var circle = new Circle( [randomX(),randomY()],
                    randomRadius(),
                    style );
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));
            
            /*
             * event handler for change object.
             */
            $("#drawing_area").click( (function(){
                
                var selectedObj = sceneController.getSelectedObject();
                          
                if(selectedObj instanceof Line || selectedObj instanceof Point || selectedObj instanceof Circle){
                    $("#colorField").val(selectedObj.style.color);
                    $("#lineField").val(parseInt(selectedObj.style.width));
                    
                    if(selectedObj instanceof Circle){
                        $("#radiusBox").css({'display' : 'block'});
                        $("#lineBox").css({'display' : 'block'});
                        $("#radiusField").val(parseInt(selectedObj.radius));
                    }
                    
                    if(selectedObj instanceof Point){
                        $("#lineBox").css({'display' : 'none'});
                        $("#radiusBox").css({'display' : 'none'});
                    }
                    
                    if(selectedObj instanceof Line){
                        $("#radiusBox").css({'display' : 'none'});
                        $("#lineBox").css({'display' : 'block'});
                    }
                }
                
            }));
            
            /*
             * event handler for input color.
             */
            $("#colorField").change( (function(){
                var selectedObj = sceneController.getSelectedObject();
                if(selectedObj instanceof Line || selectedObj instanceof Point || selectedObj instanceof Circle){
                    selectedObj.style.color = $("#colorField").val();
                    sceneController.select(selectedObj);
                }
            }));
            
            /*
             * event handler for input linewidth.
             */
            $("#lineField").change( (function(){
                var selectedObj = sceneController.getSelectedObject();
                if(selectedObj instanceof Line || selectedObj instanceof Circle){
                    selectedObj.style.width = $("#lineField").val();
                    sceneController.select(selectedObj);
                }
            }));
            
            /*
             * event handler for input radius.
             */
            $("#radiusField").change( (function(){
                var selectedObj = sceneController.getSelectedObject();
                if(selectedObj instanceof Circle){
                    selectedObj.radius = $("#radiusField").val();
                    sceneController.select(selectedObj);
                }
            }));

        };

        // return the constructor function
        return HtmlController;


    })); // require
    