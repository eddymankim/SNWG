///
/// SNWG - make your own atmosphere day
///
/// 2017-09-26 Ben Scott @evan-erdos <bescott.org>
///
import * as T from '../lib/module.js'
import SimpleRenderer from './SimpleRenderer.js'


let rate = 3, dt = 0

let terrain = new T.Object3D(), group = new T.Object3D()


let light = new T.PointLight(0xFFDDFF, 1, 10, 2)
    light.position.set(0,0.4,0)
    light.castShadow = true
    light.shadow.camera.far = 100


let cube = new T.Mesh(
    new T.CubeGeometry(10,10,10),
    new T.MeshStandardMaterial({ color: 0xDDDDDD }))
    cube.position.set(-50,0,0)
    cube.receiveShadow = true
    cube.castShadow = true
    terrain.add(cube)


let box = new T.Mesh(
    new T.CubeGeometry(20,20,15),
    new T.MeshStandardMaterial({ color: 0xBBAAAA }))
    box.position.set(30,0,10)
    box.receiveShadow = true
    box.castShadow = true
    terrain.add(box)


let tree = new T.Mesh(
    new T.CubeGeometry(5,30,6),
    new T.MeshStandardMaterial({ color: 0x777777 }))
    tree.position.set(30,0,-40)
    tree.receiveShadow = true
    tree.castShadow = true
    terrain.add(tree)


let ground = new T.Mesh(
    new T.PlaneGeometry(1e2,1e2,32,32),
    new T.MeshPhongMaterial({ color: 0xAAAAAA }))
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)




let tetrahedron = new T.Mesh(
    new T.TetrahedronGeometry(1,2),
    new T.MeshStandardMaterial({
        wireframe: true,
        color: 0xFFFFFFAA,
        metalness: 0.3,
        roughness: 0.6,
        emissiveIntensity: 1.5, }))
    tetrahedron.position.set(0,2.5,0)
    tetrahedron.scale.set(1,2,1)
    group.add(tetrahedron)


let sphere = new T.Mesh(
    new T.SphereGeometry(0.8,32,32),
    new T.MeshStandardMaterial({
    color: 0xFFAAEEAA,
    metalness: 0.1,
    roughness: 0.8, }))
    sphere.position.set(0,3,0)
    sphere.receiveShadow = true
    sphere.castShadow = true
    group.add(sphere)



let diamond = new T.Mesh(
    new T.IcosahedronGeometry(0.25,0),
    new T.MeshStandardMaterial({
        color: 0xC1BAB1,
        metalness: 0.8,
        roughness: 0.3, }))
    diamond.position.set(0,1,0)
    diamond.receiveShadow = true
    diamond.castShadow = true
    group.add(diamond)


let torus = new T.Mesh(
    new T.TorusKnotGeometry(1,0.1,32,16),
    new T.MeshStandardMaterial({
        color: 0x00FFAA,
        metalness: 0.0,
        roughness: 1.0, }))
    torus.position.set(0,0.5,0)
    torus.rotation.set(Math.PI/2,Math.PI/9,0)
    torus.receiveShadow = true
    torus.castShadow = true
    group.add(torus)



let bulb = new T.Mesh(
    new T.CylinderGeometry(0.1,0.1,0.5,8,2),
    new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveIntensity: 2, }))
    bulb.position.set(0,1.7,0)
    bulb.castShadow = false
    bulb.receiveShadow = false


let pivot = new T.Mesh(
    new T.CylinderGeometry(0.1,0.2,2.5,8,4),
    new T.MeshStandardMaterial({
        color: 0xBBEEFF,
        metalness: 0.1,
        roughness: 0.1,
        emissive: 1.0, }))
    pivot.add(light, bulb)
    pivot.position.set(0,3.5,1.5)
    pivot.rotation.set(Math.PI/2,0,0)
    pivot.castShadow = false
    pivot.receiveShadow = false
    group.add(pivot)


function update(time) {
    dt += time
    torus.position.z = 10*Math.sin(1+dt)*time
    torus.position.x = Math.cos(dt)*time
    torus.rotateY(-2*rate*time)
    group.rotateY(rate*time)
}



let renderer = new SimpleRenderer({
    position: { x: 0, y: 10, z: 15 },
    update: (t) => update(t),
    path: '../../data/evan-erdos/' })

renderer.add(new T.CameraHelper(light.shadow.camera))

group.position.set(0,2.5,0)


renderer.add(terrain, group)





