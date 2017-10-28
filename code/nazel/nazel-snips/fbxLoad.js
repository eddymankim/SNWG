var manager = new THREE.LoadingManager();
manager.onProgress = function( item, loaded, total ) {
  console.log( item, loaded, total );
};
var onProgress = function( xhr ) {
  if ( xhr.lengthComputable ) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
  }
};



var onError = function( xhr ) {
  console.error( xhr );
};

var mixers = [];
var loader = new THREE.FBXLoader( manager );
loader.load( '../models/animatedCharacterFBX/low-poly-birdg-animated/source/Bird_asset.fbx', function( object ) {
      object.mixer = new THREE.AnimationMixer( object );
      mixers.push( object.mixer );
      var action = object.mixer.clipAction( object.animations[ 0 ] );
      action.play();
      scene.add( object );
    }, onProgress, onError );


    loader.load( 'models/fbx/nurbs.fbx', function( object ) {
      scene.add( object );
    }, onProgress, onError );
