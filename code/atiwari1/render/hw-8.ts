import * as THREE from 'three';

import TechnicalRender from './render-technical.js'

const T = THREE;

function r2d(deg) {
    return deg / 57.2958;
}

function plane() {
    let geometry = new T.PlaneBufferGeometry(300, 300, 4, 4);
    let material = new T.MeshBasicMaterial({ color: 0xff0000, side: T.DoubleSide, transparent: true, opacity: 0.3 });
    /*material.blending = THREE.;
    material.blendEquation = THREE.AddEquation; //default
    material.blendSrc = THREE.SrcColorFactor; //default
    material.blendDst = THREE.OneMinusDstAlphaFactor; //default*/

    let plane = new T.Mesh(geometry, material);
    plane.rotateX(r2d(90));
    return plane
}

function planes() {
    let top = plane();
    let mid = plane();
    let bot = plane();
    top.position.add(new T.Vector3(0, 100, 0));
    bot.position.add(new T.Vector3(0, -100, 0));
    let root = new T.Object3D();
    (mid.material as THREE.MeshBasicMaterial).opacity = 0.1;
    (bot.material as THREE.MeshBasicMaterial).opacity = 0.1;
    root.add(top, mid, bot);
    return root;
}

function spline2geom(curve, samples = 200) {
    let path = new THREE.Path(curve.getSpacedPoints(samples));

    let geometry = path.createPointsGeometry(samples);
    let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    return new THREE.Line(geometry, material);
}

function lerp(t, v1, v2) {
    return v2.clone().multiplyScalar(t).add(v1.clone().multiplyScalar(1 - t));
}

function two2threeOnY(v, y) {
    return new T.Vector3(v.x, y, v.y);
}

function splines() {
    let top = new T.SplineCurve([
        new T.Vector2(-100, 0),
        new T.Vector2(0, 100),
        new T.Vector2(100, 0),
        new T.Vector2(0, -100)
    ]);;
    let mid = new T.SplineCurve([
        new T.Vector2(-100, 100),
        new T.Vector2(100, 100),
        new T.Vector2(100, -100),
        new T.Vector2(-100, -100)
    ]);
    let bot = new T.SplineCurve([
        new T.Vector2(-100, 100),
        new T.Vector2(100, 100),
        new T.Vector2(100, -100),
        new T.Vector2(-100, -100)
    ].map(x => x.add(new T.Vector2(100, 100))));

    function sample(u, v) {
        if (v < 1 / 2) {
            let vs = v * 2;
            return lerp(vs, two2threeOnY(bot.getPoint(u), -100), two2threeOnY(mid.getPoint(u), 0));
        } else {
            let vs = (v - (1 / 2)) * 2;
            return lerp(vs, two2threeOnY(mid.getPoint(u), 0), two2threeOnY(top.getPoint(u), 100));
        }
    }

    let para = new T.ParametricGeometry(sample, 10, 10);
    let mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: T.DoubleSide });
    return [
        spline2geom(top).rotateX(r2d(90)).translateZ(-150),
        spline2geom(mid).rotateX(r2d(90)),
        spline2geom(bot).rotateX(r2d(90)).translateZ(150),
        new THREE.Mesh(para, mat)
    ]
}

async function main() {
    let start = new THREE.Vector3(0, 0, 0);

    const renderer = new TechnicalRender({
        background: 0x0000ff,
        position: { x: 30, y: 100, z: 100 },
        update: (dt) => { },
        path: '../../data/atiwari1',
        width: 700,
        height: 700,
        elt: '#RenderCanvas',
        cam: { near: -2000, far: 2000 }
    });
    renderer.camera.lookAt(new T.Vector3(0, 0, 0));
    renderer.add(planes());
    renderer.add(...splines());
}

main();

window['THREE'] = THREE;