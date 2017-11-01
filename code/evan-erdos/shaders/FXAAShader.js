/// @author alteredq / http://alteredqualia.com/
/// @author davidedc / http://www.sketchpatch.net/
///
/// NVIDIA FXAA by Timothy Lottes
/// http://timothylottes.blogspot.com/2011/06/fxaa3-source-released.html
/// - WebGL port by @supereggbert, http://www.glge.org/demos/fxaa/
export default {

    uniforms: {
        'tDiffuse':   { value: null },
        'resolution': { value: new THREE.Vector2(1/1024, 1/512) } },

    vertexShader: `
        void main() {
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        #define FXAA_REDUCE_MIN(1.0/128.0)
        #define FXAA_REDUCE_MUL(1.0/8.0)
        #define FXAA_SPAN_MAX 8.0

        void main() {
            vec3 cNW = texture2D(tDiffuse,(gl_FragCoord.xy+vec2(-1.0,-1.0))*resolution).xyz;
            vec3 cNE = texture2D(tDiffuse,(gl_FragCoord.xy+vec2(1.0,-1.0))*resolution).xyz;
            vec3 cSW = texture2D(tDiffuse,(gl_FragCoord.xy+vec2(-1.0,1.0))*resolution).xyz;
            vec3 cSE = texture2D(tDiffuse,(gl_FragCoord.xy+vec2(1.0,1.0))*resolution).xyz;
            vec4 cMF = texture2D(tDiffuse,gl_FragCoord.xy*resolution);
            vec3 cM  = cMF.xyz, l = vec3(0.299,0.587,0.114);

            float lNW = dot(cNW,l), lNE = dot(cNE,l), lSW = dot(cSW,l);
            float lSE = dot(cSE,l), lM = dot(cM,l);
            float lMin = min(lM, min(min(lNW, lNE), min(lSW, lSE)));
            float lMax = max(lM, max(max(lNW, lNE) , max(lSW, lSE)));
            vec2 dir;
            dir.x = -((lNW+lNE)-(lSW+lSE)); dir.y = ((lNW+lSW)-(lNE+lSE));
            float dirReduce = max(lNW+lNE+lSW+lSE)*(0.25*FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
            float rcpDirMin = 1.0/(min(abs(dir.x),abs(dir.y))+dirReduce);
            dir = min(vec2(FXAA_SPAN_MAX,  FXAA_SPAN_MAX),
                  max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir*rcpDirMin))*resolution;
            vec4 cA = 0.5*(
                texture2D(tDiffuse, gl_FragCoord.xy*resolution+dir*(1.0/3.0-0.5))+
                texture2D(tDiffuse, gl_FragCoord.xy*resolution+dir*(2.0/3.0-0.5)));
            vec4 cB = cA*0.5+0.25*(
                texture2D(tDiffuse, gl_FragCoord.xy*resolution+dir*(0.0/3.0-0.5))+
                texture2D(tDiffuse, gl_FragCoord.xy*resolution+dir*(3.0/3.0-0.5)));
            float lumaB = dot(cB,vec4(luma,0.0));
            if (lumaB<lMin) || (lumaB>lMax)) gl_FragColor = cA;
            else gl_FragColor = cB;
        }`
}
