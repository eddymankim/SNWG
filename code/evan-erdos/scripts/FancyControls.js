///
/// @author qiao / https://github.com/qiao
/// @author mrdoob / http://mrdoob.com
/// @author alteredq / http://alteredqualia.com/
/// @author WestLangley / http://github.com/WestLangley
/// @author erich666 / http://erichaines.com
/// @author danrossi / https://www.electroteque.org
/// @author bescott / https://www.bescott.org
///
/// FancyControls for mouse and keyboard controls
/// Changes to turn it into a three.js module for bundling
/// changes to fix bundling and to clean up style
///
import * as T from '../module.js'

const EPS = 0.000001
const DEG = 2 * Math.PI / 360
const STATE = { NONE:-1, ROTATE:0, DOLLY:1, PAN:2,
    TOUCH_ROTATE:3, TOUCH_DOLLY:4, TOUCH_PAN:5 }

export default class FancyControls extends T.EventDispatcher {
    constructor(object, domElement=document) { super()
        this.object = object
        this.domElement = domElement
        this.enabled = true
        this.target = new T.Vector3() // focus to orbit around
        this.minDistance = 0 // How far you can dolly in and out
        this.maxDistance = 2**18 // used by PerspectiveCamera only
        this.minZoom = 0 // How far you can zoom in and out
        this.maxZoom = Infinity // used by OrthographicCamera only
        this.minPolarAngle = 0 // how far you can orbit vertically
        this.maxPolarAngle = Math.PI // [0..Math.PI] radians
        this.minAzimuthAngle = -Infinity // horizontal orbit limits
        this.maxAzimuthAngle = Infinity // [-Math.PI, Math.PI]
        this.enableDamping = false // set to true to enable inertia
        this.dampingFactor = 0.25 // requires that update is called
        this.keyDampingFactor = 0.10 // the damping factor for keys
        this.enableZoom = true // set to false to disable zooming
        this.zoomSpeed = 1.0 // speed of zooming
        this.enableRotate = true // set to false to disable rotating
        this.rotateSpeed = 1.0 // speed of rotation
        this.enablePan = true // set to false to disable panning
        this.keyPanSpeed = 7.0 // pixels moved per arrow key push
        this.enableKeys = true // Set to false to disable keys
        this.keys = { left: 37, up: 38, right: 39, bottom: 40 }
        this.mouseButtons = {
            ORBIT:T.MOUSE.LEFT,
            ZOOM:T.MOUSE.MIDDLE,
            PAN:T.MOUSE.RIGHT }

        // for reset
        this.target0 = this.target.clone()
        this.position0 = this.object.position.clone()
        this.zoom0 = this.object.zoom
        this.state = STATE.NONE

        // current position in spherical coordinates
        this.spherical = new T.Spherical()
        this.sphericalDelta = new T.Spherical()

        this.scale = 1
        this.panOffset = new T.Vector3()
        this.zoomChanged = false

        this.rotStart = new T.Vector2()
        this.rotDelta = new T.Vector2()
        this.rotFinal = new T.Vector2()

        this.panStart = new T.Vector2()
        this.panDelta = new T.Vector2()
        this.panFinal = new T.Vector2()

        this.dolStart = new T.Vector2()
        this.dolDelta = new T.Vector2()
        this.dolFinal = new T.Vector2()

        this.connect()
        this.update()
    }

    getPolarAngle() { return this.spherical.phi }
    getAzimuthalAngle() { return this.spherical.theta }
    getAutoRotationAngle() { return DEG * this.autoRotateSpeed }
    getZoomScale() { return Math.pow(0.95,this.zoomSpeed) }
    rotateLeft(angle) { this.sphericalDelta.theta -= angle }
    rotateUp(angle) { this.sphericalDelta.phi -= angle }

    panLeft(distance, objectMatrix) {
        const v = new T.Vector3()
        v.setFromMatrixColumn(objectMatrix,0) // get X column
        v.multiplyScalar(-distance)
        this.panOffset.add(v)
    }

