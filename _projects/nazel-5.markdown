---
layout: post
author: Nico
title: Three Box Trail
thumbnail: Nico-W5.png
week-assignment: 5
---

<script src= "https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.js"></script>
<div class="grid-container" >
<div class="large-12 columns" >
    <div class="row" style = "padding: 1em;">
    </div>
    <div id="3dDiv">
    </div>
</div><!-- end gridcontainer-->

<script>
  var boxscene = new THREE.Scene();
  var overHeadCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  var basicRenderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.3dDiv.appendChild( renderer.domElement );


  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 5;

  function animate() {
	   requestAnimationFrame( animate );
	 renderer.render( scene, camera );
  }
  animate();
</script>
