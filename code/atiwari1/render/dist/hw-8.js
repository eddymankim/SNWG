import * as THREE from '../../../lib/module.js';
import TechnicalRender from './render-technical.js';
var T = THREE;
function r2d(deg) {
    return deg / 57.2958;
}
function plane() {
    var geometry = new T.PlaneBufferGeometry(300, 300, 4, 4);
    var material = new T.MeshBasicMaterial({ color: 0xff0000, side: T.DoubleSide, transparent: true, opacity: 0.3 });
    /*material.blending = THREE.;
    material.blendEquation = THREE.AddEquation; //default
    material.blendSrc = THREE.SrcColorFactor; //default
    material.blendDst = THREE.OneMinusDstAlphaFactor; //default*/
    var plane = new T.Mesh(geometry, material);
    plane.rotateX(r2d(90));
    return plane;
}
function planes() {
    var top = plane();
    var mid = plane();
    var bot = plane();
    top.position.add(new T.Vector3(0, 100, 0));
    bot.position.add(new T.Vector3(0, -100, 0));
    var root = new T.Object3D();
    mid.material.opacity = 0.1;
    bot.material.opacity = 0.1;
    root.add(top, mid, bot);
    return root;
}
function spline2geom(curve, samples) {
    if (samples === void 0) { samples = 200; }
    var path = new THREE.Path(curve.getSpacedPoints(samples));
    var geometry = path.createPointsGeometry(samples);
    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    return new THREE.Line(geometry, material);
}
function lerp(t, v1, v2) {
    return v2.clone().multiplyScalar(t).add(v1.clone().multiplyScalar(1 - t));
}
function two2threeOnY(v, y) {
    return new T.Vector3(v.x, y, v.y);
}
function splines(top, mid, bot) {
    top = new T.SplineCurve(top || [
        new T.Vector2(-100, 0),
        new T.Vector2(0, 100),
        new T.Vector2(100, 0),
        new T.Vector2(0, -100)
    ]);
    mid = new T.SplineCurve(mid || [
        new T.Vector2(-100, 100),
        new T.Vector2(100, 100),
        new T.Vector2(100, -100),
        new T.Vector2(-100, -100)
    ]);
    bot = new T.SplineCurve(bot || [
        new T.Vector2(-100, 100),
        new T.Vector2(100, 100),
        new T.Vector2(100, -100),
        new T.Vector2(-100, -100)
    ].map(function (x) { return x.add(new T.Vector2(100, 100)); }));
    function sample(u, v) {
        if (v < 1 / 2) {
            var vs = v * 2;
            return lerp(vs, two2threeOnY(bot.getPoint(u), -100), two2threeOnY(mid.getPoint(u), 0));
        }
        else {
            var vs = (v - (1 / 2)) * 2;
            return lerp(vs, two2threeOnY(mid.getPoint(u), 0), two2threeOnY(top.getPoint(u), 100));
        }
    }
    var para = new T.ParametricGeometry(sample, 10, 10);
    var mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: T.DoubleSide });
    return [
        spline2geom(top).rotateX(r2d(90)).translateZ(-150),
        spline2geom(mid).rotateX(r2d(90)),
        spline2geom(bot).rotateX(r2d(90)).translateZ(150),
        new THREE.Mesh(para, mat)
    ];
}
function main() {
    var start = new THREE.Vector3(0, 0, 0);
    var defaultTop = [
        new T.Vector2(-100, 0),
        new T.Vector2(0, 100),
        new T.Vector2(100, 0),
        new T.Vector2(0, -100)
    ];
    var renderer = new TechnicalRender({
        background: 0x0000ff,
        position: { x: 30, y: 100, z: 1000 },
        update: function (dt) { },
        path: '../../data/atiwari1',
        width: 700,
        height: 700,
        elt: '#RenderCanvas',
        cam: { near: 0.1, far: 2000 }
    });
    var splinesRoot = new T.Object3D();
    splinesRoot.add.apply(splinesRoot, splines());
    renderer.camera.lookAt(new T.Vector3(0, 0, 0));
    renderer.add(planes());
    renderer.add(splinesRoot);
    var mouse = new THREE.Vector2();
    var raycaster = new T.Raycaster();
    document.addEventListener("mousemove", function (evt) {
        mouse.x = (evt.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    });
    document.addEventListener("click", function (evt) {
        raycaster.setFromCamera(mouse, renderer.camera);
        var intersects = raycaster.intersectObject(splinesRoot, true);
        if (intersects.length > 0) {
            evt.preventDefault();
            var first = intersects[0];
            defaultTop.shift();
            defaultTop.push(new T.Vector2(first.point.x, first.point.z));
            renderer.scene.remove(splinesRoot);
            splinesRoot = new T.Object3D();
            splinesRoot.add.apply(splinesRoot, splines(defaultTop));
            renderer.add(splinesRoot);
            console.log(first.point);
        }
    });
}
main();
window['THREE'] = THREE;
//# sourceMappingURL=hw-8.js.map
