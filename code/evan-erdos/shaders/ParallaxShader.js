/// Parallax Occlusion shaders from
///     http://sunandblackcat.com/tipFullView.php?topicid=28
/// No tangent-space transforms logic based on
///     http://mmikkelsen3d.blogspot.sk/2012/02/parallaxpoc-mapping-and-no-tangent.html
///
export default {
    modes: { // from fastest to best quality
        none:  'NO_PARALLAX',
        basic: 'USE_BASIC_PARALLAX',
        steep: 'USE_STEEP_PARALLAX',
        occlusion: 'USE_OCLUSION_PARALLAX',
        relief: 'USE_RELIEF_PARALLAX'},

    uniforms: {
        'bumpMap': { value: null },
        'map': { value: null },
        'parallaxScale': { value: null },
        'parallaxMinLayers': { value: null },
        'parallaxMaxLayers': { value: null } },

    vertexShader: `
        varying vec2 vUv;
        varying vec3 vViewPosition, vNormal;

        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix*vec4(position,1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix*normal);
            gl_Position = projectionMatrix*mvPosition;
        }`,

    fragmentShader: `
        uniform sampler2D map, bumpMap;
        uniform float parallaxScale;
        uniform float parallaxMinLayers, parallaxMaxLayers;
        varying vec2 vUv;
        varying vec3 vViewPosition, vNormal;

        #ifdef USE_BASIC_PARALLAX
            vec2 parallaxMap(in vec3 V) {
                return vUv - parallaxScale*V.xy*texture2D(bumpMap,vUv).r; }
        #else
            vec2 parallaxMap(in vec3 V) {
                // Determine number of layers from angle between V and N
                float numLayers = mix(parallaxMaxLayers,parallaxMinLayers,abs(dot(vec3(0.0,0.0,1.0),V)));
                float layerHeight = 1.0/numLayers, currentLayerHeight = 0.0;
                // shift of texture coordinates for each iteration
                vec2 dtex = parallaxScale*V.xy/V.z/numLayers, currentTextureCoords = vUv;
                float heightFromTexture = texture2D(bumpMap,currentTextureCoords).r;
                for (int i=0;i<30;i++) {
                    if (heightFromTexture<=currentLayerHeight) break;
                    currentLayerHeight += layerHeight;
                    currentTextureCoords -= dtex;
                    heightFromTexture = texture2D(bumpMap, currentTextureCoords).r;
                }

                #ifdef USE_STEEP_PARALLAX
                    return currentTextureCoords;
                #elif defined(USE_RELIEF_PARALLAX)
                    vec2 deltaTexCoord = dtex/2.0;
                    float deltaHeight = layerHeight/2.0;
                    // Return to the mid point of previous layer
                    currentTextureCoords += deltaTexCoord;
                    currentLayerHeight -= deltaHeight;

                    // Binary search to increase precision of Steep Parallax Mapping
                    const int numSearches = 5;
                    for (int i=0;i<numSearches;i++) {
                        deltaTexCoord /= 2.0; deltaHeight /= 2.0;
                        heightFromTexture = texture2D(bumpMap,currentTextureCoords).r;
                        // Shift along or against vector V
                        if (heightFromTexture>currentLayerHeight) {
                            currentTextureCoords -= deltaTexCoord;
                            currentLayerHeight += deltaHeight;
                        } else { // above the surface
                            currentTextureCoords += deltaTexCoord;
                            currentLayerHeight -= deltaHeight;
                        }
                    } return currentTextureCoords;

                #elif defined(USE_OCLUSION_PARALLAX)
                    vec2 prevTCoords = currentTextureCoords+dtex;
                    // Heights for linear interpolation
                    float nextH = heightFromTexture - currentLayerHeight;
                    float prevH = texture2D(bumpMap,prevTCoords).r-currentLayerHeight+layerHeight;
                    float weight = nextH/(nextH-prevH); // Proportions for linear interpolation
                    // Interpolation of texture coordinates
                    return prevTCoords*weight+currentTextureCoords*(1.0-weight);
                #else // NO_PARALLAX
                    return vUv;
                #endif
            }
        #endif

        vec2 perturbUv(vec3 surfPosition, vec3 surfNormal, vec3 viewPosition) {
            vec2 texDx = dFdx(vUv), texDy = dFdy(vUv);
            vec3 vSigmaX = dFdx(surfPosition), vSigmaY = dFdy(surfPosition);
            vec3 vR1 = cross(vSigmaY,surfNormal), vR2 = cross(surfNormal,vSigmaX);
            float fDet = dot(vSigmaX,vR1);
            vec2 vProjVscr = (1.0/fDet)*vec2(dot(vR1,viewPosition), dot(vR2,viewPosition));
            vec3 vProjVtex;
            vProjVtex.xy = texDx*vProjVscr.x+texDy*vProjVscr.y;
            vProjVtex.z = dot(surfNormal,viewPosition);
            return parallaxMap(vProjVtex);
        }

        void main() {
            gl_FragColor = texture2D(map,perturbUv(-vViewPosition,normalize(vNormal),normalize(vViewPosition)));
        }`
}
