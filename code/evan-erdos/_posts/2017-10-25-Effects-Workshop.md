---
layout: full
title: Flash, Pop, and Hiss
permalink: /code/effects-workshop/
author: Ben Scott
---


<script deferred type="module">

///
/// 2017-10-25 make your own nightmare day
///
/// Copy this file to your own folder to get started,
/// but this time, leave the import statements alone.
///
import * as T from '../evan-erdos/module.js'
import * as Effects from '../evan-erdos/effects/module.js'
import * as Shaders from '../evan-erdos/shaders/module.js'


///
/// The Factory Pattern + more destructruing fun
///
/// A Factory allows for the precise creation of many objects,
/// to whatever similar specifications they all have.
/// In this case, we're just sending along the simple stuff:
/// everything has a place, everything has a material,
/// they should all have shadows enabled, and so on.
///
/// Something more interesting is evident in the functions below.
/// What do they seem to do?
///
/// They take in the arguments to a constructor and then call it.
/// Who would do a thing like that? Why?
///
/// We would. That's who.
///
/// What this allows us to do is customize inputs.
/// When we create the ground, we just tack on a fourth parameter.
/// Since we passed the input function its arguments,
/// the rest of the function couldn't care less what it does.
/// We'll be using this approach later on, in the renderer.
///
function createShape({
        position = [0,0,0],
        rotation = [0,0,0],
        geometry = [1,1,1],
        material = {color:0xAAAAAA},
        enableShadows = true,
        f = a => new T.MeshStandardMaterial(a),
        g = a => new T.CubeGeometry(...a),
        }={}) {
    let mesh = new T.Mesh(g(geometry),f(material))
        mesh.castShadow = enableShadows
        mesh.receiveShadow = enableShadows
        mesh.position.set(...position)
        mesh.rotation.set(...rotation)
    return mesh
}


// create a ground texture with arguably too many polygons
let ground = createShape({
    position: [0,0,0],
    rotation: [-Math.PI/2,0,0],
    material: { color:0x111111, roughness:0.1 },

    // a fourth argument? how could you!
    geometry: [1e3,1e3,512,512],

    // this works because PlaneGeometry expects 4 arguments
    g: a => new T.PlaneGeometry(...a) })


// sure it's a rock, why not
let rock = createShape({
    position: [-50,0,0],
    geometry: [10,10,10],
    material: { roughness:0.5 }, })

// even bigger!
let boulder = createShape({
    position: [30,0,10],
    geometry: [20,20,15],
    material: { color:0xBBAAAA }, })


