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
var data = '/code/atiwari1/models/';
var h = Math.sqrt(3);
var bathtubs = "Antique+Bathtub\nBasic\nBathtub\nBATHTUB+DROPIN\nCabrits\nMarlborough\nmonaco\nmonaco (1)\nNordhem_Apelviken_w_Tjorn\nOnsen\nonsen_vasca\nSketchupPersonalProject\nUrquiola".split('\n').map(function (x) { return 'bathtubs/' + x + '/model.dae'; });
console.log(bathtubs);
function mapT(obj, fn) {
    if (obj.children) {
        for (var i = 0; i < obj.children.length; i++) {
            obj.children[i] = mapT(obj.children[i], fn);
        }
    }
    ;
    return fn(obj);
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
function set_edges_mat(obj) {
    if (obj.geometry) {
        var linegeom = new THREE.EdgesGeometry(obj.geometry, 30.0);
        var edges_mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        var edges = new THREE.LineSegments(linegeom, edges_mat);
        edges.position.copy(obj.position);
        edges.rotation.copy(obj.rotation);
        edges.scale.copy(obj.scale);
        return edges;
    }
    else {
        return obj;
    }
}
var load_cache = {};
function load_collada(path) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            if (load_cache[path] != undefined) {
                return [2 /*return*/, load_cache[path].then(function (r) { return r.clone(); })];
            }
            resp = new Promise(function (res, rej) {
                var loader = ColladaLoader();
                loader.options.convertUpAxis = true;
                loader.load(data + path, function (model) {
                    res(model.scene);
                }, function (prog) { return console.log(prog); }, function (err) { return rej(err); });
            });
            load_cache[path] = resp;
            return [2 /*return*/, resp];
        });
    });
}
function poly_corners(n, radius) {
    return new Array(n).fill(undefined)
        .map(function (x, i) {
        return new T.Vector3(Math.sin((i / n) * 2 * Math.PI) * radius, 0, Math.cos((i / n) * 2 * Math.PI));
    });
}
function bathtub_fractal(depth, n, radius, scale) {
    return __awaiter(this, void 0, void 0, function () {
        var root, name, bathtub, corners, children;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    root = new T.Object3D();
                    name = bathtubs[Math.floor(Math.random() * bathtubs.length)];
                    return [4 /*yield*/, load_collada(name)];
                case 1:
                    bathtub = _a.sent();
                    bathtub.name = name;
                    // for some reason this resets all transforms ? so commented out for now
                    /* set_material_deep(bathtub, new (THREE as any).MeshToonMaterial({
                        color: new THREE.Color('red'),
                        specular: new THREE.Color('blue')
                    })); */
                    //if (bathtub['scene']) root.add(bathtub['scene'])
                    //else root.add(bathtub)
                    if (depth == 0)
                        return [2 /*return*/, bathtub];
                    root.add(bathtub);
                    corners = poly_corners(n, radius);
                    return [4 /*yield*/, Promise.all(new Array(n).fill(undefined).map(function () { return bathtub_fractal(depth - 1, n, radius, scale); }))];
                case 2:
                    children = _a.sent();
                    console.log(bathtub);
                    children = children.map(function (x, i) {
                        x.position.add(corners[i]);
                        if (i % 2)
                            x.position.add(new T.Vector3(0, radius, 0));
                        else
                            x.position.sub(new T.Vector3(0, radius, 0));
                        x.scale.set(scale, scale, scale);
                        return x;
                    });
                    root.add.apply(root, children);
                    return [2 /*return*/, root];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var start, fractal, _a, _b, _c, renderer;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    start = new THREE.Vector3(0, 0, 0);
                    return [4 /*yield*/, load_collada(bathtubs[1])]; // await bathtub_fractal(5, 4, 3, 0.6);
                case 1:
                    fractal = _d.sent();
                    _b = (_a = fractal).add;
                    return [4 /*yield*/, bathtub_fractal(5, 4, 3, 0.6)];
                case 2:
                    _b.apply(_a, [_d.sent()]);
                    renderer = new ToonRenderer({
                        position: { x: 0, y: 1, z: 5 },
                        update: function (dt) { },
                        path: '../../code/atiwari1',
                        width: 700,
                        height: 700,
                        elt: '#RenderCanvas'
                    });
                    console.log(fractal);
                    renderer.add(fractal);
                    return [2 /*return*/];
            }
        });
    });
}
main();
window['THREE'] = THREE;
//# sourceMappingURL=hw-7.js.map
