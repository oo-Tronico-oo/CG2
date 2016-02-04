define(["three"],
        (function (THREE) {

            "use strict";

            var Arm = function (skalierung) {

                var obj3D = function () {
                    return new THREE.Object3D();
                };


                //[radius, tube]
                var schulterSize = [skalierung, skalierung * 0.4],
                        //[radius, hoehe]
                        armGliedSize = [schulterSize[0], schulterSize[1] * 2]
                        ;

                //erstellung eines Cylinders fuer den Arm
                var getArmGlied = function (root) {
                    var temp = obj3D();
                    temp.translateY(armGliedSize[1] * -1.1);
                    var tempSkin = new THREE.Mesh(new THREE.CylinderGeometry(armGliedSize[0], armGliedSize[0], armGliedSize[1], 20), new THREE.MeshNormalMaterial());
                    temp.add(tempSkin);
                    root.add(temp);

                    return temp;
                };

                //erstellen eines oberarm/unterarm
                var getArmTeil = function (root, elemente) {
                    var neuerRoot = getArmGlied(root);
                    for (var i = 0; i < elemente - 1; i++) {
                        neuerRoot = getArmGlied(neuerRoot);
                    }
                    return neuerRoot;
                };


                //skeleton
                this.root = obj3D();
                this.schulter = obj3D();
                this.firstArmGliedOberarm = obj3D();
                this.lastArmGliedOberarm = getArmTeil(this.firstArmGliedOberarm, 2);
                this.ellenbogen1 = getArmGlied(this.lastArmGliedOberarm);
                this.ellenbogen2 = getArmGlied(this.ellenbogen1);
                this.ellenbogen3 = getArmGlied(this.ellenbogen2);
                this.ellenbogen4 = getArmGlied(this.ellenbogen3);
                this.ellenbogen5 = getArmGlied(this.ellenbogen4);
                this.lastArmGliedUnterarm = getArmTeil(this.ellenbogen5, 4);
                this.hand = obj3D();
                this.finger1 = obj3D();
                this.finger2 = obj3D();
                this.finger3 = obj3D();


                //transform
                this.schulter.rotateY(Math.PI / 2);
                this.schulter.scale.set(1, 1, 0.7);
                
                this.firstArmGliedOberarm.scale.set(1, 1.4, 1);
                this.firstArmGliedOberarm.rotateZ(Math.PI / 2);
                this.firstArmGliedOberarm.rotateX(Math.PI / -2);
                this.firstArmGliedOberarm.translateY(-schulterSize[1] * 2);

                this.ellenbogen1.rotateZ(Math.PI / 10);
                this.ellenbogen1.translateX(armGliedSize[0] * 0.2);
                this.ellenbogen2.rotateZ(Math.PI / 10);
                this.ellenbogen2.translateX(armGliedSize[0] * 0.2);
                this.ellenbogen3.rotateZ(Math.PI / 10);
                this.ellenbogen3.translateX(armGliedSize[0] * 0.2);
                this.ellenbogen4.rotateZ(Math.PI / 10);
                this.ellenbogen4.translateX(armGliedSize[0] * 0.2);
                this.ellenbogen5.rotateZ(Math.PI / 10);
                this.ellenbogen5.translateX(armGliedSize[0] * 0.2);
                
                this.hand.translateY(-armGliedSize[1] * 1.6);
                this.finger1.translateY(-armGliedSize[1] * 1.8);
                this.finger1.translateX(-armGliedSize[0]);
                this.finger1.scale.set(1,4,1);
                this.finger2.translateY(-armGliedSize[1] * 1.8);
                this.finger2.translateX(armGliedSize[0])
                this.finger2.scale.set(1,4,1);
                this.finger3.translateY(-armGliedSize[1] * 1.8);
                this.finger3.translateZ(-armGliedSize[0])
                this.finger3.scale.set(1,4,1);



                //hierarchy
                this.root.add(this.schulter);
                this.schulter.add(this.firstArmGliedOberarm);
                this.lastArmGliedUnterarm.add(this.hand);
                this.hand.add(this.finger1);
                this.hand.add(this.finger2);
                this.hand.add(this.finger3);



                //skin
                var normalMat = new THREE.MeshNormalMaterial();
                normalMat.side = THREE.DoubleSide;
                var basicMat = new THREE.MeshBasicMaterial({color: 0x000000});
                basicMat.side = THREE.DoubleSide;
                var basicMat2 = new THREE.MeshBasicMaterial({color: 0xffffff});

                var schulterSkin = new THREE.Mesh(new THREE.TorusGeometry(schulterSize[0], schulterSize[1], 20, 20), normalMat);
                var firstArmGliedOberarmSkin = new THREE.Mesh(new THREE.CylinderGeometry(armGliedSize[0], armGliedSize[0], armGliedSize[1], 20), normalMat);
                var handSkin = new THREE.Mesh(new THREE.CylinderGeometry(armGliedSize[0], armGliedSize[0] * 1.5, armGliedSize[1]*2, 20), normalMat);
                var fingerSkin = new THREE.Mesh(new THREE.SphereGeometry(armGliedSize[0] * 0.4, 25,25), normalMat);


                //fusion of skins and skeleton
                this.schulter.add(schulterSkin);
                this.firstArmGliedOberarm.add(firstArmGliedOberarmSkin);
                this.hand.add(handSkin);
                this.finger1.add(fingerSkin);
                this.finger2.add(fingerSkin.clone());
                this.finger3.add(fingerSkin.clone());
                



                this.getMesh = function () {
                    return this.root;
                };
            };
            return Arm;
        }));