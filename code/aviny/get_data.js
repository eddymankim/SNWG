function deg(degrees){
    return degrees/180*Math.PI;
}

var count = 0;
var res;
var statuses = [];
var filtered;
var mounds = [];

function getNextResults(response){
    console.log(response);
    for(i=0;i<response.statuses.length;i++){
        statuses.push(response.statuses[i].text);
    }
    if (count==9) {
        processStatuses();
        return;
    }
    var next = response.search_metadata.next_results;
    res.get('https://api.twitter.com/1.1/search/tweets.json' + next).done(getNextResults);
    count++;
}


function processStatus(word) {
    return word.toLowerCase().replace(/[.,\/!$%\^&\*;:{}=\-_`~()…"”“'']/g,"");
}

function processStatuses(){
    console.log(statuses);
    counts = {};
    for (i = 0; i < statuses.length; i++) {
        var str = processStatus(statuses[i]);
        var res = str.split(/[ \n\r]+/);
        for (j = 0; j < res.length; j++) {
            if (!counts.hasOwnProperty(res[j])) {
                counts[res[j]] = 0;
            }
            counts[res[j]] += 1;
        }
    }
    var obj = counts;
    var array = [];
    for (var key in obj) {
      array.push({
        name: key,
        value: obj[key]
      });
    }

    var sorted = array.sort(function(a, b) {
      return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
    });
    console.log(sorted);

    var set = {};
    for(i=0;i<blacklist.length;i++){
        set[blacklist[i]] = true;
    }
    //console.log(blacklist);

    filtered = sorted.filter(function(a){
        if (!set.hasOwnProperty(a.name)) {
                return true;
        } else {
            return false;
        }
    });
    console.log(filtered);
    onReady();
}

OAuth.initialize('6YTU1lAySWicuUxo-t2yE0aFhm0')
OAuth.popup('twitter').done(function(result) {
    console.log(result)
    res = result;
    result.get('https://api.twitter.com/1.1/search/tweets.json?q=%40realDonaldTrump&count=100')
    .done(getNextResults)

    .fail(function (err) {
        //handle error with err
    });
});

var cubeBumpMaterial2 = new THREE.MeshPhongMaterial({color: 'yellow'});
var mound;
var objLoader = new THREE.OBJLoader();


objLoader.load('../aviny/models/mound.obj', function (obj) {
    obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = cubeBumpMaterial2;
        }
    });
    mound = obj;
});

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var container = document.createElement( 'div' );
document.body.appendChild( container );

var font;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 35, window.innerWidth/600, 0.0001, 5000);
// camera.position.set(1000000,1000000,1000000);
camera.rotation.set(deg(90),0,-20);

scene.add( camera );
camera.position.set(10,10,0);
camera.up.set(0,0,1);
camera.lookAt(0,0,0);

// controls = new THREE.PointerLockControls( camera );
var controls = new THREE.OrbitControls( camera );
// controls.autoRotate = false;

var light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

var raycaster = new THREE.Raycaster();



renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0);
renderer.setSize( window.innerWidth, 600 );
container.appendChild( renderer.domElement );
onWindowResize();

var loader = new THREE.FontLoader();
loader.load( '../aviny/helvetica.json', function ( font_a ) {
    font = font_a;
} ); //end load function

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
}

function render() {
    renderer.render( scene, camera );
}

function N(mean,variance){
    var u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    var phi = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return phi*Math.sqrt(variance)+mean;
}

function U(a,b){
    return Math.random()*(b-a)+a;
}

function onReady() {
    // mound.position.set(0,50,0);
    // mound.scale.set(1,2,3);
    // mounds.push(mound);
    // mound.updateMatrixWorld();
    // scene.add(mound);
    // scene.add(copy);
    for(i=filtered.length-1;i>filtered.length-20;i--){
        var copy = mound.clone();
        var radius = 2000*N(1,0.3)/filtered[i].value;
        var theta = U(0, deg(360));

        var xCoor = radius*Math.cos(theta);
        var yCoor = radius*Math.sin(theta);

        var Sx = N(0.5, 0.1)*Math.log(filtered[i].value);
        var Sy = N(0.5, 0.1)*Math.log(filtered[i].value);
        var Sz = N(0.5, 0.1)*Math.log(filtered[i].value);

        copy.position.set(xCoor,yCoor,0);
        copy.scale.set(Sx,Sy,Sz);
        copy.updateMatrixWorld();
        mounds.push(copy);

        var xMid, text;
        var textShape = new THREE.BufferGeometry();
        var color = 0x006699;
        var matDark = new THREE.LineBasicMaterial( {
            color: color,
            side: THREE.DoubleSide
        } );
        var matLite = new THREE.MeshBasicMaterial( {
            color: color,
            side: THREE.DoubleSide
        } );
        var message =  filtered[i].name;
        var shapes = font.generateShapes( message, 100, 2 );
        var geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        // make shape ( N.B. edge view not visible )
        textShape.fromGeometry( geometry );
        text = new THREE.Mesh( textShape, matLite );
        text.rotation.set(deg(90),deg(180)+deg(N(0,2)),0);
        text.scale.set(0.0125,0.0125,0.0125);
        text.position.set(xCoor, yCoor, Sz*10+2);
        scene.add( text );

    }

    for(i=0;i<100;i++){
        var vecs = [];
        var vecs2 = [];
        for(j=0;j<20;j++){
            var ip = i*2-100;
            var jp = j*10-100;
            raycaster.ray.origin.set(ip,jp,200);
            raycaster.ray.direction.set(0,0,-1);
            var intersects = raycaster.intersectObjects(mounds,true);
            if(intersects.length > 0){
                vector = intersects[0].point;
                // console.log(vector);
            } else {
                vector = new THREE.Vector3(ip,jp,0);
            }
            vecs.push(vector);
            // var copy = new THREE.Vector3(vector.y, vector.x, vector.z);
            // vecs2.push(copy);
        }
        var curve = new THREE.CatmullRomCurve3(vecs);
        var points = curve.getPoints(1000);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({color: 0xff0000});
        var splineObject = new THREE.Line( geometry, material );
        // splineObject.rotation.set(deg(-90),deg(0),deg(0));
        scene.add(splineObject);
        //scene.lookAt(splineObject);

        // var curve2 = new THREE.CatmullRomCurve3(vecs2);
        // var points2 = curve2.getPoints(1000);
        // var geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        // var material2 = new THREE.LineBasicMaterial({color: 0x00ff00});
        // var splineObject2 = new THREE.Line( geometry2, material2 );
        // // splineObject.rotation.set(deg(-90),deg(0),deg(0));
        // scene.add(splineObject2);
        //scene.lookAt(splineObject);
    }
}

animate();
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
