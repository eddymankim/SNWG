var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as THREE from '../../../lib/module.js';
import { ColladaLoader } from './ColladaLoader.js';
import ToonRenderer from './render-toon.js';
var T = THREE;
function r2d(deg) {
    return deg / 57.2958;
}
var basis = new THREE.Vector3(4.0, 0.0, 0.0);
var right = basis.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), r2d(30));
var down = right.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), r2d(60));
var data = '/data/atiwari1/models/';
var h = Math.sqrt(3);
var bathtubs = "Antique+Bathtub\nBasic\nBathtub\nBATHTUB+DROPIN\nCabrits\nMarlborough\nmonaco\nmonaco (1)\nNordhem_Apelviken_w_Tjorn\nOnsen\nonsen_vasca\nSketchupPersonalProject\nUrquiola".split('\n').map(function (x) { return 'bathtubs/' + x + '/model.dae'; });
console.log(bathtubs);
function hexagon_geometry(width, height) {
    if (width === void 0) { width = 1.0; }
    if (height === void 0) { height = 1.0; }
    var points = [new THREE.Vector3(width, 0.0),
        new THREE.Vector3(width, height)];
    return new THREE.LatheBufferGeometry(points, 6);
}
function hexagon(width, height) {
    if (width === void 0) { width = 1.0; }
    if (height === void 0) { height = 1.0; }
    var geom = hexagon_geometry(width, height);
    var linegeom = new THREE.EdgesGeometry(geom, 30.0);
    var edges_mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    var edges = new THREE.LineSegments(linegeom, edges_mat);
    // ffs !!
    return edges;
}
function load_collada(path) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            resp = new Promise(function (res, rej) {
                //@ts-ignore
                var loader = ColladaLoader();
                loader.options.convertUpAxis = true;
                loader.load(data + path, function (model) {
                    res(model);
                }, function (prog) { return console.log(prog); }, function (err) { return rej(err); });
            });
            return [2 /*return*/, resp];
        });
    });
}
function hexgrid() {
    var hexes = [];
    var start = basis.clone().sub(down.clone().multiplyScalar(h))
        .sub(right.clone().multiplyScalar(h)); //.add(down.clone().multiplyScalar(2.0));
    var downr3 = down.clone().multiplyScalar(h);
    for (var i = -5; i < 5; i++) {
        var curr = start.clone();
        if (i % 2 == 1) {
            curr.sub(downr3);
        }
        for (var j = -5; j < 5; j++) {
            var hex = hexagon(2 * h, 4).rotateOnAxis(new THREE.Vector3(0, 1, 0), r2d(30));
            hex.position.add(curr);
            curr.add(downr3);
            hexes.push(hex);
        }
        start.add(right.clone().multiplyScalar(h));
    }
    return hexes;
}
function hexagons() {
    var start = new THREE.Vector3(0, 0, 0);
    var hexes = [];
    for (var i = 0; i < 6; i++) {
        var pos = start.clone().add(basis).applyAxisAngle(new THREE.Vector3(0, 1, 0), r2d(i * 60 + 30));
        var hex = hexagon(2, 2);
        hex.position.add(pos);
        hexes.push(hex);
    }
    hexes.push(hexagon(2, 2));
    return hexes;
}
function set_material_deep(obj, mat) {
    if (obj.material)
        obj.material = mat;
    if (obj.children) {
        for (var _i = 0, _a = obj.children; _i < _a.length; _i++) {
            var child = _a[_i];
            set_material_deep(child, mat);
        }
    }
    ;
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var start, renderer, col, first_ring, tubstart;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = new THREE.Vector3(0, 0, 0);
                    renderer = new ToonRenderer({
                        position: { x: 0, y: 1, z: 5 },
                        update: function (dt) { },
                        path: '../../data/atiwari1',
                        width: 700,
                        height: 700,
                        elt: '#RenderCanvas'
                    });
                    renderer.add.apply(renderer, hexgrid());
                    return [4 /*yield*/, load_collada(bathtubs[0])];
                case 1:
                    col = _a.sent();
                    console.log(col);
                    col.scene.position.set(basis.x, 0, basis.z);
                    renderer.add(col.scene);
                    first_ring = bathtubs.slice(1, 7);
                    tubstart = col.scene.position.clone().add(down.clone().multiplyScalar(h));
                    first_ring.map(function (name, i) {
                        load_collada(name).then(function (col) {
                            var pos = tubstart.clone().add(basis.clone().multiplyScalar(h)).applyAxisAngle(new THREE.Vector3(0, 1, 0), r2d(i * 60));
                            col.scene.position.add(pos);
                            if (col === undefined) {
                                console.log(name);
                            }
                            for (var _i = 0, _a = col.scene.children; _i < _a.length; _i++) {
                                var roots = _a[_i];
                                set_material_deep(roots, new THREE.MeshToonMaterial({
                                    color: new THREE.Color('red'),
                                    specular: new THREE.Color('blue')
                                }));
                            }
                            var light = new THREE.PointLight();
                            light.position.add(pos).add(new THREE.Vector3(0, 2, 0));
                            return [col.scene, light];
                        }).then(function (model) { return renderer.add.apply(renderer, model); });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main();
window['THREE'] = THREE;
//# sourceMappingURL=hw-6.js.map
