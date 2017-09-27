---
layout: code
title: A Quiet Saunter into WebGL
permalink: /code/foray-into-webgl/
code: evan-erdos/snwg-intro
---

While WebGL is capable of many technically impressive feats of rendering,
the software ecosystem around it is still in its organizational infancy.
This workshop aims to provide some structural approaches and software tools
which you can use to combat the evil forces of web development at scale.

### Some Notes about File Organization ###
Given that we're all co-inhabiting the class repository, we need some rules.
For all future code-based projects and posts, we'll be using these directories:

~~~
├── code
│   ├── lib/
│   │   ├── effects/
│   │   │   ├── module.js
│   │   │   └── ...
│   │   ├── orbit.js
│   │   ├── module.js
│   │   └── three.js
│   ├── evan-erdos/
│   │   └── snwg-intro.js
│   └── ...
├── data/
│   ├── evan-erdos/
│   │   ├── gas-giant-albedo.png
│   │   ├── gas-giant-normal.jpg
│   │   ├── planet-albedo.png
│   │   ├── planet-normal.jpg
│   │   ├── star-blue-albedo.png
│   │   └── star-sun-albedo.png
│   └── ...
├── index.html
└── ...
~~~


#### 1. `code/` ####
This is where all code is to be stored, in a folder under your name.
Once you're within your folder, you can do as you please, you'll be fine.
Please make a ton of files and bunches of subdirectories with other code.

#### 2. `lib/` ####
Stay organized however you want, but don't go fooling with `lib/`.
This is the home of all the shared resources and class-wide libraries.
It would be in remarkably poor taste to modify any of those files.
Any Pull Request which lists any changes to `lib/` will be rejected outright.
If you need some other library, that's great, just make your own directory.

#### 3. `data/` ####
Files you want to use belong in a folder under your name in `data/`.
Small textures, models, etc, all belong in there, but nothing huge.
If you have 4k videos and a gigabyte of pointcloud data you *need*,
you should host those somewhere else so as to not bog down everyone else.
Anything over ~20 megabytes would need a very good reason to be in `data/`.

~~~html
<div id='RenderCanvas'></div>
<script src='/code/snwg-intro.js' deferred type='module'></script>
~~~

We're going to be rendering into the above HTML `canvas`.
This is all we need to worry about, insofar as HTML is concerned.
One thing to note is the type isn't 'JavaScript', but 'module'.
One of the nicest features of ES6 is the import/export system.
We'll get into the specifics of that later.


It's a very simple layout, it looks like this in the frontmatter:

~~~yaml
---
layout: code
title: A Quiet Saunter into WebGL
code: evan-erdos/snwg-intro
---
~~~

The `code` property there is the path to your script,
so it makes linking a post to a particular script pretty easy.
You can roll your own layout, too, if you want something special.

### What is `THREE.js`? ###
It's the ubiquitous solution to rendering 3D scenes in the browser.
It has many features and some very impressive rendering capabilities,
and also unfortunately some pretty serious shortcomings and limitations.
`THREE.js` has neither the grace nor the rigor of a real graphics library,
nor does it posess the helpful organizational structures of a game engine.
It will not be terribly interested in organizing your content for you,
but it will also not help you to create interesting dynamic interactions.

### And how is `ES6` not JavaScript? ###
If you're reading this and you're not on Chrome 61 or better,
stop reading and go download the latest version, we can wait.

### So `ES6` is not JavaScript? ###
Yes, it is JavaScript, and if you're careful with it it's pretty darn cool.
The most recent release of Chrome added support for fancy features like modules.


### Getting Started with THREE.js ###
To render any scene, 2D or 3D, you will need a preliminary setup.
Additionally, there are some good and bad examples to be found online.
Apparently they're a substitute for actual code documentation.

