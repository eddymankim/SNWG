---
layout: code
title: The Third Dimension
permalink: /code/the-third-dimension/
code: evan-erdos/snwg-space
---

Writing a procedural 3D star system is a pretty easy thing to pull off.
Organizing it, however, is harder than fighting the entropy of the universe.

### The Same Notes as Before about File Organization ###

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


~~~JavaScript
///
/// SNWG - now in spaceeeeeeee
///
/// 2017-09-26 Ben Scott @evan-erdos <bescott.org>
///
~~~

Let's get started.


~~~JavaScript
import * as T from '../lib/module.js'

/// local directory for assets
const dir = '../../data/evan-erdos'
~~~

Same as before, but now making the alias `T` instead of `THREE`,
nobody likes typing, and neither should you.

~~~ES6

/// Planet
/// represents any kind of celestial body
class Planet {
    constructor(data={}) {
        const defaults = {
            orbit: T.random(-0.05,0.05),        /// orbit time (ms)
            height: T.random(4.2e3,5e3),        /// orbit altitude (km)
            offset: T.random(0,360),            /// orbit offset (rad)
            period: T.random(-2,2),             /// day period (ms)
            declin: T.random(-0.5,0.5),         /// declination (rad)
            geometry: [T.random(24,32),32,32],
            material: {
                color: 0xFFFFFF,                /// tint color (hex)
                specular: 0x111111,             /// spec color (hex)
                shininess: 10,                  /// glossiness (real)
                reflectivity: 1.0 },            /// reflections (0,1)
            files: {
                physic: 'planet-physic.jpg',
                normal: 'planet-normal.jpg',
                albedo: 'planet-albedo.png'} }
        this.data = Object.assign(defaults, data)
        let geometry = new T.SphereGeometry(...this.data.geometry)
        let material = new T.MeshPhongMaterial(this.data.material)
        this.mesh = new T.Mesh(geometry, material)
        this.mesh.castShadow = this.mesh.recieveShadow = true
        this.obj = new T.Object3D()
        this.obj.rotation.y += this.data.offset
        this.obj.add(this.mesh)
        Planet.load(this.mesh.material, this.data.files)
    }

...
~~~

I'm still pretty undecided on whether or not the `defaults` should be in the argument, but I'll write all this later

Navigate to `code/snwg-space.js` to follow along.