    panUp(distance, objectMatrix) {
        const v = new T.Vector3()
        v.setFromMatrixColumn(objectMatrix,1) // get Y column
        v.multiplyScalar(distance)
        this.panOffset.add(v)
    }

    // deltaX and deltaY are in pixels right and down are positive
    pan(deltaX, deltaY) {
        const offset = new T.Vector3()
        const element = this.domElement === document ? this.domElement.body : this.domElement
        if (this.object instanceof T.PerspectiveCamera) {
            const position = this.object.position
            offset.copy(position).sub(this.target)
            let targetDistance = offset.length()
            targetDistance *= Math.tan((this.object.fov/2)*Math.PI/180.0 )
            this.panLeft(2*deltaX*targetDistance/element.clientHeight, this.object.matrix)
            this.panUp(2 * deltaY * targetDistance / element.clientHeight, this.object.matrix)
        } else if (this.object instanceof T.OrthographicCamera) {
            this.panLeft(deltaX * (this.object.right - this.object.left) / this.object.zoom / element.clientWidth, this.object.matrix )
            this.panUp( deltaY * (this.object.top - this.object.bottom) / this.object.zoom / element.clientHeight, this.object.matrix )
        } else this.enablePan = false
    }

    dollyIn(dollyScale) {
        if (this.object instanceof T.OrthographicCamera) {
            this.object.zoom = Math.max(this.minZoom,
                Math.min(this.maxZoom,this.object.zoom*dollyScale))
            this.object.updateProjectionMatrix()
            this.zoomChanged = true
        } else if (this.object instanceof T.PerspectiveCamera)
            this.scale /= dollyScale
        else this.enableZoom = false;
    }

    dollyOut(dollyScale) {
        if (this.object instanceof T.OrthographicCamera) {
            this.object.zoom = Math.max(this.minZoom,
                Math.min(this.maxZoom,this.object.zoom/dollyScale))
            this.object.updateProjectionMatrix()
            this.zoomChanged = true
        } else if (this.object instanceof T.PerspectiveCamera)
            this.scale *= dollyScale
        else this.enableZoom = false
    }


    /// auto rotation
    rotateY(speed) { this.rotateUp(T.Math.degToRad(speed)); this.update() }
    rotateX(speed) { this.rotateLeft(T.Math.degToRad(speed)); this.update() }
    setDamping() { this.dampingFactor = this.keyDampingFactor }

    /// move API
    moveLeft() { this.setDamping(); this.rotateX(+this.rotateSpeed) }
    moveRight() { this.setDamping(); this.rotateX(-this.rotateSpeed) }
    moveDown() { this.setDamping(); this.rotateY(-this.rotateSpeed) }
    moveUp() { this.setDamping(); this.rotateY(+this.rotateSpeed) }


    /// Keyboard controls with auto rotation
    keydown({keyCode}) {
        switch (keyCode) {
            case this.keys.up: this.moveUp(); break
            case this.keys.bottom: this.moveDown(); break
            case this.keys.left: this.moveLeft(); break
            case this.keys.right: this.moveRight(); break
        }
    }

    touchend({touches:[p,{x=pageX,y=pageY}]}) { } // log('touchend')
    touchstartRot({touches:[{x=pageX,y=pageY}]}) { this.rotStart.set(x,y) }
    touchstartPan({touches:[{x=pageX,y=pageY}]}) { this.panStart.set(x,y) }
    touchstartDol({touches:[{x=pageX,y=pageY},{dx=pageX,dy=pageY}]}) {
        this.dolStart.set(0,Math.sqrt((x-dx)**2+(y-dy)**2)) }