[http://stemkoski.github.io/Three.js/#materials-solid]()


~~~JavaScript
///
/// SNWG Foray into WebGL
///
/// 2017-09-26 Ben Scott @evan-erdos <bescott.org>
///
~~~

Things are about to get pretty rough, so it's good to be fastidious.
You might get to the point where you forget what your own files do.

~~~JavaScript
import * as THREE from '../lib/module.js'
~~~

Well what's all this then?
It says we're importing something, but THREE? That file doesn't say THREE.
What we're really doing is using a pattern you should adopt in your own work.
You can see what's going on if you take a look at `code/lib/module.js`:

~~~JavaScript

...
export * from './three.js'
export * from './effects/module.js'
export { default as OrbitControls } from './orbit.js'

/// returns a random integer where n => [0, max)
export const pick = n => Math.floor(Math.random()*n)

...
~~~

The "module" is exporting a bunch of things we usually use together.
The main THREE implementation is getting passed through in the first line,
the postprocessing effects are exported on the second, and so on.
This is a good way of organizing related groups of files together.

~~~JavaScript
/// root directory for asset files
const dir = '../../data/evan-erdos'
~~~

This is really the only top-level variable.

~~~JavaScript
var background = 0xFFFFFF
~~~

This is a variable declaration of the background color.
The prefix `0x` means this number literal is in hexadecimal.
It's definitely the pithiest way to write color literals.

~~~JavaScript
let clock = new THREE.Clock()
~~~

This is how new instances of classes are created.

~~~JavaScript
function getRatio() {
    return window.innerWidth / window.innerHeight
}

const getAspect = () => [window.innerWidth, window.innerHeight]
~~~

Some functions. The first is a boring old regular function.
Everyone should have a pretty good idea of what it does, just by looks.
The second is making use of a lot of ES6 concepts.
The `const` keyword and `let` keywords can be used in the stead of `var`.
You should not use `var` unless you *need* to confuse yourself.
If you use `let`, it will not allow you to redefine the variable later.
Even stronger is `const`, which will not allow you to assign to it,
and can only be given a value when it is initialized.

So we're declaring a function, and storing it in a variable.
The arrow syntax also implicitly returns, so it returns the array.

~~~JavaScript
let camera = new THREE.PerspectiveCamera(60, getRatio(), 1, 2e5)
    camera.position.z = 100

let light = new THREE.DirectionalLight(0xFFFAD3, 1)
    light.position.set(100,200,100)
~~~

The camera renders the scene, and can be moved around, rotated, etc.
The light illuminates 3D surfaces, there are a few kinds of light.

~~~JavaScript
let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(background,1)
    renderer.setSize(...getAspect())
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
~~~

The renderer is the powerhouse of the WebGL.
The function `render` is what converts the scene into WebGL calls.
Some people may say "that's indented so wrong u bum",
but I say setting these other properties is part of the constructor.
There are some nontrivial syntax tricks going on here as well.

For starters, the constructor has this `({ ... })` syntax.
What's going on there is that we're passing a new object to the constructor.
It's a simple object, and the `WebGLRenderer` class expects this object,
and when the renderer is created, it reads the properties from this object,
and applies them to itself if the values are present in the object.
We've only included `antialias: true`, but there are many others.

Also, in the `setSize` call, we're perhaps abusing the spread syntax.
The ellipsis-looking operator is the conceptual equivalent of deleting brackets.
You can use a list `const L = [1,2,3]`,
to call a function `let f = (x,y,z) => x+y+z`,
by using the spread operator in the call `f(...L)`.
Given two lists, `const A = [1,2,3], B = [4,5,6]`,
the syntax affords us a very cuspy `concat`: `const C = [...A, ...B]`.
You'll notice I'm using `const` on lists, which aren't immutable.
This prevents any outright replacement of the list later on,
but allows containted elements to be modified at will.


~~~JavaScript
let scene = new THREE.Scene()
    scene.fog = new THREE.Fog(background, 2**16, 2e5)
    scene.add(camera, light, new THREE.AmbientLight(0x14031B))
~~~

The `scene` object contains all the objects to-be-rendered.
If a mesh or something just won't show up no matter how hard to try,
you might have forgotten to `add` it to the scene being rendered.

~~~JavaScript
document.querySelector('#RenderCanvas').appendChild(renderer.domElement)

window.onResize = () => {
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
}
~~~

Some DOM management stuff, pretty boring.
Resizes with the window, puts the canvas in the div from the layout. Snore.

~~~JavaScript
function render(deltaTime=0.01) {
    renderer.render(scene, camera)
    requestAnimationFrame(() => render(clock.getDelta()))
}
~~~

The most important function, good old `render`.
You don't need the whole `clock` or `deltaTime` setup,
it just provides a nice temporal context to keep things in time.

The last line there gives `requestAnimationFrame` a callback,
which will then in turn call `render` again at the appropriate rate.

~~~JavaScript
const geometry = new THREE.SphereGeometry(32,16,16)
const material = new THREE.MeshPhongMaterial({
    color: 0xAAAAAA, shininess: 20 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
~~~

This is going to be your bread and butter:
1. Create, Import, or Generate your geometry
2. Pick a Material shader and the parameters to send
3. create a Mesh from the geometry and material
4. add it to the scene


~~~JavaScript
render()
~~~

And finally, begin the rendering loop by calling `render`.

