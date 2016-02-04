precision mediump float;


// uniform lights (we only have the sun)
uniform vec3 directionalLightColor[1];
uniform vec3 directionalLightDirection[1];

uniform vec3 ambientLightColor[1];

// uniform material constants k_a, k_d, k_s, alpha
uniform vec3 phongAmbientMaterial;
uniform vec3 phongDiffuseMaterial;
uniform vec3 phongSpecularMaterial;
uniform float phongShininessMaterial;

// uniform sampler2D textures
uniform sampler2D dayTimeTexture;
uniform sampler2D nightTimeTexture;
uniform sampler2D cloudsTexture;

// three js only supports int no bool
// if you want a boolean value in the shader, use int
uniform int checkBoxDayTex;
uniform int checkBoxNightTex;
uniform int checkBoxCloudsTex;

// data from the vertex shader
varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec2 vUv;
varying mat4 pM;

vec3 phong(vec3 v, vec3 lightDirect, vec3 dayColor, vec3 nightColor, vec3 cloudsColor) {
    if(dot(v,ecNormal) < 0.0) return vec3(0,0,0); // back-face
    
    vec3 ambientLightColor = pow(abs(ambientLightColor[0]), vec3(0.6))*3.0;
    vec3 directLightColor = pow(abs(directionalLightColor[0]), vec3(0.6))*3.0;

    vec3 reflectLight = reflect(lightDirect, ecNormal);

    float ndots = max( dot(ecNormal, -lightDirect), 0.0);
    float rdotv = max( dot(reflectLight, v), 0.0);
    
    // ambient part contains lights; modify depending on time of day
    vec3 ambient = (checkBoxNightTex == 1)? nightColor * ambientLightColor: phongAmbientMaterial * ambientLightColor[0];

    // diffuse contribution
    vec3 diffuseCoeff = (checkBoxDayTex == 1 )? dayColor : phongDiffuseMaterial;

    // clouds at day?
    if(checkBoxCloudsTex == 1) diffuseCoeff = (1.0-cloudsColor)*diffuseCoeff + cloudsColor*vec3(1,1,1);

    // final diffuse term for daytime
    vec3 diffuse =  diffuseCoeff * directLightColor * ndots;

    //vec3 diff = phongDiffuseMaterial * ndots * lightColor;

    vec3 spec = phongSpecularMaterial * pow(rdotv, phongShininessMaterial ) * directLightColor*0.5;

    if (ndots <= 0.0) return ambient;
    
    // when ndotl == 1.0 the ambient term should be zero
    if(ndots == 1.0) ambient = vec3(0,0,0);

    return (1.0 - ndots) * ambient + (ndots) * diffuse + spec;
}

void main() {


    // get color from different textures
    vec3 dayColor = texture2D(dayTimeTexture, vUv).rgb;
    vec3 nightColor = texture2D(nightTimeTexture, vUv).rgb;
    vec3 cloudsColor = texture2D(cloudsTexture, vUv).rgb;
   
    // normalize normal after projection
    
    // do we use a perspective or an orthogonal projection matrix?
    bool usePerspective = pM[2][3] != 0.0;

    // for perspective mode, the viewing direction (in eye coords) points
    // from the vertex to the origin (0,0,0) --> use -ecPosition as direction.
    // for orthogonal mode, the viewing direction is simply (0,0,1)
    vec3 v = usePerspective? normalize(-ecPosition.xyz) : vec3(0,0,1);


    // calculate color using phong illumination
    // depending on GUI checkbox:
    // color from night texture and clouds are added to ambient term (instead of ambient material k_a)
    // color from day texture are added to diffuse term (instead of diffuse material k_d)

    // Note: the texture value might have to get rescaled (gamma corrected)
    //       e.g. color = pow(color, vec3(0.6))*2.0;
    
    // vector from light to current point
    vec3 l = normalize(directionalLightDirection[0]);

    vec3 color = phong(v, l, dayColor, nightColor, cloudsColor);

    gl_FragColor = vec4(color, 1.0);
}
