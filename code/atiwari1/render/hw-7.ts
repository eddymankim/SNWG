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

function mapT(obj, fn) {
    if (obj.children) {
        for (let i = 0; i < obj.children.length; i++) {
            obj.children[i] = mapT(obj.children[i], fn);
        }
    };
    return fn(obj);
}


function set_material_deep(obj, mat) {
    if (obj.material) obj.material = mat;
    if (obj.children) {
        for (let child of obj.children) {
            set_material_deep(child, mat);
        }
    };
}


function set_edges_mat(obj) {
    if (obj.geometry) {
        let linegeom = new THREE.EdgesGeometry(obj.geometry, 30.0);
        let edges_mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        let edges = new THREE.LineSegments(linegeom, edges_mat);
        edges.position.copy(obj.position);
        edges.rotation.copy(obj.rotation);
        edges.scale.copy(obj.scale);
        return edges;
    } else {
        return obj;
    }

}

let load_cache = {};

async function load_collada(path): Promise<THREE.Scene> {
    if (load_cache[path] != undefined) {
        return load_cache[path].then(r => r.clone());
    }
    let resp = new Promise((res, rej) => {
        const loader = ColladaLoader();
        (loader as any).options.convertUpAxis = true;
        loader.load(data + path, (model) => {
            res(model.scene);
        }, (prog) => console.log(prog), (err) => rej(err));
    });
    load_cache[path] = resp;
    return resp as any;
}

function poly_corners(n, radius) {
    return new Array(n).fill(undefined)
        .map((x, i) =>
            new T.Vector3(Math.sin((i / n) * 2 * Math.PI) * radius, 0,
                Math.cos((i / n) * 2 * Math.PI)));
}

async function bathtub_fractal(depth, n, radius, scale) {
    let root = new T.Object3D();
    let name = bathtubs[Math.floor(Math.random() * bathtubs.length)];
    let bathtub = await load_collada(name);
    bathtub.name = name;
    // for some reason this resets all transforms ? so commented out for now
    /* set_material_deep(bathtub, new (THREE as any).MeshToonMaterial({
        color: new THREE.Color('red'),
        specular: new THREE.Color('blue')
    })); */

    //if (bathtub['scene']) root.add(bathtub['scene'])
    //else root.add(bathtub)
    if (depth == 0) return bathtub;
    root.add(bathtub)

    let corners = poly_corners(n, radius);
    let children = await Promise.all(new Array(n).fill(undefined).map(() => bathtub_fractal(depth - 1, n, radius, scale)));
    console.log(bathtub);
    children = children.map((x, i) => {
        x.position.add(corners[i]);
        if (i % 2) x.position.add(new T.Vector3(0, radius, 0));
        else x.position.sub(new T.Vector3(0, radius, 0))
        x.scale.set(scale, scale, scale);
        return x
    });
    root.add(...children);
    return root;
}

async function main() {
    let start = new THREE.Vector3(0, 0, 0);

    let fractal = await load_collada(bathtubs[1])// await bathtub_fractal(5, 4, 3, 0.6);
    fractal.add(await bathtub_fractal(5, 4, 3, 0.6));
    /*
    let axes = ['x', 'y', 'z'];

    function rotate(dt, thing, axisIdx) {
        let axis = axes[axisIdx % axes.length];
        thing.rotation[axis] += 0.001 * dt;
        for (let child of thing.children) {
            rotate(dt, child, axis + 1);
        }
    }

    function update(dt) {
        rotate(dt, fractal, 0);
    } */

    const renderer = new ToonRenderer({
        position: { x: 0, y: 1, z: 5 },
        update: (dt) => { },
        path: '../../data/atiwari1',
        width: 700,
        height: 700,
        elt: '#RenderCanvas'
    });
    console.log(fractal);
    renderer.add(fractal);
}

main();

window['THREE'] = THREE;