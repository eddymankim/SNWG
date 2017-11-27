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
function splines() {
    var top = new T.SplineCurve([
        new T.Vector2(-100, 0),
        new T.Vector2(0, 100),
        new T.Vector2(100, 0),
        new T.Vector2(0, -100)
    ]);
    ;
    var mid = new T.SplineCurve([
        new T.Vector2(-100, 100),
        new T.Vector2(100, 100),
        new T.Vector2(100, -100),
        new T.Vector2(-100, -100)
    ]);
    var bot = new T.SplineCurve([
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
    return __awaiter(this, void 0, void 0, function () {
        var start, renderer;
        return __generator(this, function (_a) {
            start = new THREE.Vector3(0, 0, 0);
            renderer = new TechnicalRender({
                background: 0x0000ff,
                position: { x: 30, y: 100, z: 100 },
                update: function (dt) { },
                path: '../../data/atiwari1',
                width: 700,
                height: 700,
                elt: '#RenderCanvas',
                cam: { near: -2000, far: 2000 }
            });
            renderer.camera.lookAt(new T.Vector3(0, 0, 0));
            renderer.add(planes());
            renderer.add.apply(renderer, splines());
            return [2 /*return*/];
        });
    });
}
main();
window['THREE'] = THREE;
//# sourceMappingURL=hw-8.js.map