    touchmoveRot({touches:[{x=pageX,y=pageY}]}) {
        this.rotFinal.set(x,y)
        this.rotDelta.subVectors(this.rotFinal, this.rotStart)
        const element = this.domElement === document
            ? this.domElement.body : this.domElement
        const [w,h] = [element.clientWidth, element.clientHeight]
        this.rotateLeft(2*Math.PI*this.rotDelta.x/w*this.rotateSpeed)
        this.rotateUp( 2*Math.PI*this.rotDelta.y/h*this.rotateSpeed)
        this.rotStart.copy(this.rotFinal)
        this.update() }

    touchmoveDol({touches:[{x=pageX,y=pageY},{dx=pageX,dy=pageY}]}) {
        this.dolFinal.set(0,Math.sqrt((x-dx)**2+(y-dy)**2))
        this.dolDelta.subVectors(this.dolFinal, this.dolStart)
        if (0<this.dolDelta.y) this.dollyOut(this.getZoomScale())
        else if (this.dolDelta.y<0) this.dollyIn(this.getZoomScale())
        this.dolStart.copy(this.dolFinal)
        this.update() }

    touchmovePan({touches:[{x=pageX,y=pageY}]}) {
        this.panFinal.set(x,y)
        this.panDelta.subVectors(this.panFinal,this.panStart)
        this.pan(this.panDelta.x,this.panDelta.y)
        this.panStart.copy(this.panFinal)
        this.update() }



    onTouchStart(event) {
        if (this.enabled===false) return
        switch (event.touches.length) {
            case 1: if (this.enableRotate===false) return
                this.state = STATE.TOUCH_ROTATE
                this.touchstartRot(event); break
            case 2: if (this.enableZoom===false) return
                this.state = STATE.TOUCH_DOLLY
                this.touchstartDol(event); break
            case 3: if (this.enablePan===false) return
                this.state = STATE.TOUCH_PAN
                this.touchstartPan(event); break
            default: this.state = STATE.NONE
        }

        if (this.state!==STATE.NONE) {
            const onTouchMoveCheck = () => {
                this.domElement.removeEventListener('touchmove', onTouchMoveCheck)
                this.dispatchStart() }
            this.domElement.addEventListener('touchmove', onTouchMoveCheck)
        }
    }


    onTouchMove(event) {
        if (this.enabled===false) return
        event.preventDefault(); event.stopPropagation()
        switch (event.touches.length) {
            case 1: if (this.enableRotate) this.touchmoveRot(event); break
            case 2: if (this.enableZoom) this.touchmoveDol(event); break
            case 3: if (this.enablePan) this.touchmovePan(event); break
            default: this.state = STATE.NONE
        }
    }

    onTouchEnd(event) {
        if (this.enabled===false) return
        this.touchend(event)
        this.dispatchEnd()
        this.state = STATE.NONE
    }


    mousedownRot({x=clientX, y=clientY}) { this.rotStart.set(x,y) }
    mousedownDol({x=clientX, y=clientY}) { this.dolStart.set(x,y) }
    mousedownPan({x=clientX, y=clientY}) { this.panStart.set(x,y) }
    mousemoveRot({x=clientX, y=clientY, target}) {
        this.rotFinal.set(x,y)
        this.rotDelta.subVectors(this.rotFinal, this.rotStart)
        let element = this.domElement===document?this.domElement.body:target
        let [width,height] = [element.clientWidth, element.clientHeight]
        this.rotateLeft(2*Math.PI*this.rotDelta.x/width*this.rotateSpeed)
        // rotating up and down along whole screen attempts to go 360
        this.rotateUp(2*Math.PI*this.rotDelta.y/height*this.rotateSpeed)
        this.rotStart.copy(this.rotFinal)
        this.update() }

    mouseMoveDol({x=clientX, y=clientY}) {
        this.dolFinal.set(x,y)
        this.dolDelta.subVectors(this.dolFinal, this.dolStart)
        if (this.dolDelta.y>0) this.dollyIn(this.getZoomScale())
        else if (this.dolDelta.y<0) this.dollyOut(this.getZoomScale())
        this.dolStart.copy(this.dolFinal)
        this.update() }

