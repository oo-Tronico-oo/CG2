/* requireJS module definition */
define(["three", "shaders"],
        (function (THREE, Shaders) {

            "use strict";

            var Planet = function () {


                this.root = new THREE.Object3D();

                // load and create required textures
                var loader = new THREE.TextureLoader();

                var scope = this;

                // implement ShaderMaterial using the code from
                // the lecture
                scope.material = new THREE.ShaderMaterial({
                    uniforms: THREE.UniformsUtils.merge([
                        THREE.UniformsLib['lights'],
                        {
                            phongDiffuseMaterial: {type: 'c', value: new THREE.Color(1, 0, 0)},
                            phongSpecularMaterial: {type: 'c', value: new THREE.Color(0.7, 0.7, 0.7)},
                            phongAmbientMaterial: {type: 'c', value: new THREE.Color(0.8, 0.2, 0.2)},
                            phongShininessMaterial: {type: 'f', value: 16.0},
                            dayTimeTexture: {type: 't', value: null},
                            nightTimeTexture: {type: 't', value: null},
                            cloudsTexture: {type: 't', value: null},
                            checkBoxDayTex: {type: 'i', value: $('#checkDayTexture').is(':checked')},
                            checkBoxNightTex: {type: 'i', value: $('#checkNightTexture').is(':checked')},
                            checkBoxCloudsTex: {type: 'i', value: $('#checkClouds').is(':checked')}
                        }
                    ]),
                    vertexShader: Shaders.getVertexShader("planet"),
                    fragmentShader: Shaders.getFragmentShader("planet"),
                    lights: true
                });

                // hint:
                // texture can be assigned only when it is loaded completely, e.g. like this
                loader.load("textures/earth_month04.jpg", function (texture) {
                    scope.material.uniforms.dayTimeTexture.value = texture;
                });
                loader.load("textures/earth_at_night_2048.jpg", function (texture) {
                    scope.material.uniforms.nightTimeTexture.value = texture;
                });
                loader.load("textures/earth_clouds_2048.jpg", function (texture) {
                    scope.material.uniforms.cloudsTexture.value = texture;
                });

                scope.mesh = new THREE.Mesh(new THREE.SphereGeometry(400, 100, 100), scope.material);
                scope.mesh.name = "planet";

                scope.root.add(scope.mesh);

                this.changeTex = function (tex) {
                    switch (tex) {
                        case 'day' :
                            scope.material.uniforms.checkBoxDayTex.value = $('#checkDayTexture').is(':checked');
                            break;
                        case 'night' :
                            scope.material.uniforms.checkBoxNightTex.value = $('#checkNightTexture').is(':checked');
                            break;
                        case 'clouds' :
                            scope.material.uniforms.checkBoxCloudsTex.value = $('#checkClouds').is(':checked');
                            break;
                        default :
                            console.log("switch changeTex false");
                    }
                };


                this.getMesh = function () {
                    return this.root;
                };


            }; // constructor

            return Planet;

        })); // define module


