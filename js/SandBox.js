// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.module.js';
import { log } from './utils.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import * as dat from 'dat.gui'
import Mouse from './Mouse.js'

export default class SandBox {
    constructor() {
        this.scene = null
        this.camera = null
        this.renderer = null
        this.mesh = null
        this.material = null

        this.init()
    }

    init() {
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.z = 5

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.prepend(this.renderer.domElement)

        window.addEventListener('resize', this.onWindowResize.bind(this))

        // Создаем объект для хранения параметров
        this.params = {
            speed: 0.01,
            wireframe: false,
            isPlaying: true,
            pause: function () {
                this.isPlaying = !this.isPlaying
            },
            reset: function () {
                this.speed = 0.01
                this.wireframe = false
                speedController.setValue(this.speed)
                wireframeController.setValue(this.wireframe)

                this.material.wireframe = this.wireframe
            }

        }
        const gui = new dat.GUI({ width: 300 })

        const speedController = gui.add(this.params, 'speed', 0.01, 0.3, 0.01).name('Time')
        const wireframeController = gui.add(this.params, 'wireframe').name('Wireframe')
        gui.add(this.params, 'pause').name('Play/Pause animation')
        gui.add(this.params, 'reset').name('Reset settings')

        wireframeController.onChange(() => this.updateMaterial())

        //Scene
        this.loadShaders('./js/shaders/sandbox/vertex.glsl', './js/shaders/sandbox/fragment.glsl').then(shaders => {
            this.material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { type: 'f', value: 0.0 },
                },
                vertexShader: shaders.vertexShader,
                fragmentShader: shaders.fragmentShader,
                // side: THREE.DoubleSide,
                // transparent: true
            })

            const geometry = new THREE.PlaneGeometry(2, 2)

            this.mesh = new THREE.Mesh(geometry, this.material)
            this.scene.add(this.mesh)

            this.renderer.setAnimationLoop(() => this.animate())
        })
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    updateMaterial() {
        this.material.wireframe = this.params.wireframe
    }

    animate() {
        if (this.params.isPlaying) {
            this.material.uniforms.time.value += this.params.speed
        }
        this.renderer.render(this.scene, this.camera)
    }

    async loadShaders(vertexUrl, fragmentUrl) {
        const [vertexShader, fragmentShader] = await Promise.all([
            fetch(vertexUrl).then(response => response.text()),
            fetch(fragmentUrl).then(response => response.text())
        ]);

        return { vertexShader, fragmentShader }
    }
}