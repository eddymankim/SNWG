/// @author alteredq/http://alteredqualia.com/
///
/// Screen-space ambient occlusion shader
/// - ported from SSAO GLSL shader v1.2
///   assembled by Martins Upitis (martinsh) (http://devlog-martinsh.blogspot.com)
///   original technique is made by ArKano22 (http://www.gamedev.net/topic/550699-ssao-no-halo-artifacts/)
/// - modifications
/// - modified to use RGBA packed depth texture (use clear color 1,1,1,1 for depth pass)
/// - refactoring and optimizations
///
export default {

    uniforms: {
        'tDiffuse':     { value: null },
        'tDepth':       { value: null },
        'size':         { value: new THREE.Vector2( 512, 512 ) },
        'cameraNear':   { value: 1 },
        'cameraFar':    { value: 100 },
        'radius':       { value: 32 },
        'onlyAO':       { value: 0 },
        'aoClamp':      { value: 0.25 },
        'lumInfluence': { value: 0.7 } },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform float cameraNear, cameraFar;
        #ifdef USE_LOGDEPTHBUF
            uniform float logDepthBufFC;
        #endif

        uniform float radius;       // ao radius
        uniform bool onlyAO;        // use only ambient occlusion pass?
        uniform vec2 size;          // texture width, height
        uniform float aoClamp;      // depth clamp-reduces haloing at edges
        uniform float lumInfluence; // how much luminance affects occlusion
        uniform sampler2D tDiffuse;
        uniform sampler2D tDepth;
        varying vec2 vUv;

        #define EULER 2.718281828459045

        // user variables
        const int samples = 64;             // ao sample count
        const bool useNoise = true;         // use noise for sample dithering
        const float noiseAmount = 0.0004;   // dithering amount
        const float diffArea = 0.4;         // self-shadowing reduction
        const float gDisplace = 0.4;        // gauss bell center

        #include <packing>

        vec2 rand(const vec2 coord) {   // generate noise for dithering
            vec2 noise;
            if (useNoise) {
                float nx = dot(coord,vec2(12.9898,78.233));
                float ny = dot(coord,vec2(12.9898,78.233)*2.0);
                noise = clamp(fract(43758.5453*sin(vec2(nx,ny))),0.0,1.0);
            } else {
                float ff = fract(1.0-coord.s*(size.x/2.0));
                float gg = fract(coord.t*(size.y/2.0));
                noise = vec2(0.25,0.75)*vec2(ff)+vec2(0.75,0.25)*gg;
            } return (noise*2.0-1.0)*noiseAmount;
        }


        float readDepth(const in vec2 coord) {
            float cameraFarPlusNear = cameraFar + cameraNear;
            float cameraFarMinusNear = cameraFar-cameraNear;
            float cameraCoef = 2.0*cameraNear;
            #ifdef USE_LOGDEPTHBUF
                float lz = unpackRGBAToDepth(texture2D(tDepth,coord));
                float z = (lz/pow(2.0,(lz/logDepthBufFC))-1.0)+1.0;
            #else
                float z = unpackRGBAToDepth( texture2D( tDepth, coord ) );
            #endif
            return cameraCoef/(cameraFarPlusNear-z*cameraFarMinusNear);
        }

        float compareDepths(const in float depth1, const in float depth2, inout int far) {
            float diff = (depth1-depth2)*100.0;
            float area = (diff<gDisplace)?8.0:diffArea;
            if (diff>=gDisplace) far = 1;
            return pow(EULER,-2.0*pow(diff-gDisplace,2)/pow(area,2));
        }


        float calcAO(float depth, float dw, float dh) {
            vec2 vv = vec2(dw,dh);
            vec2 coord1 = vUv+radius*vv, coord2 = vUv-radius*vv;
            float temp1 = compareDepths(depth,readDepth(coord1),far);
            int far = 0;
            temp1 = compareDepths(depth,readDepth(coord1),far);
            if (far>0) temp1 += (1.0-temp1)*compareDepths(readDepth(coord2),depth,far);
            return temp1;
        }


        void main() {
            vec2 noise = rand(vUv);
            float depth = readDepth(vUv);
            float ao = 0.0, tt = clamp(depth,aoClamp,1.0);
            float w = (1.0/size.x)/tt+(noise.x*(1.0-noise.x));
            float h = (1.0/size.y)/tt+(noise.y*(1.0-noise.y));
            float dz = 1.0/float(samples);
            float l = 0.0, z = 1.0-dz/2.0;

            for (int i=0;i<=samples;i++) {
                float r = sqrt(1.0-z);
                float pw = cos(l)*r, ph = sin(l)*r;
                ao += calcAO(depth, pw*w, ph*h);
                z = z-dz; l = l + 2.399963229728653;
            }

            ao /= float(samples);
            ao = 1.0-ao;
            vec3 color = texture2D(tDiffuse,vUv).rgb;
            vec3 luminance = vec3(dot(color.rgb, vec3(0.299,0.587,0.114)));
            vec3 final = vec3(color*mix(vec3(ao), vec3(1.0),luminance*lumInfluence));
            if (onlyAO) final = vec3(mix(vec3(ao), vec3(1.0),luminance*lumInfluence));
            gl_FragColor = vec4(final,1.0);
        }`
}
