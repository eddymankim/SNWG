///
/// @author qiao / https://github.com/qiao
/// @author mrdoob / http://mrdoob.com
/// @author alteredq / http://alteredqualia.com/
/// @author WestLangley / http://github.com/WestLangley
/// @author erich666 / http://erichaines.com
/// @author danrossi / https://www.electroteque.org
/// @author bescott / https://www.bescott.org
///
/// OrbitControls for mouse and keyboard controls
/// Changes to turn it into a three.js module for bundling
/// changes to fix bundling and to clean up style
///
import * as THREE from '../module.js'

const EPS = 0.000001
const DEG = 2 * Math.PI / 360
const STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 }

export default class OrbitControls extends THREE.EventDispatcher {
    constructor(object, domElement) { super()
        this.object = object
        this.domElement = domElement || document
        this.enabled = true // Set to false to disable this control
        this.target = new THREE.Vector3() // the location of focus, orbits around
        this.minDistance = 0 // How far you can dolly in and out
        this.maxDistance = 2**18 // used by PerspectiveCamera only
        this.minZoom = 0 // How far you can zoom in and out
        this.maxZoom = Infinity // used by OrthographicCamera only
        this.minPolarAngle = 0 // how far you can orbit vertically, upper and lower limits
        this.maxPolarAngle = Math.PI // range is 0 to Math.PI radians
        this.minAzimuthAngle = -Infinity // horizontal orbit limits, min and max, radians
        this.maxAzimuthAngle = Infinity // must be a sub-interval of [-Math.PI, Math.PI]
        this.enableDamping = false // set to true to enable damping (inertia)
        this.dampingFactor = 0.25 // requires that update is called in your animation loop
        this.keyDampingFactor = 0.10 // the damping factor for keys, a smoother response
        this.enableZoom = true // set to false to disable zooming, enables dollying in and out
        this.zoomSpeed = 1.0 // speed of zooming
        this.enableRotate = true // set to false to disable rotating
        this.rotateSpeed = 1.0 // speed of rotation
        this.enablePan = true // set to false to disable panning
        this.keyPanSpeed = 7.0 // pixels moved per arrow key push
        this.enableKeys = true // Set to false to disable use of the keys
        this.keys = { left: 37, up: 38, right: 39, bottom: 40 } // The four arrow keys
        this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT }

        // for reset
        this.target0 = this.target.clone()
        this.position0 = this.object.position.clone()
        this.zoom0 = this.object.zoom
        this.state = STATE.NONE

        // current position in spherical coordinates
        this.spherical = new THREE.Spherical()
        this.sphericalDelta = new THREE.Spherical()

        this.scale = 1
        this.panOffset = new THREE.Vector3()
        this.zoomChanged = false

        this.rotateStart = new THREE.Vector2()
        this.rotateEnd = new THREE.Vector2()
        this.rotateDelta = new THREE.Vector2()

        this.panStart = new THREE.Vector2()
        this.panEnd = new THREE.Vector2()
        this.panDelta = new THREE.Vector2()

        this.dollyStart = new THREE.Vector2()
        this.dollyEnd = new THREE.Vector2()
        this.dollyDelta = new THREE.Vector2()

