///
/// Week 6 Post
/// This week was a real Fail
/// patched together by nico
///
import * as pkgLib from '../../lib/module.js'

// you should rename this to match your own renderer
//import setupClass from 'nazel-6-renderer.js'
class setupClass {
    constructor(
      { // Constructor inputs
            path = '../../data/',
            width = 500,
            height = 500,
            background = 0x151b0a,
            ambient = 0x14031B,
            light = 0xFEEBC1,
            ground = 0xF2E9CF,
            webgl = { antialias: true, shadowMapEnabled: true },
            position = { x:0, y:0, z:0 },
            fog = { color: 0xD7FFFD, near: 1e2, far: 1e3 },
            cam = { fov: 60, aspect: width/height, near: 0.1, far: 2e4 },
            update = (time) => { },
      }={})
      { //Start of Constructor function

        let gui = new dat.GUI({ autoPlace: false });
        let guiDiv = document.getElementById('my-gui-div');
        guiDiv.appendChild(gui.domElement);

        let clock = new pkgLib.Clock()

        let listener = new pkgLib.AudioListener()

        let renderer = new pkgLib.WebGLRenderer(webgl)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(width, height)
            renderer.setClearColor(ambient, 0)
            renderer.shadowMap.type = pkgLib.PCFSoftShadowMap
            renderer.shadowMap.enabled = true


        let scene = new pkgLib.Scene()
            scene.fog = new pkgLib.Fog(...Object.values(fog))
            scene.background = new pkgLib.Color(background)
            scene.add(new pkgLib.AmbientLight(ambient))


        let camera = new pkgLib.PerspectiveCamera(...Object.values(cam))
            camera.position.set(...Object.values(position))
            scene.add(camera)


        //let sun = new pkgLib.HemisphereLight(light, ground, 0.5)
        //    sun.position.set(1,2,0)
        //    scene.add(sun)

        let controls = new pkgLib.OrbitControls(camera,renderer.domElement)

        this.ObjectsToScene = (...things) => things.forEach(o => scene.add(o))


        const render = () => {
            requestAnimationFrame(render.bind(this))
            controls.update()
            update(clock.getDelta())
            renderer.render(scene, camera)
        }


        const resize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }


        window.addEventListener('resize', resize, false);
        window.addEventListener('load', () => render(), false);
        let div = document.getElementById('3dDiv')
        div.appendChild(renderer.domElement)
    }//end constructor
}//end of class
// a rate of rotation and delta time
let rate = 3;
let dt = 5;

// a "terrain" and a "thing", our object containers
let cubeObj3d = new pkgLib.Object3D();
let lightsObj3d = new pkgLib.Object3D();

//mesh(obj, mat)
let cube = new pkgLib.Mesh( new pkgLib.CubeGeometry(4,4,4), new pkgLib.MeshStandardMaterial({ color: 0xe4b5e7 }) );
    cube.position.set(1,0,.5);
    cube.receiveShadow = true;
    cube.castShadow = true;
cubeObj3d.add(cube);


//GREEN
let lightSphere = new pkgLib.SphereGeometry( 0.5, 16, 1 );
////PointLight( color, intensity, distance, decay )
let light = new pkgLib.PointLight(0x10e212, 1, 10, 1);
light.add( new pkgLib.Mesh( lightSphere, new pkgLib.MeshBasicMaterial( { color: 0x10e212 } ) ) );
    light.position.set(0,3,7);
    light.castShadow = true;
    light.shadow.camera.far = 100;
lightsObj3d.add(light);

// this is the update function that we pass to the renderer,
// who then calls us back before it renders the scene.

//make some light


//RED
let light1 = new pkgLib.PointLight( 0xff0040, 1, 10, 1);
light1.add( new pkgLib.Mesh( lightSphere, new pkgLib.MeshBasicMaterial( { color: 0xff0040 } ) ) );
light1.name = "littleLight"
light1.castShadow = true;
light1.shadow.camera.far = 100;
let light1Obj3d = new pkgLib.Object3D()
light1Obj3d.add(light1);
light1Obj3d.name = "lightObj";

//BLUE
var light2 = new pkgLib.PointLight( 0x0040ff,  7, 10, 2  );
light2.add( new pkgLib.Mesh( lightSphere, new pkgLib.MeshBasicMaterial( { color: 0x0040ff } ) ) );
light2.castShadow = true;
light2.shadow.camera.far = 100;
let light2Obj3d = new pkgLib.Object3D()
light2Obj3d.add(light2);

let clock = new pkgLib.Clock()

function update(time) {
    dt += time
    //cube.position.z = 10*Math.sin(1+dt)*time
    //cube.position.x = Math.cos(dt)*time
    //light1.position.x=10*Math.sin(1+dt)*time
    lightsObj3d.rotateY(rate*time)
    light1Obj3d.rotateX((rate*1.5)*time)
    light1Obj3d.rotateY((rate*1.5)*time)
    light1Obj3d.rotateZ((rate*1.5)*time)
    var time = Date.now() * 0.0005;
    var delta = clock.getDelta();

    cubeObj3d.rotateY(.01)

    light1.position.x = Math.sin( time * 0.7 ) * 2;
    light1.position.y = Math.cos( time * 0.5 ) * 1;
    light1.position.z = Math.cos( time * 0.3 ) * 1.5;


    light2.position.x = Math.sin( time * 0.7 ) * 5;
    light2.position.y = Math.cos( time * 0.5 ) * 5;
    light2.position.z = Math.cos( time * 0.3 ) * 5;

}


var thisSetup = new setupClass(
  {
    position: { x: 0, y: 10, z: 15 },
    update: (thisTime) => update(thisTime),
  });


lightsObj3d.position.set(0,2.5,0);
light1Obj3d.position.set(0,10,-2);

// adds our terrain and the spinning thing to the renderer
thisSetup.ObjectsToScene(cubeObj3d, lightsObj3d, light1Obj3d, light2Obj3d);
