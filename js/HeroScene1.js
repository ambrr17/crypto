import { log } from './utils.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import perlin from './../libs/perlin/perlin.js'

export default class HeroScene1 {
    constructor(container, size = 120) {
        this.size = size
        this.heroContainer = document.querySelector(container);
        // this.heroContainer = document.querySelector('.sc1__bg');

        if (!this.heroContainer) {
            console.error('Контейнер #ccc не найден!');
            return;
        }

        // Инициализируем сцену
        this.init();
    }

    init() {
        // Проверка доступности WebGL2
        if (!WebGL.isWebGL2Available()) {
            const warning = THREE.WebGL.getWebGL2ErrorMessage();
            document.getElementById('warning').appendChild(warning);
            return;
        }
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            90,
            this.heroContainer.offsetWidth / this.heroContainer.offsetHeight,
            1,
            3000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.heroContainer.offsetWidth, this.heroContainer.offsetHeight);
        this.renderer.setClearColor(0x000000);
        // this.renderer.setClearColor(parseInt('#141619'.replace('#', '0x'), 16));
        this.heroContainer.appendChild(this.renderer.domElement);

        // Создаем и добавляем контролы
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();
        // Создаем и добавляем Axes Helper
        const axesHelper = new THREE.AxesHelper(50); // Длина осей 50 единиц
        this.scene.add(axesHelper);
        // Создаем и добавляем Grid Helper
        const gridHelper = new THREE.GridHelper(100, 10); // Размер сетки 100x100 с 10 делениями
        this.scene.add(gridHelper);

        this.camera.position.z = 150
        //--------------------- Сцена ---------------------
        let material = new THREE.ShaderMaterial({
            // wireframe: true,
            extensions: {
                derivatives: '#extension GL_OES_standard_derivatives : enable',
            },
            uniforms: {
                time: { type: 'f', value: 0.0 },
                color: { type: 'v3', value: new THREE.Color(0xff0000) }
            },
            // vertexShader: document.getElementById('vertShader').textContent,
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vecPos;
                varying vec3 v_position;

                void main() {
                    vUv = uv;
                    v_position = position.xyz;
                    vecPos = (modelViewMatrix * vec4(v_position, 1.0)).xyz;
                    gl_Position = projectionMatrix * vec4(vecPos, 1.0);
                }
            `,
            // fragmentShader: document.getElementById('fragShader').textContent,
            fragmentShader: `
                varying vec2 vUv;
                varying vec3 v_position;
                
                void main(void) {
                    vec2 st = v_position.xy;

                    vec2 grid = abs(fract(st - 0.5) - 0.5) / fwidth(st);
                    float color = min(grid.x, grid.y);

                    gl_FragColor = vec4(1., 1., 1., 1. - color);
                }
            `,
            side: THREE.DoubleSide,
            transparent: true
        });
        this.geometry = new THREE.PlaneGeometry(60, 60, this.size, this.size)
        this.mesh = new THREE.Mesh(this.geometry, material)

        this.scene.add(this.mesh)

        //--------------------- | ---------------------

        this.time = 0
        // Устанавливаем анимационный цикл
        this.renderer.setAnimationLoop(() => this.animate());
    }

    updatePlane(time) {
        let positions = this.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // positions.setZ(i, 100 * perlin(x / 100, y / 100, time / 100)); // Пример изменения z на основе x
        }
        positions.needsUpdate = true;
    }

    animate() {
        this.time++
        this.updatePlane(this.time)
        this.renderer.render(this.scene, this.camera);
    }
}




