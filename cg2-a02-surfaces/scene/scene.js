/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: scene
 *
 * A Scene is a depth-sorted collection of things to be drawn, 
 * plus a background fill style.
 *
 */



/* requireJS module definition */
define(["three", "util", "shaders", "BufferGeometry", "random", "band"],
        (function (THREE, util, shaders, BufferGeometry, Random, Band) {

            "use strict";

            /*
             * Scene constructor
             */
            var Scene = function (renderer, width, height) {

                // the scope of the object instance
                var scope = this;
                var tid, top, ths, the, bender;
                var music;

                scope.renderer = renderer;
                scope.t = 0.0;

                scope.camera = new THREE.PerspectiveCamera(66, width / height, 0.1, 2000);
                scope.camera.position.z = 1000;
                scope.scene = new THREE.Scene();

                // Add a listener for 'keydown' events. By this listener, all key events will be
                // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
                document.addEventListener("keydown", onDocumentKeyDown, false);


                function onDocumentKeyDown(event) {
                    // Get the key code of the pressed key
                    var keyCode = event.which;

                    if (keyCode === 38) {
                        console.log("cursor up");
                        scope.currentMesh.rotation.x += 0.05;
                        // Cursor down
                    } else if (keyCode === 40) {
                        console.log("cursor down");
                        scope.currentMesh.rotation.x += -0.05;
                        // Cursor left
                    } else if (keyCode === 37) {
                        console.log("cursor left");
                        scope.currentMesh.rotation.y += 0.05;
                        // Cursor right
                    } else if (keyCode === 39) {
                        console.log("cursor right");
                        scope.currentMesh.rotation.y += -0.05;
                        // Cursor up
                    } else if (keyCode === 49) {
                        var nodeHead = scope.scene.getObjectByName("neck", true);
                        if (nodeHead) {
                            console.log("turn neck");
                            nodeHead.rotateY(Math.PI / 8);
                        } // 1
                    } else if (keyCode === 50) {
                        var nodeHead = scope.scene.getObjectByName("leftShoulder", true);
                        if (nodeHead) {
                            console.log("turn left shoulder");
                            nodeHead.rotateX(-Math.PI / 8);
                        } // 2
                    } else if (keyCode === 51) {
                        var nodeHead = scope.scene.getObjectByName("rightShoulder", true);
                        if (nodeHead) {
                            console.log("turn right shoulder");
                            nodeHead.rotateX(-Math.PI / 8);
                        } // 3
                    } else if (keyCode === 52) {
                        var nodeHead = scope.scene.getObjectByName("elbowLeft", true);
                        if (nodeHead) {
                            console.log("turn left elbow");
                            nodeHead.rotateZ(Math.PI / 8);
                            nodeHead.rotateX(-Math.PI / 8);
                        } // 4
                    } else if (keyCode === 53) {
                        var nodeHead = scope.scene.getObjectByName("elbowRight", true);
                        if (nodeHead) {
                            console.log("turn right elbow");
                            nodeHead.rotateZ(-Math.PI / 8);
                            nodeHead.rotateX(-Math.PI / 8);
                        } // 5
                    } else if (keyCode === 54) {
                        var nodeHead = scope.scene.getObjectByName("leftHip", true);
                        if (nodeHead) {
                            console.log("turn left hip back");
                            nodeHead.rotateX(-Math.PI / 8);
                        } // 6
                    } else if (keyCode === 55) {
                        var nodeHead = scope.scene.getObjectByName("leftHip", true);
                        if (nodeHead) {
                            console.log("turn left hip back");
                            nodeHead.rotateX(Math.PI / 8);
                        } // 7
                    } else if (keyCode === 56) {
                        var nodeHead = scope.scene.getObjectByName("rightHip", true);
                        if (nodeHead) {
                            console.log("turn left hip back");
                            nodeHead.rotateX(-Math.PI / 8);
                        } // 8
                    } else if (keyCode === 57) {
                        var nodeHead = scope.scene.getObjectByName("rightHip", true);
                        if (nodeHead) {
                            console.log("turn left hip back");
                            nodeHead.rotateX(Math.PI / 8);
                        } // 9
                    } else if (keyCode === 81) {
                        var nodeHead = scope.scene.getObjectByName("leftLeg", true);
                        if (nodeHead) {
                            console.log("turn left leg");
                            nodeHead.rotateY(Math.PI / 8);
                        } // q
                    } else if (keyCode === 87) {
                        var nodeHead = scope.scene.getObjectByName("rightLeg", true);
                        if (nodeHead) {
                            console.log("turn right leg");
                            nodeHead.rotateY(-Math.PI / 8);
                        } // w
                    }


                }
                ;

                this.addBufferGeometry = function (bufferGeometry) {
                    scope.currentMesh = bufferGeometry.getMesh();
                    scope.scene.add(scope.currentMesh);

                };

                this.addMesh = function (object_mesh) {
                    scope.currentMesh = object_mesh;
                    scope.scene.add(scope.currentMesh);

                };

                this.clearScene = function () {
                    scope.scene = new THREE.Scene();
                    clearInterval(tid);
                };


                this.animate = function (state) {
                    var roboHead = scope.scene.getObjectByName("head", true);
                    var leftHip = scope.scene.getObjectByName("leftHip", true);
                    var rightHip = scope.scene.getObjectByName("rightHip", true);
                    var leftShoulder = scope.scene.getObjectByName("leftShoulder", true);
                    var rightShoulder = scope.scene.getObjectByName("rightShoulder", true);
                    var leftElbow = scope.scene.getObjectByName("elbowLeft", true);
                    var rightElbow = scope.scene.getObjectByName("elbowRight", true);
                    var rightHand = scope.scene.getObjectByName("handRight", true);

                    var rotation = Math.PI / 100;
                    var rotationHip = Math.PI / 20;
                    var rotationOn = Math.PI / 10;
                    

                    //matrixes for scaling
                    var matPlus = new THREE.Matrix4();
                    matPlus.set(1.5, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1.5, 0,
                            0, 0, 0, 1);
                    var matMinus = new THREE.Matrix4();
                    matMinus.set(2 / 3, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 2 / 3, 0,
                            0, 0, 0, 1);

                    //robot animation       
                    if (roboHead && state) {
                        music = new Audio('./media/robby.mp3');
                        music.play();
                        leftHip.rotateX(-Math.PI / 4);
                        rightHip.rotateX(Math.PI / 4);
                        tid = setInterval(function () {
                            roboHead.rotateY(rotation);
                        }, 10);
                        top = setInterval(function () {
                            rotation = rotation * -1;
                            if (rotation > 0)
                                roboHead.applyMatrix(matPlus);
                            else
                                roboHead.applyMatrix(matMinus);
                        }, 1000);

                        ths = setInterval(function () {
                            rotationHip = rotationHip * -1;
                        }, 1000);
                        the = setInterval(function () {
                            leftShoulder.rotateZ(rotationHip - rotation);
                            leftShoulder.rotateX(rotation);
                            rightElbow.rotateY(rotationHip - rotation);
                            rightElbow.rotateZ(rotation);
                            leftHip.rotateX(rotationHip);
                            rightHip.rotateX(-rotationHip);
                            rightHand.rotateZ(1);
                            rightHand.rotateY(1.5);
                            rightHand.translateX(rotationHip * 80);
                            leftElbow.rotateX(-rotationOn);
                            rightShoulder.rotateX(rotationOn);
                        }, 100);

                    } else if (scope.scene.getObjectByName("bender", true) && state) {
                        var ellenbogen1 = scope.scene.getObjectByName("ellenbogen1", true),
                                ellenbogen2 = scope.scene.getObjectByName("ellenbogen2", true),
                                ellenbogen3 = scope.scene.getObjectByName("ellenbogen3", true),
                                ellenbogen4 = scope.scene.getObjectByName("ellenbogen4", true),
                                ellenbogen5 = scope.scene.getObjectByName("ellenbogen5", true),
                                schulter = scope.scene.getObjectByName("schulter", true);
                        
                        var i = 0;
                        var firstAni = true;
                        bender = setInterval(function(){
                        schulter.rotateZ(-0.1);
                        if (firstAni){
                            ellenbogen1.rotateZ(-0.01);
                            ellenbogen2.rotateZ(-0.01);
                            ellenbogen3.rotateZ(-0.01);
                            ellenbogen4.rotateZ(-0.01);
                            ellenbogen5.rotateZ(-0.01);
                            i++;
                            if(i === 5){
                                firstAni = false;
                                i = 0;
                            }
                        }else if (i < 10) {
                            ellenbogen1.rotateZ(0.01);
                            ellenbogen2.rotateZ(0.01);
                            ellenbogen3.rotateZ(0.01);
                            ellenbogen4.rotateZ(0.01);
                            ellenbogen5.rotateZ(0.01);
                            i++;
                        } else {
                            ellenbogen1.rotateZ(-0.01);
                            ellenbogen2.rotateZ(-0.01);
                            ellenbogen3.rotateZ(-0.01);
                            ellenbogen4.rotateZ(-0.01);
                            ellenbogen5.rotateZ(-0.01);
                            i++;
                            if(i===20)i=0;
                        }
                    }, 50);

                    } else {
                        //surface animation
                        if (scope.currentMesh !== undefined) {
                            if (state) {
                                tid = setInterval(function () {
                                    scope.currentMesh.rotation.y += 0.0025;
                                    scope.currentMesh.rotation.x += 0.0020;
                                    scope.currentMesh.rotation.z += 0.0030;
                                }, 10);
                            } else {
                                clearInterval(tid);
                                if (roboHead) {
                                    clearInterval(top);
                                    clearInterval(ths);
                                    clearInterval(the);
                                    music.pause();
                                    music.currentTime = 0;
                                }
                                if(scope.scene.getObjectByName("bender", true)){
                                    clearInterval(bender);
                                }
                            }
                        }
                    }
                };


                /*
                 * drawing the scene
                 */
                this.draw = function () {

                    requestAnimFrame(scope.draw);

                    scope.renderer.render(scope.scene, scope.camera);

                };
            };


            // this module only exports the constructor for Scene objects
            return Scene;

        })); // define


