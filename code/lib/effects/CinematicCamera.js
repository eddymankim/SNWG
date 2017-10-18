///
/// @author mrdoob http://mrdoob.com/
/// @author greggman http://games.greggman.com/
/// @author zz85 http://www.lab4games.net/zz85/blog
/// @author kaypiKun
/// @author evan-erdos http://bescott.org/
///
import * as T from '../three.js'

export default class CinematicCamera extends T.PerspectiveCamera {
    constructor({fov=50, aspect=1.618, near=0.1, far=1e6}={}) {
        super(fov,aspect,near,far)
        this.type = 'CinematicCamera'
        this.postprocessing = { enabled : true }
        this.defines = { rings: 3, samples: 4 }
        this.material_depth = new T.MeshDepthMaterial()
        this.setLens()
        this.initPostProcessing()
    }

    setLens(focalLength=35, filmGauge=70, fNumber=8, coc=0.019) {
        this.filmGauge = filmGauge
        this.setFocalLength(focalLength)
        this.fNumber = fNumber
        this.coc = coc
        this.aperture = focalLength / fNumber
        this.hyperFocal = (focalLength*focalLength)/(this.aperture*coc)
    }


    linearize(depth, zfar=this.far, znear=this.near) {
        return -zfar*znear/(depth*(zfar-znear)-zfar)
    }

    smoothstep(near, far, depth) {
        let x = this.saturate((depth-near)/(far-near))
        return x*x*(3-2*x)
    }

    saturate(x) { return Math.max(0,Math.min(1,x)) }

    focusAt(distance=20, hyperFocal=this.hyperFocal, focalLength=this.getFocalLength()) {
        this.focus = distance
        let near = (hyperFocal*distance)/(hyperFocal+(distance-focalLength))
        let far = (hyperFocal*distance)/(hyperFocal-(distance-focalLength))
        this.depthOfField = Math.max(0,this.farPoint-this.nearPoint)
        this.sdistance = this.smoothstep(this.near, this.far, distance)
        this.ldistance = this.linearize(1-this.smoothstep(this.near,this.far,distance))
        this.postprocessing.bokeh_uniforms['focalDepth'].value = this.ldistance
    }

    initPostProcessing() {
        if (!this.postprocessing.enabled) return
        let [width,height] = [window.innerWidth, window.innerHeight]
        let bounds = [width/-2, width/2, height/2, height/-2,-10000,10000]
        this.postprocessing.scene = new T.Scene()
        this.postprocessing.camera = new T.OrthographicCamera(...bounds)
        this.postprocessing.scene.add(this.postprocessing.camera)
        let pars = { format:T.RGBFormat, minFilter:T.LinearFilter, magFilter:T.LinearFilter }
        let args = [width, height, pars]
        let bokeh_shader = T.BokehShader
        const rtTextureDepth = new T.WebGLRenderTarget(args)
        const rtTextureColor = new T.WebGLRenderTarget(args)
        this.postprocessing.rtTextureDepth = rtTextureDepth
        this.postprocessing.rtTextureColor = rtTextureColor
        this.postprocessing.bokeh_uniforms = T.UniformsUtils.clone(bokeh_shader.uniforms)
        this.postprocessing.bokeh_uniforms['tColor'].value = rtTextureColor.texture
        this.postprocessing.bokeh_uniforms['tDepth'].value = rtTextureDepth.texture
        this.postprocessing.bokeh_uniforms['manualdof'].value = 0
        this.postprocessing.bokeh_uniforms['shaderFocus'].value = 0
        this.postprocessing.bokeh_uniforms['fstop'].value = 2.8
        this.postprocessing.bokeh_uniforms['showFocus'].value = 1
        this.postprocessing.bokeh_uniforms['focalDepth'].value = 0.1
        this.postprocessing.bokeh_uniforms['znear'].value = this.near
        this.postprocessing.bokeh_uniforms['zfar'].value = this.near
        this.postprocessing.bokeh_uniforms['textureWidth'].value = width
        this.postprocessing.bokeh_uniforms['textureHeight'].value = height
        this.postprocessing.quad = new T.Mesh(
            new T.PlaneBufferGeometry(width,height),
            new T.ShaderMaterial({
                defines: {
                    RINGS: this.defines.rings,
                    SAMPLES: this.defines.samples },
                uniforms: this.postprocessing.bokeh_uniforms,
                vertexShader: bokeh_shader.vertexShader,
                fragmentShader: bokeh_shader.fragmentShader, }))

        this.postprocessing.quad.position.z = - 500
        this.postprocessing.scene.add(this.postprocessing.quad)
    }

    renderCinematic(scene, renderer) {
        if (!this.postprocessing.enabled) return
        renderer.clear()
        scene.overrideMaterial = null
        renderer.render(scene, camera, this.postprocessing.rtTextureColor, true)
        scene.overrideMaterial = this.material_depth
        renderer.render(scene, camera, this.postprocessing.rtTextureDepth, true)
        renderer.render(this.postprocessing.scene, this.postprocessing.camera)
    }
}
