///
/// Week 6 Post
/// This week was a real Fail
/// patched together by nico
///
import * as pkgLib from '../../lib/module.js'
//import * as colorName from '../nazel-snips/randomCssColors.js'
import colorName from '../nazel-snips/randomColors.js'

var modelsInfo = {
    "modelNames": [
        "Low_Poly_Grass_002",
        "Low_Poly_Tree_001",
        "Low_Poly_Tree_002",
        "Low_Poly_Tree_003",
        "Low_Poly_Tree_004",
        "Low_Poly_Tree_005",
        "Low_Poly_Tree_006",
        "Low_Poly_Tree_Stump_001",
        "Low_Poly_Tree_Stump_002",
        "Low_Poly_Bush_001",
        "Low_Poly_Bush_002"
      ],
      "endings":{
        "model":".obj",
        "material":".mtl"
      }
  }


// you should rename this to match your own renderer
//import setupClass from 'nazel-6-renderer.js'
class setupClass {
    constructor(
      { // Constructor inputs
            path = '../../data/',
            width = 500,
            height = 500,
            background = 0xf6e4f3,
            ambient = 0x14031B,
            light = 0xFEEBC1,
            ground = 0xF2E9CF,
            webgl = { antialias: true, shadowMapEnabled: true },
            position = { x:0, y:0, z:0 },
            fog = { color: 0x63686a, near: 0, far: 1000 },
            cam = { fov: 60, aspect: width/height, near: 0.1, far: 2e4 },
            update = (time) => { },
      }={})
      { //Start of Constructor function



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
            //camera.position.set(...Object.values(position))
            camera.position.x = 0;
            camera.position.y = 50;
            camera.position.z = 0;
            var lookAtVector = new THREE.Vector3(0,4,20);
            //camera.lookAt(lookAtVector);
            scene.add(camera)


				let hemiLight = new pkgLib.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
				hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 500, 0 );
				scene.add( hemiLight );
        //let sun = new pkgLib.HemisphereLight(light, ground, 0.5)
        //    sun.position.set(1,2,0)
        //    scene.add(sun)

        let controls = new pkgLib.OrbitControls(camera,renderer.domElement)

        this.ObjectsToScene = (...things) => things.forEach(o => scene.add(o))
        //this.ThingyToScene = function(thingy){scene.add(...thingy);};


        const render = () => {
            requestAnimationFrame(render.bind(this))
            controls.update()
            update(clock.getDelta())
            renderer.render(scene, camera)
            if (camera.position.z >-300){
            camera.position.z-=.5
            }
            else{camera.position.z=0}
            //var lookAtVector = new THREE.Vector3(0,4,camera.position.z);
            //camera.lookAt(0,0,);
            let x = camera.position.x
            let y = camera.position.y
            let z = camera.position.z
            controls.target.set(x,y-40,z)
        }


        const resize = () => {
            //amera.aspect = 500 / 500
          //  camera.updateProjectionMatrix()
            //renderer.setSize(500, 500)
        }


        window.addEventListener('resize', resize, false);
        window.addEventListener('load', () => render(), false);
        let div = document.getElementById('3dDiv')
        div.appendChild(renderer.domElement)
    }//end constructor
}//end of class

//let gui = new dat.GUI({ autoPlace: false, height : 40});
//let guiDiv = document.getElementById('my-gui-div');
//guiDiv.appendChild(gui.domElement);
//var RateOb = {rate:4};
//gui.add(RateOb, "rate");
let clock = new pkgLib.Clock()


// a "terrain" and a "thing", our object containers

var objectArray = [];
var objectUpdates = [];
// a rate of rotation and delta time
let rate = 3;
let dt = 5;

function update(time) {
    dt += time
    var time = Date.now() * 0.0005;

}


var renderer = new setupClass(
  {
    position: { x: 0, y: 10, z: 15 },
    update: (thisTime) => update(thisTime),
  });

// adds our terrain and the spinning thing to the renderer
//renderer.ObjectsToScene();
//renderer.ObjectsToScene(cubeObj3d, lightsObj3d, light1Obj3d, light2Obj3d);


var modelPath = '../../../code/nazel/model/forestAssets/';
var modelRefData = modelPath+'models.json';

console.log(modelsInfo.modelNames[4]+modelsInfo.endings.model)
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath( modelPath );
mtlLoader.setPath(  modelPath );
//var url = "male02_dds.mtl";
for (let j = 0; j<60;j++){
  for(let i=0; i<10; i++){
var url = modelsInfo.modelNames[i]+modelsInfo.endings.material
mtlLoader.load( url, function( materials ) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( modelPath );
    objLoader.load( modelsInfo.modelNames[i]+modelsInfo.endings.model, function ( object ) {

      object.position.z = pkgLib.random(20,-300);
      object.position.x = pkgLib.random(-20,20);
        renderer.ObjectsToScene(object);

    } );
});
}
}
