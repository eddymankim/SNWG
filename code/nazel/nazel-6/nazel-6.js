class getSetup{
  constructor( //this sets defualuts and sets up strucutre to change things from my Primary script when setup is called.
    {//Start Constructor input object
      id = "3dDiv",  //div to place render
      canvasSize = {w:500, h:500},
      renderer = { antialias: true, logarithmicDepthBuffer: true },
      ambient = 0x14031B,
      background = 0x5A7f8B, // ps 0x = # in hex colors
      webGlSettings = {antialias:true },
      fog = {color:0x4ae390, near:1, far: 1000},
      camImputs = {fov:60, aspect: canvasSize.h/canvasSize.w, near: 0.01, far: 10000},
      lightPrime = 0xb385da,
      position = { x:0, y:0, z:20 },
      updateFunction = (thisTime) => update(thisTime),
    }={}//end of constructor input Object
  ){//Start of Constructor Fucntion
    //User Slider Controls - probably other Stuff
    this.gui = new dat.GUI({ autoPlace: false });
    this.guiDiv = document.getElementById('my-gui-div');
    this.guiDiv.appendChild(this.gui.domElement);
    //This must be used in updates...
    this.clock = new THREE.Clock();
    //Set up Renderer
    this.renderer = new THREE.WebGLRenderer(webGlSettings);
    this.renderer.setSize(canvasSize.w, canvasSize.h);
    this.renderer.setPixelRatio(canvasSize.w/canvasSize.h);
    this.renderer.setClearColor(background, 0);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    //console.log(id);
    this.renderDiv = document.getElementById('3dDiv');  //id);//this is from input
    //Camera
    this.camera = new THREE.PerspectiveCamera(45, canvasSize.w/canvasSize.h, 1, 1000); //(fov,aspect,near, far)
    this.camera.position.set(...Object.values(position))
    //Navigation controls
    this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
    //scene (this is where all the stuff get packed in)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(...Object.values(fog));
    this.scene.add(new THREE.AmbientLight(ambient));
    this.scene.add(this.camera);
    this.renderDiv.appendChild(this.renderer.domElement);

    //this.ObjectsToScene = (...sceneElementArray) => for(let thisElement of sceneElementArray) {scene.add(thisElement)}//add element fucntion
    this.ObjectsToScene = (...sceneElementArray) => sceneElementArray.forEach(element => scene.add(element));

    const render = () => {
        requestAnimationFrame(render.bind(this))
        this.controls.update()
        update(this.clock.getDelta())
        this.renderer.render(this.scene, this.camera)
    }// I wish we could just call this.render somewhere else and feed it the update function...

  }//End of Constructor
}//end class


function update(time) {
    dt += time
}




var thisSetup = new getSetup({update: (thisTime) => update(thisTime),});
//make some geometry
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
cube.castShadows = true;
thisSetup.scene.add( cube );
thisSetup.renderer.render(thisSetup.scene, thisSetup.camera);
//thisSetup.render()
