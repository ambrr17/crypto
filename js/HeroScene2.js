import { log } from './utils.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import * as dat from 'dat.gui';
import Mouse from './Mouse.js';

export default class HeroScene2 {
    constructor(container, size = 120) {
        this.size = size
        this.heroContainer = document.querySelector(container);
        // this.heroContainer = document.querySelector('.sc1__bg');
        this.mousePos = new Mouse(this.heroContainer)

        if (!this.heroContainer) {
            console.error('Контейнер #ccc не найден!');
            return;
        }
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
        // this.camera = new THREE.OrthographicCamera(1000, 1000, 1000, 1000, 0.1, 1000);
        this.camera = new THREE.PerspectiveCamera(10, this.heroContainer.offsetWidth / this.heroContainer.offsetHeight, 1, 3000);

        this.camera.position.y = 3
        this.camera.position.z = 150

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.heroContainer.offsetWidth, this.heroContainer.offsetHeight);
        this.renderer.setClearColor(0x000000);
        // this.renderer.setClearColor(parseInt('#141619'.replace('#', '0x'), 16));
        this.heroContainer.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        const axesHelper = new THREE.AxesHelper(50); // Длина осей 50 единиц
        this.scene.add(axesHelper);

        // const gridHelper = new THREE.GridHelper(100, 10); // Размер сетки 100x100 с 10 делениями
        // this.scene.add(gridHelper);

        // Создаем объект для хранения параметров
        this.params = {
            color1: '#ffcc00',
            color2: '#ff00ff',
            speed: 0.1,
            wireframe: false,
            reset: function () {
                this.color1 = '#ffcc00';
                this.color2 = '#ff00ff';
                this.speed = 0.1;
                this.wireframe = false;

                // Обновляем GUI
                color1Controller.setValue(this.color1);
                color2Controller.setValue(this.color2);
                speedController.setValue(this.speed);
                wireframeController.setValue(this.wireframe);

                // Обновляем материал
                this.material.uniforms.color2.value.set(this.color);
                this.material.wireframe = this.wireframe;
            }
        };

        // Создаем экземпляр Dat.GUI
        const gui = new dat.GUI({ width: 300 }); // Ширина GUI

        // Добавляем контролы для каждого параметра
        const color1Controller = gui.addColor(this.params, 'color1').name('Цвет1');
        const color2Controller = gui.addColor(this.params, 'color2').name('Цвет2');
        const speedController = gui.add(this.params, 'speed', 0.1, 1.1, 0.01).name('Скорость');
        const wireframeController = gui.add(this.params, 'wireframe').name('Проволочная рамка');
        gui.add(this.params, 'reset').name('Сброс'); // Кнопка

        // Назначаем обработчики для обновления материала
        color1Controller.onChange(() => this.updateMaterial());
        color2Controller.onChange(() => this.updateMaterial());
        wireframeController.onChange(() => this.updateMaterial());

        // Для числовых параметров (например, speed) можно также использовать .onChange
        speedController.onChange(() => {
            console.log(`Новая скорость: ${this.params.speed}`);
        });

        // Загружаем текстуру
        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load('./img/111.jpeg');
        //--------------------- Сцена ---------------------
        this.loadShaders('./js/shaders/vertex.glsl', './js/shaders/fragment.glsl').then(shaders => {
            this.material = new THREE.ShaderMaterial({
                // wireframe: true,
                extensions: {
                    derivatives: '#extension GL_OES_standard_derivatives : enable',
                },
                uniforms: {
                    uTexture: { value: this.texture },
                    time: { type: 'f', value: 0.0 },
                    color1: { type: 'v3', value: new THREE.Color(this.params.color1) },
                    color2: { type: 'v3', value: new THREE.Color(this.params.color2) }
                },
                vertexShader: shaders.vertexShader,
                fragmentShader: shaders.fragmentShader,
                side: THREE.DoubleSide,
                transparent: true
            });
            this.geometry = new THREE.PlaneGeometry(600, 600, this.size, this.size)
            this.mesh = new THREE.Mesh(this.geometry, this.material)

            this.scene.add(this.mesh)
            this.mesh.position.set(0, 0, 0)
            this.mesh.rotation.set(Math.PI / 2, 0, 0)

            this.time = 0
            // Устанавливаем анимационный цикл
            this.renderer.setAnimationLoop(() => this.animate());
        })
        //--------------------- | ---------------------

    }

    updateMaterial() {
        // log('updateMaterial()', this.params.color1, this.params.color2)
        this.material.uniforms.color1.value.set(this.params.color1);
        this.material.uniforms.color2.value.set(this.params.color2);
        this.material.wireframe = this.params.wireframe;
    }

    async loadShaders(vertexUrl, fragmentUrl) {
        const [vertexShader, fragmentShader] = await Promise.all([
            fetch(vertexUrl).then(response => response.text()),
            fetch(fragmentUrl).then(response => response.text())
        ]);

        return { vertexShader, fragmentShader };
    }

    animate() {
        // log(this.mousePos)
        this.time += this.params.speed
        this.material.uniforms.time.value = this.time
        this.renderer.render(this.scene, this.camera);
    }
}




