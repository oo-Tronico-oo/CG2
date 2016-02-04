define(["three", "parametric", "BufferGeometry"],
        (function (THREE, ParametricSurface, BufferGeometry) {

            "use strict";

            var Robot = function (posFunc, config) {

                var headSize = [150, 125, 125];
                var neckSize = [50, 50, 50];
                var torsoSize = [300, 300, 200];
                var upperArmSize = [75 / 2, 75 / 2, 100];
                var lowerArmSize = [50, 50, 175];
                var legSize = [45, 45, 220];
                var footSize = [100, 50, 150];

                //eigene paraSurf ---------------------------------------------------------

                var paramFunction = function (u, v) {
                    var cubeConst = Math.pow(Math.pow(Math.sin(u), 6) * (Math.pow(Math.sin(v), 6) + Math.pow(Math.cos(v), 6)) + Math.pow(Math.cos(u), 6), 1 / 6);
                    var pos3D = [
                        ((torsoSize[0] * 0.5) * Math.sin(u) * Math.cos(v)) / Math.pow(Math.pow(Math.sin(u), 6) * (Math.pow(Math.sin(v), 6) + Math.pow(Math.cos(v), 6)) + Math.pow(Math.cos(u), 6), 1 / 6),
                        ((torsoSize[1] * 0.5) * Math.sin(u) * Math.sin(v)) / cubeConst,
                        ((torsoSize[2] * 0.5) * Math.cos(u)) / cubeConst
                    ];
                    return pos3D;
                };

                var configuration = {
                    segmentsU: 25,
                    segmentsV: 25,
                    uMin: -Math.PI,
                    uMax: Math.PI,
                    vMin: -0.5 * Math.PI,
                    vMax: 0.5 * Math.PI
                };

                var paramSurface = new ParametricSurface(paramFunction, configuration);
                var bufferGeometryParametric = new BufferGeometry();

                bufferGeometryParametric.addAttribute("position", paramSurface.getPositions());
                bufferGeometryParametric.addAttribute("color", paramSurface.getColors());
                bufferGeometryParametric.setIndex(paramSurface.getIndices());
                bufferGeometryParametric.setWireframe(true);

                //--------------------------------------------------------------------------
                this.root = new THREE.Object3D();

                //skeleton
                this.head = new THREE.Object3D();
                this.head.name = "head";
                this.head.translateY(neckSize[2] / 2 + headSize[1] / 2);

                this.neck = new THREE.Object3D();
                this.neck.name = "neck";
                this.neck.translateY(torsoSize[1] / 2 + neckSize[2] / 2);

                this.torso = new THREE.Object3D();
                this.torso.name = "torso";

                this.leftShoulder = new THREE.Object3D();
                this.leftShoulder.name = "leftShoulder";
                this.leftShoulder.translateX(torsoSize[0] / 2).translateY(torsoSize[1] / 2 - upperArmSize[0]);

                this.rightShoulder = this.leftShoulder.clone();
                this.rightShoulder.name = "rightShoulder";
                this.rightShoulder.translateX(-torsoSize[0]);

                this.upperArmLeft = new THREE.Object3D();
                this.upperArmLeft.name = "upperArmLeft";
                this.upperArmLeft.translateX(upperArmSize[2] / 2);

                this.upperArmRight = this.upperArmLeft.clone().translateX(-upperArmSize[2]);
                this.upperArmRight.name = "upperArmRight";

                this.elbowLeft = new THREE.Object3D();
                this.elbowLeft.name = "elbowLeft";
                this.elbowLeft.translateX(upperArmSize[2] / 2 + lowerArmSize[0] / 2);

                this.elbowRight = this.elbowLeft.clone().translateX(-upperArmSize[2] - lowerArmSize[0]);
                this.elbowRight.name = "elbowRight";

                this.lowerArmLeft = new THREE.Object3D();
                this.lowerArmLeft.name = "lowerArmLeft";
                this.lowerArmLeft.translateY(-lowerArmSize[2] / 2);

                this.lowerArmRight = this.lowerArmLeft.clone();
                this.lowerArmRight.name = "lowerArmRight";

                this.handLeft = new THREE.Object3D();
                this.handLeft.name = "handLeft";
                this.handLeft.translateY(-lowerArmSize[2] / 2);

                this.handRight = this.handLeft.clone();
                this.handRight.name = "handRight";

                this.leftHip = new THREE.Object3D();
                this.leftHip.name = "leftHip";
                this.leftHip.translateX(torsoSize[0] / 4);
                this.leftHip.translateY(-torsoSize[1] / 2);

                this.rightHip = this.leftHip.clone();
                this.rightHip.name = "rightHip";
                this.rightHip.translateX(-torsoSize[0] / 2)


                this.leftLeg = new THREE.Object3D();
                this.leftLeg.name = "leftLeg";
                this.leftLeg.translateY(-legSize [2] / 2);

                this.rightLeg = this.leftLeg.clone();
                this.rightLeg.name = "rightLeg";

                this.leftFoot = new THREE.Object3D();
                this.leftFoot.name = "leftFoot";
                this.leftFoot.translateY(-legSize[2] / 2 - footSize[1] / 2);
                this.leftFoot.translateZ(legSize[0] / 2);

                this.rightFoot = this.leftFoot.clone();
                this.rightFoot.name = "rightFoot";


                //hierarchy
                this.lowerArmLeft.add(this.handLeft);
                this.lowerArmRight.add(this.handRight);
                this.elbowLeft.add(this.lowerArmLeft);
                this.elbowRight.add(this.lowerArmRight);
                this.upperArmLeft.add(this.elbowLeft);
                this.upperArmRight.add(this.elbowRight);
                this.leftShoulder.add(this.upperArmLeft);
                this.rightShoulder.add(this.upperArmRight);
                this.torso.add(this.leftShoulder);
                this.torso.add(this.rightShoulder);


                this.leftLeg.add(this.leftFoot);
                this.rightLeg.add(this.rightFoot);
                this.leftHip.add(this.leftLeg);
                this.rightHip.add(this.rightLeg);
                this.torso.add(this.leftHip);
                this.torso.add(this.rightHip);


                this.neck.add(this.head);
                this.torso.add(this.neck);



                //skin
                this.headSkin = new THREE.Mesh(new THREE.CubeGeometry(headSize[0], headSize[1],
                        headSize[2]), new THREE.MeshNormalMaterial());

                this.neckSkin = new THREE.Mesh(new THREE.CylinderGeometry(neckSize[0], neckSize[1],
                        neckSize[2]), new THREE.MeshNormalMaterial());

                //this.torsoSkin = new THREE.Mesh(new THREE.CubeGeometry(torsoSize[0], torsoSize[1],
                //        torsoSize[2]), new THREE.MeshNormalMaterial());
                this.torsoSkin = bufferGeometryParametric.getMesh();
                
                
                this.upperArmSkin = new THREE.Mesh(new THREE.CylinderGeometry(upperArmSize[0], upperArmSize[1],
                        upperArmSize[2]), new THREE.MeshNormalMaterial());
                this.upperArmSkin.rotateZ(Math.PI / 2);

                this.lowerArmSkin = new THREE.Mesh(new THREE.CubeGeometry(lowerArmSize[0], lowerArmSize[2],
                        lowerArmSize[1]), new THREE.MeshNormalMaterial());

                this.elbowSkin = new THREE.Mesh(new THREE.SphereGeometry(lowerArmSize[0] + 5), new THREE.MeshNormalMaterial());

                this.handSkin = new THREE.Mesh(new THREE.SphereGeometry(lowerArmSize[0], 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshNormalMaterial());
                this.handSkin.rotateX(Math.PI);
                this.handSkinTop = new THREE.Mesh(new THREE.CircleGeometry(lowerArmSize[0]), new THREE.MeshNormalMaterial());
                this.handSkinTop.rotateX(Math.PI * 1.5);

                this.hipSkin = new THREE.Mesh(new THREE.SphereGeometry(legSize[0] + 10), new THREE.MeshNormalMaterial());

                this.legSkin = new THREE.Mesh(new THREE.CylinderGeometry(legSize[0], legSize[1],
                        legSize[2]), new THREE.MeshNormalMaterial());

                this.footSkin = new THREE.Mesh(new THREE.CubeGeometry(footSize[0], footSize[1],
                        footSize[2]), new THREE.MeshNormalMaterial());

                //fusion of skins and skeleton
                this.head.add(this.headSkin);
                this.neck.add(this.neckSkin);
                this.torso.add(this.torsoSkin);
                this.upperArmLeft.add(this.upperArmSkin);
                this.upperArmRight.add(this.upperArmSkin.clone());
                this.elbowLeft.add(this.elbowSkin);
                this.elbowRight.add(this.elbowSkin.clone());
                this.lowerArmLeft.add(this.lowerArmSkin);
                this.lowerArmRight.add(this.lowerArmSkin.clone());
                this.handLeft.add(this.handSkin);
                this.handLeft.add(this.handSkinTop);
                this.handRight.add(this.handSkin.clone());
                this.handRight.add(this.handSkinTop.clone());
                this.leftLeg.add(this.legSkin);
                this.rightLeg.add(this.legSkin.clone());
                this.leftFoot.add(this.footSkin);
                this.rightFoot.add(this.footSkin.clone());
                this.leftHip.add(this.hipSkin);
                this.rightHip.add(this.hipSkin.clone());
                this.leftShoulder.add(this.elbowSkin.clone());
                this.rightShoulder.add(this.elbowSkin.clone());


                this.root.add(this.torso);

                this.getMesh = function () {
                    return this.root;
                };
            };
            return Robot;
        }));