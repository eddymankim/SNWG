///
/// StudentRenderer
///
/// 2017-10-11 Your Name @your-andrew-id
///
/// your encapsulation of my typical render setup
///


///
/// In this workshop you will get to create your own customized renderer.
/// You'll be "encapsulating" the stuff you usually use to render the scene,
/// so that you can reuse it and spend your time actually doing fun things.
///
/// In some places you'll see "mystery comments", which look like this:
///
///     /* ??? */
///
/// These indicate that you'll have to fill something in or write something.
/// You may have to write a whole bunch of things in one mystery comment,
/// it's not like filling out a form, you'll have to work some things out.
///


///
///  1. figure out what you're importing and how
///
///     1a. find the module file in the lib directory and add its
///         relative path to the import statement to load from it
///
///     1b. figure out how to import everything from it:
///         there are specific syntaxes for importing things selectively,
///         but in this case you'll want to import everything at once
///
import /* */ as /*  */ from '...somewhere?'


///
///  2. name your class and expose it to other scripts
///
///     2a. pick a name for your new thing that renders your scenes
///
///     2b. they keyword is the corollary of the import statement,
///         and while there are ways to export many things,
///         you just want to export this specific class automatically
///
/* ??? */ class StudentRenderer {


    ///
    ///  3. write your constructor so that it can flexibly take data in
    ///
    ///     3a. you're going to want to have good defaults for missing info
    ///
    ///     3b. instead of trying to keep track of hundreds of variables,
    ///         let's destructure the incoming argument and find them by name
    ///
    ///     3c. some constructors expect their input to be an object, notably,
    ///         the `THREE.Material` constructor, and we can do the same.
    ///
    ///     3d. we could just have one object and see if it has certain data,
    ///         or we could use an ES6 trick called pattern matching
    ///
    ///     3e. first we assign the empty object `{}` into our argument,
    ///         and then we use destructuring to extract certain variables
    ///
    ///     3f. elsewhere, destructuring might look something like this:
    ///         `let { date, name, time } = someObject`
    ///
    ///     3g. use the same syntax inside the constructor arguments,
    ///         and notice how, just like regular functions,
    ///         you don't need to write `var` before each argument
    ///
    ///     3h. once your constructor is set up to destructure,
    ///         then you can add defaults to the destructured variables,
    ///         which would look like the below example (if it were a declaration):
    ///         `let { date, name='Jeff' } = someObject`
    ///
    constructor( /* ??? */ ) {

        ///
        /// 4.  the more conceptually mundane boilerplate has been added for you,
        ///     but there are some details that you have to fill in yourself
        ///
        let clock = new YourImportedStuff.Clock()

        let listener = new YourImportedStuff.AudioListener()


        ///
        /// 4a.
        ///
        let renderer = new YourImportedStuff.WebGLRenderer(webgl)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(width, height)
            renderer.setClearColor(ambient, 0)
            renderer.shadowMap.type = YourImportedStuff.PCFSoftShadowMap
            renderer.shadowMap.enabled = true


        let scene = new YourImportedStuff.Scene()
            scene.fog = new YourImportedStuff.Fog(...Object.values(fog))
            scene.background = new YourImportedStuff.Color(background)
            scene.add(new YourImportedStuff.AmbientLight(ambient))


        let camera = new YourImportedStuff.PerspectiveCamera(...Object.values(cam))
            camera.position.set(...Object.values(position))
            scene.add(camera)


        let sun = new YourImportedStuff.HemisphereLight(light, ground, 0.5)
            sun.position.set(1,2,0)
            scene.add(sun)

        let controls = new YourImportedStuff.OrbitControls(camera,renderer.domElement)

        this.add = (...things) => things.forEach(o => scene.add(o))


        const render = () => {
            requestAnimationFrame(render.bind(this))
            controls.update()
            update(clock.getDelta())
            renderer.render(scene, camera)
        }


        const resize = () => {

            /// 8. update your camrea and renderer sizes via
            ///    `window.innerWidth` and `window.innerHeight`
            camera.aspect = window.innerWidth / window.innerHeight

            /// 8a. the camera needs to be notified of this change
            camera.updateProjectionMatrix()

            /// 8b. update the renderer's size
            renderer.setSize(window.innerWidth, window.innerHeight)
        }


        window.addEventListener('resize', resize, false)
        document.body.appendChild(renderer.domElement)
        render()
    }
}
