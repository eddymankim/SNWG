import * as THREE from 'three';

import TechnicalRender from './render-technical.js'

(window as any).THREE = THREE;

let vox = (window as any).vox;

async function main() {
    let parser = new (vox as any).Parser();
    let voxelData = await parser.parse('/data/atiwari1/Palace3.vox');
    var param = { voxelSize: 5 };
    var builder = new (vox as any).MeshBuilder(voxelData, {
        voxelSize: 5
    });
    var mesh = builder.createMesh();

    const renderer = new TechnicalRender({
        background: 0x0000ff,
        position: { x: 30, y: 100, z: 1000 },
        update: (dt) => { },
        path: '../../data/atiwari1',
        width: 700,
        height: 700,
        elt: '#RenderCanvas',
        cam: { near: 0.1, far: 2000 }
    });

    renderer.add(mesh);
}

main();


/*
const T = THREE;

function r2d(deg) {
    return deg / 57.2958;
}

let n_tiles = 16;


type soup_bit = boolean[] // possiblilities for any 1 tile
type soup_t = soup_bit[][] // total soup

type tile_t = {
    name: string,
    type: string[]
    rotation: number;
    adj_h: tile_t[] // what tile can it be adjacent to
    adj_v: tile_t[] // tiles it can be above
}



function enum_tiles(tiles: tile_t[]) {
    let num_map = new Map
    for (let i = 0; i < tiles.length; i++) {
        num_map.set(tiles[i], )
    }
}
function set_soup(s: soup_bit, v) {
    for (var i = 0; i < s.length; i++) {
        s[i] = v;
    }
    return s;
}

// adapted from 
// https://github.com/mikolalysenko/ndarray-experiments/blob/master/multi_typed.js 
// (MIT)
function make_soup(n_tiles, nx, ny, nz) {
    var result = new Array(nx);
    for (var i = nx - 1; i >= 0; --i) {
        var ri = new Array(ny);
        result[i] = ri;
        for (var j = ny - 1; j >= 0; --j) {
            ri[j] = new Array(nz);
        }
    }


    for (var i = nx - 1; i >= 0; --i) {
        for (var j = ny - 1; j >= 0; --j) {
            for (var k = 0; k < nz; k++) {
                result[i][j] = set_soup(result[i][j], true);
            }
        }
    }

    return result;
}


function constraint_checker(adjacency: tile_t[]) {
    let constraints: Map<tile_t, tile_t[]> = new Map();
    for (let tile of adjacency) {

    }
    let cs = new Uint32Array(adjacency.length).fill(0);
    for (let i = 0; i < cs.length; i++) {
        cs[i] = arr2bit(adjacency[i]);
    }
    function is_ok(i, j) {
        return (cs[i] >> j) & 0x1;
    }
    return is_ok;
}



function check_constraint(tile1, tile1_rot, tile2, tile2_rot) {

}

function arr2bit(arr: boolean[]) {
    if (arr.length < 32) {
        arr = arr.concat(new Array(32 - arr.length).fill(false));
    } else if (arr.length > 32) {

    }
    let res = 0x0;
    for (let i = 0; i < 32; i++) {
        res |= arr[i] ? 0x1 << i : 0;
    }
    return res;
}

function failed(arr) {
    for (var x of arr) {
        for (var y of x) {
            for (var z of y) {
                if (z == 0) { return true }
            }
        }
    }
    return false
}

function solve(soup, pq) {
    if (failed(soup)) return false;


}

class Node<T> {
    public value: T;
    public priority: number;

    constructor(val: T, priority: number) {
        this.value = val;
        this.priority = priority;
    }
}

class PriorityQueue<T> {
    private heap: Node<T>[];
    constructor() {
        this.heap = [null]
    }

    insert(value: T, priority) {
        const newNode = new Node(value, priority);
        this.heap.push(newNode);
        let currentNodeIdx = this.heap.length - 1;
        let currentNodeParentIdx = Math.floor(currentNodeIdx / 2);
        while (
            this.heap[currentNodeParentIdx] &&
            newNode.priority > this.heap[currentNodeParentIdx].priority
        ) {
            const parent = this.heap[currentNodeParentIdx];
            this.heap[currentNodeParentIdx] = newNode;
            this.heap[currentNodeIdx] = parent;
            currentNodeIdx = currentNodeParentIdx;
            currentNodeParentIdx = Math.floor(currentNodeIdx / 2);
        }
    }

    remove() {
        if (this.heap.length < 3) {
            const toReturn = this.heap.pop();
            this.heap[0] = null;
            return toReturn;
        }
        const toRemove = this.heap[1];
        this.heap[1] = this.heap.pop();
        let currentIdx = 1;
        let [left, right] = [2 * currentIdx, 2 * currentIdx + 1];
        let currentChildIdx = this.heap[right] && this.heap[right].priority >= this.heap[left].priority ? right : left;
        while (this.heap[currentChildIdx] && this.heap[currentIdx].priority <= this.heap[currentChildIdx].priority) {
            let currentNode = this.heap[currentIdx]
            let currentChildNode = this.heap[currentChildIdx];
            this.heap[currentChildIdx] = currentNode;
            this.heap[currentIdx] = currentChildNode;
        }
        return toRemove;
    }

}





function plane() {
    let geometry = new T.PlaneBufferGeometry(300, 300, 4, 4);
    let material = new T.MeshBasicMaterial({ color: 0xff0000, side: T.DoubleSide, transparent: true, opacity: 0.3 });
    /*material.blending = THREE.;
    material.blendEquation = THREE.AddEquation; //default
    material.blendSrc = THREE.SrcColorFactor; //default
    material.blendDst = THREE.OneMinusDstAlphaFactor; //default*/
/*
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

function splines(top?, mid?, bot?) {
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

function main() {
    let start = new THREE.Vector3(0, 0, 0);

    let defaultTop = [
        new T.Vector2(-100, 0),
        new T.Vector2(0, 100),
        new T.Vector2(100, 0),
        new T.Vector2(0, -100)
    ];

    const renderer = new TechnicalRender({
        background: 0x0000ff,
        position: { x: 30, y: 100, z: 1000 },
        update: (dt) => { },
        path: '../../data/atiwari1',
        width: 700,
        height: 700,
        elt: '#RenderCanvas',
        cam: { near: 0.1, far: 2000 }
    });
    let splinesRoot = new T.Object3D();
    splinesRoot.add(...splines());
    renderer.camera.lookAt(new T.Vector3(0, 0, 0));
    renderer.add(planes());
    renderer.add(splinesRoot);

    let mouse = new THREE.Vector2();
    const raycaster = new T.Raycaster();

    document.addEventListener("mousemove", (evt: MouseEvent) => {
        mouse.x = (evt.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    });

    document.addEventListener("click", (evt: MouseEvent) => {
        raycaster.setFromCamera(mouse, renderer.camera);
        let intersects = raycaster.intersectObject(splinesRoot, true);
        if (intersects.length > 0) {
            evt.preventDefault();
            let first = intersects[0];
            defaultTop.shift();
            defaultTop.push(new T.Vector2(first.point.x, first.point.z));
            renderer.scene.remove(splinesRoot);
            splinesRoot = new T.Object3D();
            splinesRoot.add(...splines(defaultTop));
            renderer.add(splinesRoot);
            console.log(first.point);


        }
    })
}

main();

window['THREE'] = THREE;
*/