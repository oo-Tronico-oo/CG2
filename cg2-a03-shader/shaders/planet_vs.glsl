precision mediump float;

varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec2 vUv;
varying mat4 pM;


void main() {
    
    ecPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * ecPosition;
    ecNormal = normalize( normalMatrix * normal );

    vUv = uv;
    pM = projectionMatrix;
    
}

