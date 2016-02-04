define(["three"],
        (function (THREE) {

            "use strict";

            var EyeArea = function (skalierung) {

                var obj3D = function () {
                    return new THREE.Object3D();
                };

                //[weite, hoehe, tiefe]
                var blackBoxSize = [2 * skalierung, 1 * skalierung, 2 * skalierung],
                        borderPlaneSize = [blackBoxSize[0], blackBoxSize[2] * 1.1],
                //[radius]        
                        halfCircleSize = [blackBoxSize[1] / 2],
                //[radius, hoehe]
                        halfCylinderSize = [halfCircleSize[0] + blackBoxSize[1] * 0.1, borderPlaneSize[1]],
                        cylinderSize = [blackBoxSize[1] * 0.1 / 2, borderPlaneSize[0]],
                //[radius, tube]
                        halfTorusSize = [halfCylinderSize[0] - blackBoxSize[1] * 0.1 / 2, blackBoxSize[1] * 0.1 / 2]
                ;


                //skeleton
                var root = obj3D(),
                        blackBox = obj3D(),
                        halfCircleRight = obj3D(),
                        halfCircleLeft = obj3D(),
                        borderPlaneBottom = obj3D(),
                        borderPlaneTop = obj3D(),
                        halfCylinderRight = obj3D(),
                        halfCylinderLeft = obj3D(),
                        halfTorusRight = obj3D(),
                        halfTorusLeft = obj3D(),
                        cylinderTop = obj3D(),
                        cylinderBottom = obj3D(),
                        eyeLeft = obj3D(),
                        eyeLidLeft = obj3D(),
                        eyeRight = obj3D(),
                        eyeLidRight = obj3D(),
                        lensLeft = obj3D(),
                        lensRight = obj3D()
                        ;
                        

                borderPlaneBottom.translateY(blackBoxSize[1] / -2 - blackBoxSize[1] * 0.1);
                borderPlaneBottom.translateZ((borderPlaneSize[1] - blackBoxSize[2])/2);
                borderPlaneBottom.rotateX(Math.PI / 2);
                
                borderPlaneTop.translateZ(-blackBoxSize[1] - blackBoxSize[1] * 0.2);
                borderPlaneTop.rotateX(Math.PI);
                
                halfCircleRight.translateX(blackBoxSize[0] / 2);
                halfCircleRight.translateZ(blackBoxSize[2] / 2);
                
                halfCircleLeft.translateX(blackBoxSize[0] / -2);
                halfCircleLeft.translateZ(blackBoxSize[2] / 2);
                
                halfCylinderRight.translateX(blackBoxSize[0] / 2);
                halfCylinderRight.translateZ(-halfCylinderSize[0]);
                
                halfCylinderLeft.translateX(blackBoxSize[0] / -2);
                halfCylinderLeft.translateZ(-halfCylinderSize[0]);
                
                halfTorusRight.translateY(halfCylinderSize[1] / 2);
                halfTorusRight.rotateY(Math.PI / 2);
                halfTorusRight.rotateX(Math.PI / 2);
                
                halfTorusLeft.translateY(halfCylinderSize[1] / 2);
                halfTorusLeft.rotateY(Math.PI / -2);
                halfTorusLeft.rotateX(Math.PI / 2);
                
                cylinderTop.rotateZ(Math.PI / 2);
                cylinderTop.translateX(halfCylinderSize[1] / -2);
                cylinderTop.translateZ(-cylinderSize[0]);
                
                cylinderBottom.rotateZ(Math.PI / 2);
                cylinderBottom.translateX(halfCylinderSize[1] / 2);
                cylinderBottom.translateZ(-cylinderSize[0]);
                
                eyeLeft.translateX(blackBoxSize[0] / -4);
                eyeLeft.translateZ(blackBoxSize[2] / 2);
                eyeLeft.scale.set(1,1,0.5);
                
                eyeRight.translateX(blackBoxSize[0] / 4);
                eyeRight.translateZ(blackBoxSize[2] / 2);
                eyeRight.scale.set(1,1,0.5);
                
                eyeLidRight.rotateZ(0.3);
                eyeLidLeft.rotateZ(-0.3);
                
                lensLeft.translateZ(halfCircleSize[0]);
                lensLeft.translateY(-halfCircleSize[0] * 0.3);
                lensRight.translateZ(halfCircleSize[0]);
                lensRight.translateY(-halfCircleSize[0] * 0.3);
                
                
                //hierarchy
                root.add(blackBox);
                blackBox.add(borderPlaneBottom);
                blackBox.add(halfCircleRight);
                blackBox.add(halfCircleLeft);
                blackBox.add(eyeLeft);
                eyeLeft.add(eyeLidLeft);
                eyeLeft.add(lensLeft);
                blackBox.add(eyeRight);
                eyeRight.add(eyeLidRight);
                eyeRight.add(lensRight);
                borderPlaneBottom.add(borderPlaneTop);
                borderPlaneBottom.add(halfCylinderRight);
                borderPlaneBottom.add(halfCylinderLeft);
                borderPlaneBottom.add(cylinderBottom);
                borderPlaneTop.add(cylinderTop);
                halfCylinderRight.add(halfTorusRight);
                halfCylinderLeft.add(halfTorusLeft);
                

                //skin
                var normalMat = new THREE.MeshNormalMaterial();
                normalMat.side = THREE.DoubleSide;
                var basicMat = new THREE.MeshBasicMaterial({color: 0x000000});
                basicMat.side = THREE.DoubleSide;
                var basicMat2 = new THREE.MeshBasicMaterial({color: 0xffffff});

                var blackBoxSkin = new THREE.Mesh(new THREE.BoxGeometry(blackBoxSize[0], blackBoxSize[1], blackBoxSize[2]), basicMat);
                var borderPlaneSkin = new THREE.Mesh(new THREE.PlaneGeometry(borderPlaneSize[0], borderPlaneSize[1]), normalMat);
                var halfCircleLeftSkin = new THREE.Mesh(new THREE.CircleGeometry( halfCircleSize[0], 25, Math.PI / 2, Math.PI), basicMat);
                var halfCircleRightSkin = new THREE.Mesh(new THREE.CircleGeometry( halfCircleSize[0], 25, Math.PI * 1.5, Math.PI), basicMat);
                var halfCylinderRightSkin = new THREE.Mesh(new THREE.CylinderGeometry(halfCylinderSize[0], halfCylinderSize[0], halfCylinderSize[1], 25, 1, true, Math.PI * 2, Math.PI), normalMat);
                var halfCylinderLeftSkin = new THREE.Mesh(new THREE.CylinderGeometry(halfCylinderSize[0], halfCylinderSize[0], halfCylinderSize[1], 25, 1, true, Math.PI , Math.PI), normalMat);
                var halfTorusSkin = new THREE.Mesh(new THREE.TorusGeometry(halfTorusSize[0], halfTorusSize[1], 6, 50, Math.PI), normalMat);
                var cylinderSkin = new THREE.Mesh(new THREE.CylinderGeometry(cylinderSize[0], cylinderSize[0], cylinderSize[1], 6), normalMat);
                var eyeSkin = new THREE.Mesh(new THREE.SphereGeometry(halfCircleSize[0], 20, 20), basicMat2);
                var eyeLidRightSkin = new THREE.Mesh(new THREE.SphereGeometry(halfCircleSize[0] * 1.1, 20, 20, 0, Math.PI * 2, 0, 1.3), basicMat);
                var eyeLidLeftSkin = new THREE.Mesh(new THREE.SphereGeometry(halfCircleSize[0] * 1.1, 20, 20, 0, Math.PI * 2, 0, 1.3), basicMat);
                var lensSkin = new THREE.Mesh(new THREE.BoxGeometry(halfCircleSize[0] * 0.3, halfCircleSize[0] * 0.3, halfCircleSize[0] * 0.2), basicMat);


                //fusion of skins and skeleton
                blackBox.add(blackBoxSkin);
                borderPlaneBottom.add(borderPlaneSkin);
                borderPlaneTop.add(borderPlaneSkin.clone());
                halfCircleRight.add(halfCircleRightSkin);
                halfCircleLeft.add(halfCircleLeftSkin);
                halfCylinderRight.add(halfCylinderRightSkin);
                halfCylinderLeft.add(halfCylinderLeftSkin);
                halfTorusRight.add(halfTorusSkin);
                halfTorusLeft.add(halfTorusSkin.clone());
                cylinderBottom.add(cylinderSkin);
                cylinderTop.add(cylinderSkin.clone());
                eyeLeft.add(eyeSkin);
                eyeRight.add(eyeSkin.clone());
                eyeLidLeft.add(eyeLidLeftSkin);
                eyeLidRight.add(eyeLidRightSkin);
                lensLeft.add(lensSkin);
                lensRight.add(lensSkin.clone());
                

                this.getMesh = function () {
                    return root;
                };
            };
            return EyeArea;
        }));