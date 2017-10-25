///
/// @author zz85 https://github.com/zz85
/// @author mrdoob http://mrdoob.com
/// @author evan-erdos http://bescott.org
///
/// controller which drags objects around the screen
///
import * as M from '../module.js'

export default class DragControls extends M.EventDispatcher {
    constructor ({objects=[], camera=null, domElement=null}={}) {
        let plane = new M.Plane()
        let raycaster = new M.Raycaster(), mouse = new M.Vector2()
        let offset = new M.Vector3(), intersection = new M.Vector3()
        let selected = null, hovered = null
        let scope = this

        this.enabled = true

        this.activate = () => {
            domElement.addEventListener('mousemove', mousemove, false)
            domElement.addEventListener('mousedown', mousedown, false)
            domElement.addEventListener('mouseup', mousecancel, false)
            domElement.addEventListener('mouseleave', mousecancel, false)
            domElement.addEventListener('touchmove', touchmove, false)
            domElement.addEventListener('touchstart', touchstart, false)
            domElement.addEventListener('touchend', touchend, false)
        }

        this.deactivate = () => {
            domElement.removeEventListener('mousemove', mousemove, false)
            domElement.removeEventListener('mousedown', mousedown, false)
            domElement.removeEventListener('mouseup', mousecancel, false)
            domElement.removeEventListener('mouseleave', mousecancel, false)
            domElement.removeEventListener('touchmove', touchmove, false)
            domElement.removeEventListener('touchstart', touchstart, false)
            domElement.removeEventListener('touchend', touchend, false)
        }

        this.dispose = () => this.deactivate()

        const mousemove = (event) => { event.preventDefault()
            var rect = domElement.getBoundingClientRect()
            mouse.x = +((event.clientX-rect.left)/rect.width)*2-1
            mouse.y = -((event.clientY-rect.top)/rect.height)*2+1
            raycaster.setFromCamera(mouse, camera)

            if (selected && scope.enabled) {
                if (raycaster.ray.intersectPlane(plane, intersection))
                    selected.position.copy(intersection.sub(offset))
                scope.dispatchEvent({ type: 'drag', object: selected })
                return
            }

            raycaster.setFromCamera(mouse, camera)
            var intersects = raycaster.intersectObjects(objects)

            if (intersects.length > 0) {
                var object = intersects[0].object
                plane.setFromNormalAndCoplanarPoint(
                    camera.getWorldDirection(plane.normal), object.position)
                if (hovered !== object) {
                    scope.dispatchEvent({ type: 'hoveron', object: object })
                    domElement.style.cursor = 'pointer'
                    hovered = object
                }
            } else if (hovered !== null) {
                scope.dispatchEvent({ type: 'hoveroff', object: hovered })
                domElement.style.cursor = 'auto'
                hovered = null
            }
        }

        const mousedown = (event) => { event.preventDefault()
            raycaster.setFromCamera(mouse, camera)
            var intersects = raycaster.intersectObjects(objects)
            if (intersects.lengt<=0) return
            selected = intersects[0].object
            if (raycaster.ray.intersectPlane(plane, intersection))
                offset.copy(intersection).sub(selected.position)
            domElement.style.cursor = 'move'
            scope.dispatchEvent({ type: 'dragstart', object: selected })
        }


        const mousedown = (event) => { event.preventDefault()
            domElement.style.cursor = 'auto'
            if (!selected) return
            scope.dispatchEvent({ type: 'dragend', object: selected })
            selected = null
        }

        const touchmove = (event) => { event.preventDefault()
            event = event.changedTouches[0]
            var rect = domElement.getBoundingClientRect()
            mouse.x = +((event.clientX-rect.left)/rect.width)*2-1
            mouse.y = -((event.clientY-rect.top)/rect.height)*2+1
            raycaster.setFromCamera(mouse, camera)
            if (!selected || !scope.enabled) return
            if (raycaster.ray.intersectPlane(plane, intersection))
                selected.position.copy(intersection.sub(offset))
            scope.dispatchEvent({ type: 'drag', object: selected })
        }


        const touchstart = (event) => { event.preventDefault()
            event = event.changedTouches[0]
            var rect = domElement.getBoundingClientRect()
            mouse.x = +((event.clientX-rect.left)/rect.width)*2-1
            mouse.y = -((event.clientY-rect.top)/rect.height)*2+1
            raycaster.setFromCamera(mouse, camera)
            var intersects = raycaster.intersectObjects(objects)
            if (intersects.length<=0) return
            selected = intersects[0].object
            plane.setFromNormalAndCoplanarPoint(
                camera.getWorldDirection(plane.normal), selected.position)
            if (raycaster.ray.intersectPlane(plane, intersection))
                offset.copy(intersection).sub(selected.position)
            domElement.style.cursor = 'move'
            scope.dispatchEvent({ type: 'dragstart', object: selected })
        }

        const touchend = (event) => { event.preventDefault()
            domElement.style.cursor = 'auto'
            if (!selected) return
            scope.dispatchEvent({ type: 'dragend', object: selected })
            selected = null
        }

        activate()
    }
}
