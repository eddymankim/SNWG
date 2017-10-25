/// @author alteredq / http://alteredqualia.com/
///
/// Convolution shader, ported from o3d sample to WebGL / GLSL
/// http://o3d.googlecode.com/svn/trunk/samples/convolution.html
import * as THREE from '../module.js'

export default {

    defines: { 'KERNEL_SIZE_FLOAT': '25.0', 'KERNEL_SIZE_INT': '25' },

    uniforms: {
        'tDiffuse':        { value: null },
        'uImageIncrement': { value: new THREE.Vector2( 0.001953125, 0.0 ) },
        'cKernel':         { value: [] } },

    vertexShader: `
        uniform vec2 uImageIncrement;
        varying vec2 vUv;

        void main() {
            vUv = uv-((KERNEL_SIZE_FLOAT-1.0)/2.0)*uImageIncrement;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform float cKernel[KERNEL_SIZE_INT];
        uniform sampler2D tDiffuse;
        uniform vec2 uImageIncrement;
        varying vec2 vUv;

        void main() {
            vec2 imageCoord = vUv;
            vec4 sum = vec4(0.0,0.0,0.0,0.0);

            for (int i=0;i<KERNEL_SIZE_INT;i++) {
                sum += texture2D(tDiffuse,imageCoord)*cKernel[i];
                imageCoord += uImageIncrement;
            } gl_FragColor = sum;
        }`,

    buildKernel: function (sigma) {
        const gauss = (x,sigma) => Math.exp(-(x*x)/(2.0*sigma*sigma))
        let kMaxKernelSize = 25, size = 2*Math.ceil(sigma*3.0)+1
        if (size>kMaxKernelSize) size = kMaxKernelSize
        let halfWidth = (size-1)*0.5, sum=0.0, values = new Array(size)
        for (let i=0;i<size;++i) sum += (values[i] = gauss(i-halfWidth,sigma))
        for (let i=0;i<size;++i) values[i] /= sum // normalize
        return values }
}
