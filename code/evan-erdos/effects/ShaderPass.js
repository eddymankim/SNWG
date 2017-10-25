///
/// @author alteredq / http://alteredqualia.com/
///
import * as THREE from '../module.js'
import { Pass } from './module.js'

export default class ShaderPass extends Pass {
    constructor(shader, textureID='tDiffuse') { super()
        let material = shader, uniforms = shader.uniforms
        // if (shader instanceof THREE.ShaderMaterial) else
        if (shader) {
            uniforms = THREE.UniformsUtils.clone(shader.uniforms)
            material = new THREE.ShaderMaterial({
                defines: shader.defines || { },
                uniforms: uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader })
        }

        this.uniforms = uniforms // ick

        let camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        let scene = new THREE.Scene()
        let quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), null)
            quad.frustumCulled = false

        scene.add(quad)

        this.render = (renderer, write, read, delta, mask) => {
            if (uniforms[textureID])
                uniforms[textureID].value = read.texture
            quad.material = material
            if (this.renderToScreen) renderer.render(scene, camera)
            else renderer.render(scene, camera,  write, this.clear)
        }
    }
}
