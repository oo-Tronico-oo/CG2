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
define(["jquery", "Line", "Circle", "Point", "ParametricCurve", "BezierCurve", "Polygon", "KdTree", "util", "kdutil"],
    (function($, Line, Circle, Point, ParametricCurve, BezierCurve, Polygon, KdTree, Util, KdUtil) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context,scene,sceneController) {
            
            var kdTree;
            var pointList = [];

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
            };

            // generate random color in hex notation
            var randomColor = function() {

                // convert a byte (0...255) to a 2-digit hex string
                var toHex2 = function(byte) {
                    var s = byte.toString(16); // convert to hex string
                    if(s.length === 1) s = "0"+s; // pad with leading 0
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
                var lineStyle = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };
                
                $("#radiusBox").css({'display' : 'none'});
                $("#lineBox").css({'display' : 'none'});
                
                var line = new Line( [randomX(),randomY()],
                    [randomX(),randomY()],
                    lineStyle );
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));

            /*
             * event handler for "new point button".
             */
            $("#btnNewPoint").click( (function() {

                // create the actual point and add it to the scene
                var lineStyle = {
                    width: 2,
                    color: randomColor()
                };

                $("#radiusBox").css({'display' : 'none'});
                $("#lineBox").css({'display' : 'none'});
                
                var point = new Point( [randomX(),randomY()], 5,
                    lineStyle );
                scene.addObjects([point]);
                
                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));
            
            /*
             * event handler for "new parametric curve".
             */
            $("#btnNewParaCurve").click( (function(){
                
                var lineStyle = {
                    width: $("#lineField").val() || Math.floor(Math.random()*3)+1,
                    color: $("#colorField").val() || randomColor()
                };
                
                var xt = $("#xt").val();
                var yt = $("#yt").val();
                        
                var minT;
                var maxT;
                
                if (parseFloat($("#minT").val()) < parseFloat($("#maxT").val())){
                    minT = parseFloat($("#minT").val());
                    maxT = parseFloat($("#maxT").val());
                } else{
                    minT = parseFloat($("#maxT").val());
                    maxT = parseFloat($("#minT").val());
                }
                
                var segm = parseInt($("#segments").val());
                
                var curve = new ParametricCurve(xt, yt, minT, maxT, segm, lineStyle);
                scene.addObjects([curve]);
                
                sceneController.deselect();
            }));
            
            /*
             * event handler for "new bezier curve".
             */
            $("#btnNewBeziCurvet").click( (function(){
                
                var lineStyle = {
                    width: $("#lineField").val() || Math.floor(Math.random()*3)+1,
                    color: $("#colorField").val() || randomColor()
                };
                
                var point0 = [randomX(), randomY()];
                var point1 = [randomX(), randomY()];
                var point2 = [randomX(), randomY()];
                var point3 = [randomX(), randomY()];
                
                var segm = parseInt($("#segments").val());
                
                var curve = new BezierCurve(point0, point1, point2, point3, segm, lineStyle);
                
                scene.addObjects([curve]);
                
                sceneController.deselect();
            }));
            
            /*
             * event handler for "new circle button".
             */
            $("#btnNewCircle").click( (function() {

                // create the actual circle and add it to the scene
                var lineStyle = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };
                
                $("#radiusBox").css({'display' : 'none'});
                $("#lineBox").css({'display' : 'none'});
                
                var circle = new Circle( [randomX(),randomY()],
                    randomRadius(),
                    lineStyle );
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));
            
            /*
             * event handler for "new list of points".
             */
            $("#btnNewPointList").click( (function() {

                // create the actual line and add it to the scene
                var lineStyle = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var numPoints = parseInt($("#numPoints").attr("value"));;
                for(var i=0; i<numPoints; ++i) {
                    var point = new Point([randomX(), randomY()], 5,
                        lineStyle);
                    scene.addObjects([point]);
                    pointList.push(point);
                }

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));
            
            /*
             * event handler for change object.
             */
            $("#drawing_area").click( (function(){
                
                var selectedObj = sceneController.getSelectedObject();
                          
                if(selectedObj instanceof Line || selectedObj instanceof Point || selectedObj instanceof Circle){
                    $("#colorField").val(selectedObj.lineStyle.color);
                    $("#lineField").val(parseInt(selectedObj.lineStyle.width));
                    
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
                    selectedObj.lineStyle.color = $("#colorField").val();
                    sceneController.select(selectedObj);
                }
            }));
            
            /*
             * event handler for input linewidth.
             */
            $("#lineField").change( (function(){
                var selectedObj = sceneController.getSelectedObject();
                if(selectedObj instanceof Line || selectedObj instanceof Circle){
                    selectedObj.lineStyle.width = $("#lineField").val();
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
            
            /*
             * event handler for show the kdtree.
             */
            $("#visKdTree").click( (function() {

                var showTree = $("#visKdTree").attr("checked");
                if(showTree && kdTree) {
                    KdUtil.visualizeKdTree(sceneController, scene, kdTree.root, 0, 0, 600, true);
                }

            }));
            
            /*
             * event handler for create the kdtree.
             */
            $("#btnBuildKdTree").click( (function() {

                kdTree = new KdTree(pointList);

            }));

            /**
             * creates a random query point and
             * runs linear search and kd-nearest-neighbor search
             */
            $("#btnQueryKdTree").click( (function() {

                var lineStyle = {
                    width: 2,
                    color: "#ff0000"
                };
                var queryPoint = new Point([randomX(), randomY()], 2,
                    lineStyle);
                scene.addObjects([queryPoint]);
                sceneController.select(queryPoint); 

                console.log("query point: ", queryPoint.center);

                ////////////////////////////////////////////////
                // TODO: measure and compare timings of linear
                //       and kd-nearest-neighbor search
                ////////////////////////////////////////////////
                var linearTiming;
                var kdTiming;
                var startT;
                                
                startT = new Date().getTime();
                var minIdx = KdUtil.linearSearch(pointList, queryPoint);
                linearTiming = (new Date().getTime() - startT)/1000;
                
                console.log("nearest neighbor linear: ", pointList[minIdx].center, " Time: ", linearTiming, " sek");
                
                startT = new Date().getTime();
                var kdNearestNeighbor = kdTree.findNearestNeighbor(kdTree.root, queryPoint, 10000000, kdTree.root, 0);
                kdTiming = (new Date().getTime() - startT)/1000;
                
                console.log("nearest neighbor kd: ", kdNearestNeighbor.point.center, " Time: ", kdTiming, " sek");

                sceneController.select(pointList[minIdx]);
                sceneController.select(kdNearestNeighbor.point);

            }));

        };

        // return the constructor function
        return HtmlController;


    })); // require
    