        this.connect()
        this.update() // force an update at start
    }

    getPolarAngle() { return this.spherical.phi }
    getAzimuthalAngle() { return this.spherical.theta }
    getAutoRotationAngle() { return DEG * this.autoRotateSpeed }
    getZoomScale() { return Math.pow(0.95,this.zoomSpeed) }
    rotateLeft(angle) { this.sphericalDelta.theta -= angle }
    rotateUp(angle) { this.sphericalDelta.phi -= angle }

    panLeft(distance, objectMatrix) {
        const v = new THREE.Vector3()
        v.setFromMatrixColumn(objectMatrix,0) // get X column
        v.multiplyScalar(-distance)
        this.panOffset.add(v)
    }

    panUp(distance, objectMatrix) {
        const v = new THREE.Vector3()
        v.setFromMatrixColumn(objectMatrix,1) // get Y column
        v.multiplyScalar(distance)
        this.panOffset.add(v)
    }

    // deltaX and deltaY are in pixels right and down are positive
    pan(deltaX, deltaY) {
        const offset = new THREE.Vector3()
        const element = this.domElement === document ? this.domElement.body : this.domElement
        if (this.object instanceof THREE.PerspectiveCamera) { // perspective
            const position = this.object.position
            offset.copy(position).sub(this.target)
            let targetDistance = offset.length()
            // half of the fov is center to top of screen
            targetDistance *= Math.tan((this.object.fov/2)*Math.PI/180.0 )
            // we actually don't use screenWidth, since perspective camera is fixed to screen height
            this.panLeft(2*deltaX*targetDistance/element.clientHeight, this.object.matrix)
            this.panUp(2 * deltaY * targetDistance / element.clientHeight, this.object.matrix)
        } else if (this.object instanceof THREE.OrthographicCamera) { // orthographic
            this.panLeft(deltaX * (this.object.right - this.object.left) / this.object.zoom / element.clientWidth, this.object.matrix )
            this.panUp( deltaY * (this.object.top - this.object.bottom) / this.object.zoom / element.clientHeight, this.object.matrix )
        } else this.enablePan = false
    }

    dollyIn(dollyScale) {
        if (this.object instanceof THREE.OrthographicCamera) {
            this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom,this.object.zoom*dollyScale))
            this.object.updateProjectionMatrix()
            this.zoomChanged = true
        } else if (this.object instanceof THREE.PerspectiveCamera) this.scale /= dollyScale
        else this.enableZoom = false;
    }

    dollyOut(dollyScale) {
        if (this.object instanceof THREE.OrthographicCamera) {
            this.object.zoom = Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/dollyScale))
            this.object.updateProjectionMatrix()
            this.zoomChanged = true
        } else if (this.object instanceof THREE.PerspectiveCamera) this.scale *= dollyScale
        else this.enableZoom = false
    }


    /// auto rotation
    /// @param speed
    rotateVertical(speed) { this.rotateUp(THREE.Math.degToRad(speed)); this.update() }
    rotateHorizontal(speed) { this.rotateLeft(THREE.Math.degToRad(speed)); this.update() }
    setKeyDampingFactor() { this.dampingFactor = this.keyDampingFactor }

    /// move API
    moveLeft() { this.setKeyDampingFactor(); this.rotateHorizontal(this.rotateSpeed) }
    moveRight() { this.setKeyDampingFactor(); this.rotateHorizontal(-this.rotateSpeed) }
    moveDown() { this.setKeyDampingFactor(); this.rotateVertical(-this.rotateSpeed) }
    moveUp() { this.setKeyDampingFactor(); this.rotateVertical(this.rotateSpeed) }


    /// Keyboard controls with auto rotation
    /// @param event
    handleKeyDown(event) {
        switch (event.keyCode) {
            case this.keys.up: this.moveUp(); break
            case this.keys.bottom: this.moveDown(); break
            case this.keys.left: this.moveLeft(); break
            case this.keys.right: this.moveRight(); break
        }
    }


    handleTouchStartRotate(event) { this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY) }
    handleTouchStartPan(event) { this.panStart.set(event.touches[0].pageX,event.touches[0].pageY) }
    handleTouchStartDolly(event) {
        const dx = event.touches[0].pageX-event.touches[1].pageX
        const dy = event.touches[0].pageY-event.touches[1].pageY
        this.dollyStart.set(0, Math.sqrt(dx*dx+dy*dy)) }

    handleTouchMoveRotate(event) {
        this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY)
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart)
        const element = this.domElement === document ? this.domElement.body : this.domElement
        this.rotateLeft(2*Math.PI*this.rotateDelta.x/element.clientWidth*this.rotateSpeed)
        this.rotateUp( 2*Math.PI*this.rotateDelta.y/element.clientHeight*this.rotateSpeed)
        this.rotateStart.copy(this.rotateEnd)
        this.update() }

    handleTouchMoveDolly(event) {
        const dx = event.touches[0].pageX-event.touches[1].pageX
        const dy = event.touches[0].pageY-event.touches[1].pageY
        this.dollyEnd.set(0, Math.sqrt(dx*dx + dy*dy))
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart)
        if (0<this.dollyDelta.y) this.dollyOut(this.getZoomScale())
        else if (this.dollyDelta.y<0) this.dollyIn(this.getZoomScale())
        this.dollyStart.copy(this.dollyEnd)
        this.update() }

    handleTouchMovePan(event) {
        this.panEnd.set(event.touches[0].pageX,event.touches[0].pageY)
        this.panDelta.subVectors(this.panEnd,this.panStart)
        this.pan(this.panDelta.x,this.panDelta.y)
        this.panStart.copy(this.panEnd)
        this.update() }

    handleTouchEnd(event) { /* console.log('handleTouchEnd') */ }


    onTouchStart(event) {
        if (this.enabled===false) return
        switch (event.touches.length) {
            case 1: // one-fingered touch: rotate
                if (this.enableRotate===false) return
                this.handleTouchStartRotate(event)
                this.state = STATE.TOUCH_ROTATE
                break
            case 2: // two-fingered touch: dolly
                if (this.enableZoom===false) return
                this.handleTouchStartDolly(event)
                this.state = STATE.TOUCH_DOLLY
                break
            case 3: // three-fingered touch: pan
                if (this.enablePan===false) return
                this.handleTouchStartPan(event)
                this.state = STATE.TOUCH_PAN
                break
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
        event.preventDefault()
        event.stopPropagation()
        switch (event.touches.length) {
            case 1: // one-fingered touch: rotate
                if (this.enableRotate===false) return
                this.handleTouchMoveRotate(event); break
            case 2: // two-fingered touch: dolly
                if (this.enableZoom===false) return
                this.handleTouchMoveDolly(event); break
            case 3: // three-fingered touch: pan
                if (this.enablePan===false) return
                this.handleTouchMovePan(event); break
            default: this.state = STATE.NONE
        }
    }

    onTouchEnd(event) {
        if (this.enabled===false) return
        this.handleTouchEnd(event)
        this.dispatchEnd()
        this.state = STATE.NONE
    }


    handleMouseDownRotate(event) { this.rotateStart.set(event.clientX, event.clientY) }
    handleMouseDownDolly(event) { this.dollyStart.set(event.clientX, event.clientY) }
    handleMouseDownPan(event) { this.panStart.set(event.clientX, event.clientY) }
    handleMouseMoveRotate(event) {
        this.rotateEnd.set(event.clientX, event.clientY)
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart)
        const element = this.domElement === document ? this.domElement.body : event.target
        this.rotateLeft(2*Math.PI*this.rotateDelta.x/element.clientWidth*this.rotateSpeed)
        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.rotateUp(2*Math.PI*this.rotateDelta.y/element.clientHeight*this.rotateSpeed)
        this.rotateStart.copy(this.rotateEnd)
        this.update() }

    handleMouseMoveDolly(event) {
        this.dollyEnd.set(event.clientX, event.clientY)
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart)
        if (this.dollyDelta.y>0) this.dollyIn(this.getZoomScale())
        else if (this.dollyDelta.y<0) this.dollyOut(this.getZoomScale())
        this.dollyStart.copy(this.dollyEnd)
        this.update() }

    handleMouseMovePan(event) {
        this.panEnd.set(event.clientX, event.clientY)
        this.panDelta.subVectors(this.panEnd, this.panStart)
        this.pan(this.panDelta.x, this.panDelta.y)
        this.panStart.copy(this.panEnd)
        this.update() }


    handleMouseUp(event) { /* console.log('handleMouseUp') */ }

    handleMouseWheel(event) {
        let delta = 0
        if (event.wheelDelta!==undefined) delta = event.wheelDelta
        else if (event.detail!==undefined) delta = - event.detail
        if (delta>0) this.dollyOut(this.getZoomScale())
        else if (delta<0) this.dollyIn(this.getZoomScale())
        this.update() }

    /// event handlers - FSM: listen for events and reset state
    onMouseDown(event) {
        if (this.enabled===false) return
        if (this.domElement!==event.target) return
        event.preventDefault() // disable events when triggered by overlay
        this.dampingFactor = this.mouseDampingFactor // reset damping factor
        this.activeElement = event.target

        switch (event.button) {
            case this.mouseButtons.ORBIT:
                if (this.enableRotate===false) return
                this.handleMouseDownRotate(event)
                this.state = STATE.ROTATE; break
            case this.mouseButtons.ZOOM:
                if (this.enableZoom===false) return
                this.handleMouseDownDolly(event)
                this.state = STATE.DOLLY; break
            case this.mouseButtons.PAN:
                if (this.enablePan===false) return
                this.handleMouseDownPan(event)
                this.state = STATE.PAN; break
        }

        if (this.state!==STATE.NONE) {
            const onMoveCheck = () => {
                this.dispatchStart(); document.removeEventListener('mousemove', onMoveCheck) }
            document.addEventListener('mousemove', onMoveCheck , false)
            document.addEventListener('mousemove', this.onMouseMoveRef, false)
            document.addEventListener('mouseup', this.onMouseUpRef, false)
            document.addEventListener('mouseout', this.onMouseUpRef, false)
        }
    }

    onMouseMove(event) {
        if (this.enabled===false) return
        event.preventDefault()
        if (this.state===STATE.ROTATE && this.enableRotate===true) this.handleMouseMoveRotate(event)
        else if (this.state===STATE.DOLLY && this.enableZoom===true) this.handleMouseMoveDolly(event)
        else if (this.state===STATE.PAN && this.enablePan===true) this.handleMouseMovePan(event)
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
        event.preventDefault()
        event.stopPropagation()
        this.handleMouseWheel(event)
        this.dispatchStart()
        this.dispatchEnd() }

    onKeyDown(event) {
        if (this.enabled===false || this.enableKeys===false) return
        this.dampingFactor = this.keyDampingFactor
        this.handleKeyDown(event) }

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
        this.domElement.addEventListener('contextmenu',this.onContextMenu,false)
        this.domElement.addEventListener('mousedown', this.onMouseDownRef, false)
        this.domElement.addEventListener('mousewheel', this.onMouseWheelRef, false)
        this.domElement.addEventListener('touchstart', this.onTouchStartRef, false)
        this.domElement.addEventListener('touchend', this.onTouchEndRef, false)
        this.domElement.addEventListener('touchmove', this.onTouchMoveRef, false)
        window.addEventListener('keydown', this.onKeyDownRef, false) }

    disconnect() {
        this.enabled = false
        this.reset() // reset the controls for when switching to VRControls
        this.domElement.removeEventListener('contextmenu', this.onContextMenu, false)
        this.domElement.removeEventListener('mousedown', this.onMouseDownRef, false)
        this.domElement.removeEventListener('mousewheel', this.onMouseWheelRef , false)
        this.domElement.removeEventListener('touchstart', this.onTouchStartRef, false)
        this.domElement.removeEventListener('touchend', this.onTouchEndRef, false)
        this.domElement.removeEventListener('touchmove', this.onTouchMoveRef, false)
        document.removeEventListener('mousemove', this.onMouseMove, false)
        document.removeEventListener('mouseup', this.onMouseUp, false)
        window.removeEventListener('keydown', this.onKeyDown, false)
        // this.dispatchEvent( { type: 'dispose' } ); // should this be added here?
    }

    saveState() {
        this.target0.copy(this.target)
        this.position0.copy(this.object.position)
        this.zoom0 = this.object.zoom }

    reset() {
        this.target.copy(this.target0)
        this.object.position.copy(this.position0)
        this.object.zoom = this.zoom0
        this.object.updateProjectionMatrix()
        this.dispatchChange()
        this.update()
        this.state = STATE.NONE }


    update() {
        const offset = new THREE.Vector3()
        const quat = new THREE.Quaternion().setFromUnitVectors(this.object.up,new THREE.Vector3(0,1,0))
        const quatInverse = quat.clone().inverse()
        const lastPosition = new THREE.Vector3()
        const lastQuaternion = new THREE.Quaternion()
        const position = this.object.position
        offset.copy(position).sub(this.target)
        offset.applyQuaternion(quat)
        this.spherical.setFromVector3(offset)
        this.spherical.theta += this.sphericalDelta.theta
        this.spherical.phi += this.sphericalDelta.phi

        // restrict theta to be between desired limits
        this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta))

        // restrict phi to be between desired limits
        this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi ))

        this.spherical.makeSafe()
        this.spherical.radius *= this.scale

        // restrict radius to be between desired limits
        this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius))
        this.target.add(this.panOffset) // move target to panned location
        offset.setFromSpherical(this.spherical)
        offset.applyQuaternion(quatInverse) // rotate offset back to upwards space
        position.copy(this.target).add(offset)
        this.object.lookAt(this.target)
        if (this.enableDamping===true) {
            this.sphericalDelta.theta *= (1-this.dampingFactor)
            this.sphericalDelta.phi *= (1-this.dampingFactor)
        } else this.sphericalDelta.set(0,0,0)
        this.scale = 1
        this.panOffset.set( 0, 0, 0 )

        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8
        if (!this.zoomChanged || lastPosition.distanceToSquared(this.object.position)<=EPS
            || 8*(1-lastQuaternion.dot(this.object.quaternion))<=EPS) return false
        this.dispatchChange()
        lastPosition.copy(this.object.position)
        lastQuaternion.copy(this.object.quaternion)
        this.zoomChanged = false
        return true
    }
}