///
/// onload: called when the page is loaded by the renderer
///
/// context will be the renderer, but we haven't created it yet.
/// This isn't redundant or out of order, it's flexible design.
/// What if we couldn't load something for the renderer ahead of time?
/// What if we needed to reference it before it existed?
/// All the sounds we import need the renderer's audio listener,
/// the skybox needs to be loaded also, so having context is crucial.
///
/// The other argument, load, is a function which returns a 'Promise'.
/// In this case, given that we're using the 'FancyRenderer',
/// your TA has done something clever to keep the filepaths short.
///
/// You'll have to figure out how you want to structure your project,
/// because unless you structure your files exactly like mine,
/// your importer won't work and you'll cry.
///
async function onload(context, load) {

    ///
    /// well what's all this then?
    /// even though it's just one sound, load returns an array of data.
    /// we get the first (and last) element of the list via destructuring.
    ///
    let [sound] = await load('red-alert.wav')
    let alarm = new T.PositionalAudio(context.listener)
        alarm.setBuffer(sound) // alarm.play()
        context.add(alarm)

    ///
    /// the skybox is crucial, and we'll see how later.
    ///
    let [skybox] = await load('depression-pass.hdr')
        context.setEnvMap(skybox)


    ///
    /// You might say this is too many files.
    /// In the interest of time, we don't really want to load each file,
    /// its more a matter of shoveling as many files as we can at once.
    ///
    let files = [
        'planet-albedo.png', 'planet-normal.jpg', 'planet-physic.png',
        'star-albedo.png', 'noise-blue-blur.png', 'noise-dithering.png', ]

    ///
    /// Again, destructuring comes to the rescue.
    /// Gone are the days of index counting and mysterious properties.
    /// We load the array of textures into this array,
    /// and then destructuring assigns each file to the corresponding name.
    /// This way, we can use them with reckless abandon.
    ///
    let [albedo,normal,physic,lucent,height,opaque] = await load(...files)


    ///
    /// This is an abomination.
    /// There are a lot of properties on some of these materials.
    /// Unpossessed of any better inclinations or instincts,
    /// I assigned textures to properties, sometimes correctly.
    /// For other properties like alphaMap and roughnessMap,
    /// I just used what I had lying around and it seemed to go fine.
    ///
    let material = new T.MeshPhysicalMaterial({
        color:0xBBEEFF, reflectivity:1.5,
        map:albedo, alphaMap:opaque,
        normalMap:normal, normalScale:new T.Vector2(1.0,1.0),
        aoMap:physic, aoMapIntensity:1.0,
        roughnessMap:physic, roughness:1.0,
        metalnessMap:physic, metalness:0.5,
        envMap:skybox, envMapIntensity:1.0,
        emissive:0x000FFF, emissiveMap:lucent, emissiveIntensity:1.5,
        displacementMap:height,
        displacementScale:10, displacementBias:-5,
        clearCoat:0.5, clearCoatRoughness:0.5, })

    ground.material = material
    ground.material.needsUpdate = true


    ///
    /// here's where the skybox comes in
    /// and here's why it's important to load it ASAP.
    ///
    /// For any "Physically Based" material, you need the skybox:
    /// it contributes reflections to everything, even dull plastics.
    /// You could do crazier things with it, assign different ones, etc.
    ///
    let table = new T.Mesh(
        new T.CubeGeometry(9,1,4),
        new T.MeshStandardMaterial({
            color:0xBBEEFF, map:albedo,
            normalMap:normal, normalScale:new T.Vector2(1.0,1.0),
            envMap:skybox, envMapIntensity:1.0,
            aoMap:physic, aoMapIntensity:1.0, }))
        table.position.set(0,4.5,0)
        context.add(table)


    ///
    /// for large trees of objects,
    /// it's important to apply the envMap to all children,
    /// thus importEnv calls traverse on the imported scene.
    ///
    let [lamp] = await load('brass-lantern.gltf')
        context.importEnv(lamp.scene)
        lamp.scene.position.set(0,6,0)
        context.add(lamp.scene)

}

/// called before rendering the scene
function update(deltaTime=0.01) {
    // torus.position.z = 10*Math.sin(1+dt)*deltaTime
    // torus.rotateY(-2*deltaTime)
}

/// called when clicking on an object
function onclick(object) {
    let material = object.material
    if (material===undefined) return
    material.emissive = 0x111111
    material.emissiveIntensity = 2
    material.needsUpdate = true
}

///
/// create the fancy renderer and pass it all in
///
/// Fool around with the renderer properties.
/// Have fun with it. Create something horrible.
///
window.renderer = new T.Renderer({

    color: 0x5A7F8B,

    ambient: 0x14031B,

    light: 0xFEEBC1,

    ground: 0xF2E9CF,

    position: { x:-7, y:7, z:2 },

    fog: {
        color: 0x000B14,
        near: 1e1,
        far: 1e3,
    },

    hdr: {
        exposure: 1.5,
        whitePoint: 1.0,
        tonemapping: T.NoToneMapping,
        // tonemapping: T.LinearToneMapping,
        // tonemapping: T.ReinhardToneMapping,
        // tonemapping: T.CineonToneMapping,
        // tonemapping: T.Uncharted2ToneMapping,
    },

    objects: [
        ground,
        rock,
        boulder,
    ],

    effects: [

        new Effects.FilmPass({
            noise: 0.5,
            scan: 0.6,
            grayscale: 0,
        }),

        // new Effects.BloomPass({
        //     power: 1.0,
        //     kernel: 36,
        //     sigma: 1,
        // }),

        // new Effects.ColorShiftPass({
        //     pow: [2.1, 1.5, 1.6],
        //     mul: [1.1, 0.8, 1.2],
        //     add: [0.1, 0.2, 0.2],
        //     noise: 0.1,
        //     noir: true,
        // }),


        // new Effects.GlitchPass(),

        // new Effects.ShaderPass(Shaders.Bleach),
        // new Effects.ShaderPass(Shaders.Sepia),
        new Effects.ShaderPass(Shaders.Color),
        // new Effects.ShaderPass(Shaders.Technicolor),
        new Effects.ShaderPass(Shaders.Vignette),

    ],

    onload, update, onclick,

    path: '../evan-erdos/'
})

</script>

