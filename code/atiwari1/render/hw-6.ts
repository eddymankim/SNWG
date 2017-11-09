import * as THREE from 'three';

import { ColladaLoader } from './ColladaLoader.js'
import ToonRenderer from './render-toon.js'

const T = THREE;

function r2d(deg) {
    return deg / 57.2958;
}

const basis = new THREE.Vector3(4.0, 0.0, 0.0);
const right = basis.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), r2d(30))
const down = right.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), r2d(60));
const data = '/data/atiwari1/models/'

const h = Math.sqrt(3);

const bathtubs = `Antique+Bathtub
Basic
Bathtub
BATHTUB+DROPIN
Cabrits
Marlborough
monaco
monaco (1)
Nordhem_Apelviken_w_Tjorn
Onsen
onsen_vasca
SketchupPersonalProject
Urquiola`.split('\n').map(x => 'bathtubs/' + x + '/model.dae');

console.log(bathtubs)

function hexagon_geometry(width = 1.0, height = 1.0) {
    let points = [new THREE.Vector3(width, 0.0),
    new THREE.Vector3(width, height)];
    return new THREE.LatheBufferGeometry(points, 6);
}

function hexagon(width = 1.0, height = 1.0) {
    let geom = hexagon_geometry(width, height);
    let linegeom = new THREE.EdgesGeometry(geom, 30.0);
    let edges_mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    let edges = new THREE.LineSegments(linegeom, edges_mat);
    // ffs !!
    return edges

}

async function load_collada(path): Promise<THREE.ColladaModel> {
    let resp = new Promise((res, rej) => {
        //@ts-ignore
        const loader = ColladaLoader();
        (loader as any).options.convertUpAxis = true;
        loader.load(data + path, (model) => {
            res(model);
        }, (prog) => console.log(prog), (err) => rej(err));
    });
    return resp as any;
}


function hexgrid() {
    let hexes = [];
    let start = basis.clone().sub(down.clone().multiplyScalar(h))
        .sub(right.clone().multiplyScalar(h))
        ; //.add(down.clone().multiplyScalar(2.0));
    let downr3 = down.clone().multiplyScalar(h);
    for (let i = -5; i < 5; i++) {
        let curr = start.clone();
        if (i % 2 == 1) {
            curr.sub(downr3);
        }
        for (let j = -5; j < 5; j++) {
            let hex = hexagon(2 * h, 4).rotateOnAxis(new THREE.Vector3(0, 1, 0), r2d(30));
            hex.position.add(curr);
            curr.add(downr3)
            hexes.push(hex);
        }
        start.add(right.clone().multiplyScalar(h));
    }
    return hexes;
}

function hexagons() {
    let start = new THREE.Vector3(0, 0, 0);
    let hexes = [];
    for (let i = 0; i < 6; i++) {
        let pos = start.clone().add(basis).applyAxisAngle(new THREE.Vector3(0, 1, 0), r2d(i * 60 + 30));
        let hex = hexagon(2, 2);
        hex.position.add(pos);
        hexes.push(hex);
    }
    hexes.push(hexagon(2, 2));
    return hexes;
}


function set_material_deep(obj, mat) {
    if (obj.material) obj.material = mat;
    if (obj.children) {
        for (let child of obj.children) {
            set_material_deep(child, mat);
        }
    };
}

async function main() {
    let start = new THREE.Vector3(0, 0, 0);

    const renderer = new ToonRenderer({
        position: { x: 0, y: 1, z: 5 },
        update: function (dt) { },
        path: '../../data/atiwari1',
        width: 700,
        height: 700,
        elt: '#RenderCanvas'
    });

    renderer.add(...hexgrid());
    let col = await load_collada(bathtubs[0]);
    console.log(col);
    col.scene.position.set(basis.x, 0, basis.z);
    renderer.add(col.scene);

    let first_ring = bathtubs.slice(1, 7);
    let tubstart = col.scene.position.clone().add(down.clone().multiplyScalar(h));
    first_ring.map((name, i) => {
        load_collada(name).then(col => {
            let pos = tubstart.clone().add(basis.clone().multiplyScalar(h)).applyAxisAngle(new THREE.Vector3(0, 1, 0), r2d(i * 60));
            col.scene.position.add(pos);
            if (col === undefined) {
                console.log(name);
            }

            for (let roots of col.scene.children) {
                set_material_deep(roots, new (THREE as any).MeshToonMaterial({
                    color: new THREE.Color('red'),
                    specular: new THREE.Color('blue')
                }))
            }

            let light = new THREE.PointLight();
            light.position.add(pos).add(new THREE.Vector3(0, 2, 0));
            return [col.scene, light];
        }).then((model) => renderer.add(...model));
    });
}

main();

window['THREE'] = THREE;