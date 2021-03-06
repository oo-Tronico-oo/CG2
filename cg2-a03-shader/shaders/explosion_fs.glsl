
uniform sampler2D explosionTex;
uniform float colorScale;

varying vec2 vUv;
varying float noise;


void main() {

    // noise values can be negative / we need to use its absolute values
    // our noise values might also not be in the full range between 0-1
    // add a scale (brightness) value that is controlled by a uniform variable

    // our goal is to access a color in our texture (explosion.png)
    // therefore we need a texture (uv) coordinate (vec2) that accesses a
    // value in the texture
    //
    // a small noise value should access a dark value in the texture
    // a high noise value should return a light value


    //gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    vec3 color = texture2D(explosionTex, vUv * ( (-0.001 * colorScale)  * noise )).rgb ; //vec3( vUv * ( (-0.001 * colorScale)  * noise ), 0.0 );
    gl_FragColor = vec4( color, 1.0 );
}
	