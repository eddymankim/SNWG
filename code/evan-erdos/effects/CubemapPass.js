///
/// @author bhouston / http://clara.io/
///
import * as THREE from '../module.js'
import { Pass } from './module.js'

export default class CubemapPass extends Pass {
    constructor(camera, envMap, opacity) { super()
        this.camera = camera
        this.needsSwap = false
        this.cubeShader = THREE.ShaderLib['cube']
        let geometry = new THREE.BoxBufferGeometry(10,10,10)
        let material = new THREE.ShaderMaterial({
            uniforms: this.cubeShader.uniforms,
            vertexShader: this.cubeShader.vertexShader,
            fragmentShader: this.cubeShader.fragmentShader,
            depthTest: false, depthWrite: false, side: THREE.BackSide })
        this.cubeMesh = new THREE.Mesh(geometry, material)
        this.envMap = envMap
        this.opacity = (opacity!==undefined)?opacity:1.0
        this.cubeScene = new THREE.Scene()
        this.cubeCamera = new THREE.PerspectiveCamera()
        this.cubeScene.add(this.cubeMesh)
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        let oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        this.cubeCamera.projectionMatrix.copy(this.camera.projectionMatrix)
        this.cubeCamera.quaternion.setFromRotationMatrix(this.camera.matrixWorld)
        this.cubeMesh.material.uniforms['tCube'].value = this.envMap
        this.cubeMesh.material.uniforms['opacity'].value = this.opacity
        this.cubeMesh.material.transparent = this.opacity<1.0
        let buffer = this.renderToScreen?null:readBuffer
        renderer.render(this.cubeScene, this.cubeCamera, buffer, this.clear)
        renderer.autoClear = oldAutoClear
    }
}
