define(["three", "head", "leg", "arm", "eyeArea"],
        (function (THREE, Head, Leg, Arm, EyeArea) {

            "use strict";
            var Bender = function (skalierung) {

                var obj3D = function () {
                    return new THREE.Object3D();
                };
                
                //[bottomRadius, topRadius, hoehe]
                var bodySize = [1.5 * skalierung, 2 * skalierung, 4 * skalierung],
                        neckSize = [2 * skalierung, skalierung, 0.8 * skalierung];
                
                //skeleton
                var headObj = new Head(neckSize[1]),
                        eyeAreaObj = new EyeArea(headObj.headSize[0] * 0.6),
                        armRightObj = new Arm(skalierung * 0.4),
                        armLeftObj = new Arm(skalierung * 0.4),
                        beinRightObj = new Leg(skalierung * 0.4),
                        beinLeftObj = new Leg(skalierung * 0.4);
                
                var root = obj3D(),
                        torso = obj3D(),
                        door = obj3D(),
                        door2 = obj3D(),
                        doorknob = obj3D(),
                        neck = obj3D(),
                        head = headObj.getMesh(),
                        eyeArea = eyeAreaObj.getMesh(),
                        mouth = obj3D(),
                        armRight = armRightObj.getMesh(),
                        armLeft = armLeftObj.getMesh(),
                        beinRight = beinRightObj.getMesh(),
                        beinLeft = beinLeftObj.getMesh();
                
                //name einbinden
                
                armRightObj.ellenbogen1.name = "ellenbogen1";
                armRightObj.ellenbogen2.name = "ellenbogen2";
                armRightObj.ellenbogen3.name = "ellenbogen3";
                armRightObj.ellenbogen4.name = "ellenbogen4";
                armRightObj.ellenbogen5.name = "ellenbogen5";
                
                armLeftObj.schulter.name = "schulter";
                
                //transform
                root.name = "bender";
                
                door.translateZ(bodySize[0]*0.3);
                door.scale.set(0.9,0.8,0.8);
                
                door2.translateZ(bodySize[0]*0.05);
                door2.scale.set(0.95,0.95,1);
                
                doorknob.translateZ(bodySize[0]*1.1);
                doorknob.translateX(bodySize[0]*0.5);
                
                neck.translateY(bodySize[2] / 2 + neckSize[2] / 2);
                head.translateY(neckSize[2] / 2 + headObj.headSize[1] / 2);
                
                eyeArea.translateZ(headObj.headSize[0] / 1.5);
                eyeArea.translateY(headObj.headSize[1] / 4);
                
                mouth.translateZ(headObj.headSize[0] * 0.05);
                mouth.translateY(headObj.headSize[1] / -5);
                
                armRight.translateX((bodySize[1] - bodySize[0]) / 1.3 + bodySize[0]);
                armRight.translateY(bodySize[2] * 0.3);
                
                armLeft.translateX(-((bodySize[1] - bodySize[0]) / 1.3 + bodySize[0]));
                armLeft.translateY(bodySize[2] * 0.3);
                armLeft.rotateY(Math.PI);
                armLeftObj.hand.rotateY(Math.PI);
                
                beinRight.translateY(-bodySize[2] / 2.2);
                beinRight.translateX(bodySize[0] * 0.7);
                beinLeft.translateY(-bodySize[2] / 2.2);
                beinLeft.translateX(-bodySize[0] * 0.7);
                
                
                //hierarchy
                root.add(torso);
                torso.add(neck);
                torso.add(door);
                torso.add(armRight);
                torso.add(armLeft);
                torso.add(beinRight);
                torso.add(beinLeft);
                door.add(door2);
                door2.add(doorknob);
                neck.add(head);
                head.add(eyeArea);
                head.add(mouth);
                
                //skin
                var normalMat = new THREE.MeshNormalMaterial();
                normalMat.side = THREE.DoubleSide;
                
                var basicMat = new THREE.MeshBasicMaterial({color: 0x000000});
                basicMat.side = THREE.DoubleSide;
                
                var texture = new THREE.TextureLoader().load("models/bender/zaehne.jpg", function (texture) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(3, 2);
                    var material = new THREE.MeshBasicMaterial({
                        map: texture
                    });
                });
                
                var mouthMat = new THREE.MeshBasicMaterial({map: texture});
                mouthMat.side = THREE.DoubleSide;
                
                var torsoSkin = new THREE.Mesh(new THREE.CylinderGeometry(bodySize[1], bodySize[0], bodySize[2], 25, 1), normalMat);
                var doorSkin = new THREE.Mesh(new THREE.CylinderGeometry(bodySize[1], bodySize[0], bodySize[2], 25, 1, true, -Math.PI / 4, Math.PI / 2), basicMat);
                var door2Skin = new THREE.Mesh(new THREE.CylinderGeometry(bodySize[1], bodySize[0], bodySize[2], 25, 1, true, -Math.PI / 4, Math.PI / 2), normalMat);
                var doorknobSkin = new THREE.Mesh(new THREE.BoxGeometry(skalierung * 0.3, skalierung * 0.3, skalierung * 0.2), basicMat);
                var neckSkin = new THREE.Mesh(new THREE.CylinderGeometry(neckSize[1], neckSize[0], neckSize[2], 25, 1), normalMat);
                var mouthSkin = new THREE.Mesh(new THREE.CylinderGeometry(headObj.headSize[0], headObj.headSize[0], headObj.headSize[0] / 1.5, 25, 1, true, -Math.PI / 4, Math.PI / 2), mouthMat);
                
                //fusion of skins and skeleton
                torso.add(torsoSkin);
                door.add(doorSkin);
                door2.add(door2Skin);
                doorknob.add(doorknobSkin);
                neck.add(neckSkin);
                mouth.add(mouthSkin);
                
                this.getMesh = function () {
                    //var e = new Leg(200);
                    //return e.gliedMesh();
                    return root;
                };
            };
            return Bender;
        }));