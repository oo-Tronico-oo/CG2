/* requireJS module definition */
define(["three", "shaders"],
        (function (THREE, Shaders) {

            "use strict";

            var Planet = function () {

                var textureDay,
                    textureNight,
                    textureCloude;

                this.root = new THREE.Object3D();

                // load and create required textures

                var scope = this;
                
                //textureDay = new THREE.TextureLoader().load("models/satellitenbild_bm2002_tag_eis.jpg", function (texture) {
                //texture.wrapS = THREE.RepeatWrapping;
                //texture.wrapT = THREE.RepeatWrapping;
                //texture.repeat.set(1, 1);
                //});
                //textureNight = new THREE.TextureLoader().load("models/satellitenbild_bm2002_nacht_stadtlichter.jpg", function (texture) {
                //});
                //textureCloude = new THREE.TextureLoader().load("models/satellitenbild_bm2002_tag_wolken.jpg", function (texture) {
                //});
                
                // implement ShaderMaterial using the code from
                // the lecture
                scope.material = new THREE.ShaderMaterial({
                    uniforms: THREE.UniformsUtils.merge([
                        THREE.UniformsLib['lights'],
                        {
                            diffuseMaterial: {type: 'c', value: new THREE.Color(1, 0, 0)},
                            specularMaterial: {type: 'c', value: new THREE.Color(0.7, 0.7, 0.7)},
                            ambientMaterial: {type: 'c', value: new THREE.Color(0.8, 0.2, 0.2)},
                            shininessMaterial: {type: 'f', value: 16.0},
                            //daytimeTexture: {type: 't', value: null},
                            //nighttimeTexture: {type: 't', value: null},
                            //cloudeTexture: {type: 't', value: null}
                        }
                    ]),
                    vertexShader: Shaders.getVertexShader("planet"),
                    fragmentShader: Shaders.getFragmentShader("planet"),
                    lights: true
                });

                // hint:
                // texture can be assigned only when it is loaded completely, e.g. like this
                //console.log(textureDay);
                //scope.material.uniforms.daytimeTexture.value = textureDay;
                //scope.material.uniforms.nighttimeTexture.value = textureNight;
                //scope.material.uniforms.cloudeTexture.value = textureCloude;
                

                // Zusatzaufgabe
//                $.when(loadTexture("satellitenbild_bm2002_tag_eis.jpg", texturDay),
//                       loadTexture("satellitenbild_bm2002_nacht_stadtlichter.jpg", texturNight),
//                       loadTexture("satellitenbild_bm2002_tag_wolken.jpg", texturCloude)).then(function () {
//                                                    material.uniforms.daytimeTexture.value = texturDay;
//                                                    });
//
//                function loadTexture(imgURL, variable) {
//                    var dfd = $.Deferred();
//                    
//                    dfd.done(function() {
//                        variable = new Image();
//                        variable.src = imgURL;
//                    });
//                    
//                    dfd.resolve();
//                    
//                    return dfd.promise();
//                }
//                var material = new THREE.MeshBasicMaterial({map: textureDay});

                scope.mesh = new THREE.Mesh(new THREE.SphereGeometry(400, 100, 100), scope.material);
                scope.mesh.name = "planet";

                scope.root.add(scope.mesh);
                



                this.getMesh = function () {
                    return this.root;
                };


            }; // constructor

            return Planet;

        })); // define module


