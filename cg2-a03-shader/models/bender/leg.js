define(["three", "parametric", "BufferGeometry"],
        (function (THREE, ParametricSurface, BufferGeometry) {

            "use strict";

            var Leg = function (skalierung) {

                var obj3D = function () {
                    return new THREE.Object3D();
                };


                //[radius, hoehe]
                var beinGliedSize = [skalierung, skalierung * 0.8];

                //eigene paraSurf ---------------------------------------------------------

                var gliedMesh = function(){
                var paramFunction = function (u, v) {
                    var pos3D = [
                        beinGliedSize[0] * Math.cos(v),
                        beinGliedSize[0] * Math.sin(v),
                        beinGliedSize[1] * Math.sin(u)
                    ];
                    return pos3D;
                };

                var configuration = {
                    segmentsU: 2,
                    segmentsV: 6,
                    uMin: -0.5 * Math.PI,
                    uMax: 0.5 * Math.PI,
                    vMin: -Math.PI,
                    vMax: Math.PI
                };

                var paramSurface = new ParametricSurface(paramFunction, configuration);
                var bufferGeometryParametric = new BufferGeometry();

                bufferGeometryParametric.addAttribute("position", paramSurface.getPositions());
                bufferGeometryParametric.addAttribute("color", paramSurface.getColors());
                bufferGeometryParametric.setIndex(paramSurface.getIndices());
                bufferGeometryParametric.setWireframe(true);
                
                var mesh = bufferGeometryParametric.getMesh();
                    mesh.rotation.x += Math.PI / 2;
                    
                return mesh;
            }

                //--------------------------------------------------------------------------
                
                //erstellung eines Cylinders fuer den Arm
                var getBeinGlied = function (root) {
                    var temp = obj3D();
                    temp.translateY(beinGliedSize[1] * -1.1);
                    var tempSkin = gliedMesh();
                    temp.add(tempSkin);
                    root.add(temp);

                    return temp;
                };

                //erstellen eines oberarm/unterarm
                var getBeinTeil = function (root, elemente) {
                    var neuerRoot = getBeinGlied(root);
                    for (var i = 0; i < elemente - 1; i++) {
                        neuerRoot = getBeinGlied(neuerRoot);
                    }
                    return neuerRoot;
                };
                
                //skeleton
                this.root = obj3D();
                this.firstBeinglied = getBeinGlied(this.root);
                this.lastBeinGlied = getBeinTeil(this.firstBeinglied, 12);
                this.fuss = obj3D();
                this.sohle = obj3D();


                //transform
                this.fuss.translateY(-beinGliedSize[1]*1.5);
                this.sohle.rotateX(Math.PI / 2);


                //hierarchy
                this.root.add(this.firstBeinglied);
                this.lastBeinGlied.add(this.fuss);
                this.fuss.add(this.sohle);



                //skin
                var normalMat = new THREE.MeshNormalMaterial();
                normalMat.side = THREE.DoubleSide;
                var basicMat = new THREE.MeshBasicMaterial({color: 0x000000});
                basicMat.side = THREE.DoubleSide;
                var basicMat2 = new THREE.MeshBasicMaterial({color: 0xffffff});

                var fussSkin = new THREE.Mesh(new THREE.SphereGeometry(beinGliedSize[0] * 2, 25, 25, 0, Math.PI * 2, 0, Math.PI / 2), normalMat);
                var sohleSkin = new THREE.Mesh(new THREE.CircleGeometry(beinGliedSize[0] * 2, 25), normalMat);

                //fusion of skins and skeleton
                this.fuss.add(fussSkin);
                this.sohle.add(sohleSkin);
                



                this.getMesh = function () {
                    return this.root;
                };
            };
            return Leg;
        }));