define(["three"],
        (function (THREE) {

            "use strict";

            var EyeArea = function (skalierung) {

                var obj3D = function () {
                    return new THREE.Object3D();
                };
                
                //[radius, hoehe]
                this.headSize = [1 * skalierung, 1.8 * skalierung];
                var antennaFootSize = [0.2 * skalierung, 0.2 * skalierung],
                //[radius bottom, radius top, hoehe]
                        antennaSize = [0.08 * skalierung, 0.02 * skalierung, 1.2 * skalierung],
                //[radius]
                        craniumSize = [1 * skalierung],
                        antennaTopSize = [0.1 * skalierung]
                        ;
                
                
                //skeleton
                var root = obj3D(),
                        head = obj3D(),
                        cranium = obj3D(),
                        antennaFoot = obj3D(),
                        antenna = obj3D(),
                        antennaTop = obj3D()
                        ;

                //transform
                cranium.translateY(this.headSize[1] / 2 );
                
                antennaFoot.translateY(craniumSize[0] + antennaFootSize[1] / 2);
                antenna.translateY(antennaFootSize[1] / 2 + antennaSize[2] / 2);
                antennaTop.translateY(antennaSize[2] / 2);
                

                //hierarchy
                root.add(head);
                head.add(cranium);
                cranium.add(antennaFoot);
                antennaFoot.add(antenna);
                antenna.add(antennaTop);


                //skin
                var normalMat = new THREE.MeshNormalMaterial();
                normalMat.side = THREE.DoubleSide;
                
                var headSkin = new THREE.Mesh(new THREE.CylinderGeometry( this.headSize[0], this.headSize[0], this.headSize[1], 25, 1 ), normalMat);
                var craniumSkin = new THREE.Mesh(new THREE.SphereGeometry(craniumSize[0], 25, 25, 0, 2 * Math.PI), normalMat);
                var antennaFootSkin = new THREE.Mesh(new THREE.CylinderGeometry( antennaFootSize[0], antennaFootSize[0], antennaFootSize[1], 25, 1 ), normalMat);
                var antennaSkin = new THREE.Mesh(new THREE.CylinderGeometry( antennaSize[1], antennaSize[0], antennaSize[2], 25, 1 ), normalMat);
                var antennaTopSkin = new THREE.Mesh(new THREE.SphereGeometry(antennaTopSize[0], 25, 25, 0, 2 * Math.PI), normalMat);
                
                
                //fusion of skins and skeleton

                head.add(headSkin);
                cranium.add(craniumSkin);
                antennaFoot.add(antennaFootSkin);
                antenna.add(antennaSkin);
                antennaTop.add(antennaTopSkin);
                
                
                this.getMesh = function () {
                    return root;
                };
            };
            return EyeArea;
        }));