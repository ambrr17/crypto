import { log } from './utils.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import WebGL from 'three/addons/capabilities/WebGL.js'

if (!WebGL.isWebGL2Available()) {
    const warning = WebGL.getWebGL2ErrorMessage()
    document.getElementById('warning').appendChild(warning)
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const heroContainer = document.querySelector('.sc1__bg')

renderer.setSize(heroContainer.offsetWidth, heroContainer.offsetHeight)
renderer.setAnimationLoop(animate)

heroContainer.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

camera.position.z = 5

function animate() {

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)

}