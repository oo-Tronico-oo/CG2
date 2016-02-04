/* requireJS module definition */
define(["jquery", "three", "shaders"],
    (function($, THREE, Shaders) {

        "use strict";

        var Explosion = function(scene) {


            this.root = new THREE.Object3D();

            var scope = this;
            
            
            var startTime = Date.now();
            
            var loader = new THREE.TextureLoader();

            // load explosion texture
            //
            // Loading textures is asynchronous. That means you the load function
            // takes the file url as input and three callback functions
            // onLoadSuccess, onLoadProgress and onLoadError
            // we need to handle these cases. Only in onLoadSuccess we can setup
            // the scene, the texture and the shaders correctly.
            // correctly this would be implemented with promises (see assignment add-on question)
            

            // define a shader with these uniform values
            scope.material = new THREE.ShaderMaterial({
                    uniforms: {
                            explosionTex: {type: 't', value: null},
                            time: {type: 'f', value: 0.0},
                            weight: {type: 'f', value: $('#explosionWeight').val()},
                            freqScale: {type: 'f', value: $('#frequencyScale').val()},
                            colorScale: {type: 'f', value: $('#colorScale').val()}
                        },
                    vertexShader: Shaders.getVertexShader("explosion"),
                    fragmentShader: Shaders.getFragmentShader("explosion")
                });
            
            setInterval(function () {
                scope.material.uniforms['time'].value = 0.00005 * ( Date.now() - startTime );
            },5);
            
            
            // var material = new THREE.ShaderMaterial( {
            //         uniforms: {
            //             explosionTex: ... aka explosion texture
            //             time: ... time since start
            //             weight: ... aka displacement weight - how strong is the displacement
            //             freqScale: ... frequency of the noise f < 0 = only low frequency noise, f > 0 more and more high frequency noise 
            //                            comes on
            //             colorScale: ... rescales the access positioning into the explosion textures (high value = lighter color, low value = darker color)
            //         },
            //         vertexShader: Shaders.getVertexShader("explosion"),
            //         fragmentShader: Shaders.getFragmentShader("explosion")
            //     } );

            loader.load("textures/explosion.png", function (texture) {
                    scope.material.uniforms.explosionTex.value = texture;
                });
                
            scope.mesh = new THREE.Mesh( new THREE.SphereGeometry( 300, 50, 50 ), scope.material );
            scope.mesh.name = "explosion";
            scope.root.add(scope.mesh);

            this.getMesh = function() {
                return this.root;
            };


        }; // constructor


        return Explosion;

    })); // define module