    mousemovePan({x=clientX, y=clientY}) {
        this.panFinal.set(x,y)
        this.panDelta.subVectors(this.panFinal, this.panStart)
        this.pan(this.panDelta.x, this.panDelta.y)
        this.panStart.copy(this.panFinal)
        this.update() }


    handleMouseUp(event) { } // console.log('handleMouseUp')

    handleMouseWheel(event) {
        let delta = 0
        if (event.wheelDelta!==undefined) delta = event.wheelDelta
        else if (event.detail!==undefined) delta = -event.detail
        if (delta>0) this.dollyOut(this.getZoomScale())
        else if (delta<0) this.dollyIn(this.getZoomScale())
        this.update() }

    /// event handlers - FSM: listen for events and reset state
    onMouseDown(event) {
        if (this.enabled===false) return
        if (this.domElement!==event.target) return
        event.preventDefault()
        this.dampingFactor = this.mouseDampingFactor
        this.activeElement = event.target

        switch (event.button) {
            case this.mouseButtons.ORBIT: if (this.enableRotate===false) return
                this.mousedownRot(event); this.state = STATE.ROTATE; break
            case this.mouseButtons.ZOOM: if (this.enableZoom===false) return
                this.mousedownDol(event); this.state = STATE.DOLLY; break
            case this.mouseButtons.PAN: if (this.enablePan===false) return
                this.mousedownPan(event); this.state = STATE.PAN; break
        }

        if (this.state!==STATE.NONE) {
            const onMoveCheck = () => {
                document.removeEventListener('mousemove', onMoveCheck)
                this.dispatchStart() }
            document.addEventListener('mousemove',onMoveCheck,false)
            document.addEventListener('mousemove',this.onMouseMoveRef,false)
            document.addEventListener('mouseup',this.onMouseUpRef,false)
            document.addEventListener('mouseout',this.onMouseUpRef,false)
        }
    }

    onMouseMove(event) {
        if (this.enabled===false) return
        event.preventDefault()
        switch(this.state) {
            case STATE.ROTATE: if (this.enableRotate) this.mousemoveRot(event); break
            case STATE.DOLLY: if (this.enableZoom) this.mouseMoveDol(event); break
            case STATE.PAN: if (this.enablePan) this.mousemovePan(event); break
        }
    }

    onMouseUp(event) {
        if (this.enabled===false) return
        this.handleMouseUp(event)
        document.removeEventListener('mousemove', this.onMouseMoveRef, false)
        document.removeEventListener('mouseup', this.onMouseUpRef, false)
        document.removeEventListener('mouseout', this.onMouseUpRef, false)
        this.dispatchEnd()
        this.state = STATE.NONE // cancel the active element
        this.activeElement = null }


    onMouseWheel(event) {
        if (this.enabled===false || this.enableZoom===false) return
        if (this.state!==STATE.NONE && this.state!==STATE.ROTATE) return
        event.preventDefault(); event.stopPropagation()
        this.handleMouseWheel(event)
        this.dispatchStart(); this.dispatchEnd() }

    onKeyDown(event) {
        if (this.enabled===false || this.enableKeys===false) return
        this.dampingFactor = this.keyDampingFactor; this.keydown(event) }

    dispatchStart() { this.dispatchEvent({ type: "start" }) }
    dispatchChange() { this.dispatchEvent({ type: "change" }) }
    dispatchEnd() { this.dispatchEvent({ type: "end" }) }
    onContextMenu(event) { event.preventDefault() }

