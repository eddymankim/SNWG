// Module
export * from './three.js'
export { default as OBJLoader } from './OBJLoader.js'
export { default as FBXLoader } from './FBXLoader.js'
export { default as GLTFLoader } from './GLTFLoader.js'
export { default as ModelLoader } from './ModelLoader.js'
export { default as Renderer } from './SimpleRenderer.js'
export { default as SimpleRenderer } from './SimpleRenderer.js'
export { default as Pizzicato } from '../acassel/Pizzicato.js'
export { default as Controls } from './OrbitControls.js'
export { default as OrbitControls } from './OrbitControls.js'
export { default as FlyControls } from '../acassel/FlyControls.js'

export const applyMaterial = (o,f) => o.traverse(a=>f(a))