    connect() {
        this.enabled = true
        this.reset() // reset the controls leaving VRControls
        this.onMouseDownRef = (event) => this.onMouseDown(event)
        this.onMouseWheelRef = (event) => this.onMouseWheel(event)
        this.onMouseWheelRef = (event) => this.onMouseWheel(event)
        this.onMouseMoveRef =  (event) => this.onMouseMove(event)
        this.onMouseUpRef = (event) => this.onMouseUp(event)
        this.onTouchStartRef = (event) => this.onTouchStart(event)
        this.onTouchEndRef = (event) => this.onTouchEnd(event)
        this.onTouchMoveRef = (event) => this.onTouchMove(event)
        this.onKeyDownRef = (event) => this.onKeyDown(event)
        let element = this.domElement
        element.addEventListener('contextmenu',this.onContextMenu,false)
        element.addEventListener('mousedown',this.onMouseDownRef,false)
        element.addEventListener('mousewheel',this.onMouseWheelRef,false)
        element.addEventListener('touchstart',this.onTouchStartRef,false)
        element.addEventListener('touchend',this.onTouchEndRef,false)
        element.addEventListener('touchmove',this.onTouchMoveRef,false)
        window.addEventListener('keydown',this.onKeyDownRef,false)
    }

    disconnect() {
        this.enabled = false
        this.reset() // reset the controls for when switching to VRControls
        this.domElement.removeEventListener('contextmenu',this.onContextMenu,false)
        this.domElement.removeEventListener('mousedown',this.onMouseDownRef,false)
        this.domElement.removeEventListener('mousewheel',this.onMouseWheelRef ,false)
        this.domElement.removeEventListener('touchstart',this.onTouchStartRef,false)
        this.domElement.removeEventListener('touchend',this.onTouchEndRef,false)
        this.domElement.removeEventListener('touchmove',this.onTouchMoveRef,false)
        document.removeEventListener('mousemove',this.onMouseMove,false)
        document.removeEventListener('mouseup',this.onMouseUp,false)
        window.removeEventListener('keydown',this.onKeyDown,false)
    }

    saveState() {
        this.target0.copy(this.target)
        this.position0.copy(this.object.position)
        this.zoom0 = this.object.zoom
    }

    reset() {
        this.target.copy(this.target0)
        this.object.position.copy(this.position0)
        this.object.zoom = this.zoom0
        this.object.updateProjectionMatrix()
        this.dispatchChange()
        this.update()
        this.state = STATE.NONE
    }


    update() {
        const offset = new T.Vector3()
        const quat = new T.Quaternion().setFromUnitVectors(
            this.object.up,new T.Vector3(0,1,0))
        const quatInverse = quat.clone().inverse()
        const lastPosition = new T.Vector3()
        const lastQuaternion = new T.Quaternion()
        const position = this.object.position
        offset.copy(position).sub(this.target)
        offset.applyQuaternion(quat)
        this.spherical.setFromVector3(offset)
        this.spherical.theta += this.sphericalDelta.theta
        this.spherical.phi += this.sphericalDelta.phi

        this.spherical.theta = Math.max(this.minAzimuthAngle,
            Math.min(this.maxAzimuthAngle, this.spherical.theta))

        this.spherical.phi = Math.max(this.minPolarAngle,
            Math.min(this.maxPolarAngle, this.spherical.phi ))

        this.spherical.makeSafe()
        this.spherical.radius *= this.scale
        this.spherical.radius = Math.max(this.minDistance,
            Math.min(this.maxDistance, this.spherical.radius))

        this.target.add(this.panOffset) // move target to panned location
        offset.setFromSpherical(this.spherical)
        offset.applyQuaternion(quatInverse) // rotate offset back to up
        position.copy(this.target).add(offset)
        this.object.lookAt(this.target)
        if (this.enableDamping===true) {
            this.sphericalDelta.theta *= (1-this.dampingFactor)
            this.sphericalDelta.phi *= (1-this.dampingFactor)
        } else this.sphericalDelta.set(0,0,0)
        this.scale = 1
        this.panOffset.set(0,0,0)
        if (!this.zoomChanged
            || lastPosition.distanceToSquared(this.object.position)<=EPS
            || 8*(1-lastQuaternion.dot(this.object.quaternion))<=EPS)
                return false
        this.dispatchChange()
        lastPosition.copy(this.object.position)
        lastQuaternion.copy(this.object.quaternion)
        this.zoomChanged = false
        return true
    }
}
