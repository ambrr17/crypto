import { log } from './utils.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import perlin from './../libs/perlin/perlin.js'

export default class HeroScene {
    constructor(size = 20) {
        this.size = size
        // this.heroContainer = document.querySelector('#ccc');
        this.heroContainer = document.querySelector('.sc1__bg');

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

        // Добавляем canvas рендера в контейнер
        this.heroContainer.appendChild(this.renderer.domElement);

        // Создаем и добавляем контролы
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        this.camera.position.z = 150

        this.scene.position.x = -100
        this.scene.position.y = -100

        this.groupX = new THREE.Group()
        this.groupY = new THREE.Group()

        this.scene.add(this.groupX)
        this.scene.add(this.groupY)

        //--------------------- Сцена ---------------------
        let material = new THREE.LineBasicMaterial({ color: 0xffff00 });

        // Создаем массив вершин
        for (let j = 0; j < this.size; j++) {
            let verticesX = [];
            let verticesY = [];
            let geometryX = new THREE.BufferGeometry();
            let geometryY = new THREE.BufferGeometry();
            for (let i = 0; i < this.size; i++) {
                verticesX.push(i * 10, j * 10, 0); // x, y, z
                verticesY.push(j * 10, i * 10, 0); // x, y, z
            }
            // Преобразуем массив вершин в Float32Array
            let verticesArrayX = new Float32Array(verticesX);
            let verticesArrayY = new Float32Array(verticesY);
            // Создаем атрибут position и добавляем его в геометрию
            geometryX.setAttribute('position', new THREE.BufferAttribute(verticesArrayX, 3));
            geometryY.setAttribute('position', new THREE.BufferAttribute(verticesArrayY, 3));
            // Создаем меш из геометрии и материала
            let meshX = new THREE.Line(geometryX, material);
            let meshY = new THREE.Line(geometryY, material);
            this.groupX.add(meshX);
            this.groupY.add(meshY);
        }
        // log(new THREE.Vector3(this.groupX.children[1].geometry.attributes.position[0]))
        // log(this.groupX.children[1].geometry.attributes.position.array.length)
        //--------------------- | ---------------------
        // Создаем и добавляем Axes Helper
        const axesHelper = new THREE.AxesHelper(50); // Длина осей 50 единиц
        this.scene.add(axesHelper);

        // Создаем и добавляем Grid Helper
        const gridHelper = new THREE.GridHelper(100, 10); // Размер сетки 100x100 с 10 делениями
        this.scene.add(gridHelper);

        this.time = 0
        this.renderer.setClearColor(parseInt('#141619'.replace('#', '0x'), 16));
        // Устанавливаем анимационный цикл
        this.renderer.setAnimationLoop(() => this.animate());
    }

    animate() {
        this.time++
        this.updateGrid(this.time)
        this.renderer.render(this.scene, this.camera);
    }

    updateGrid(time) {
        for (let i = 0; i < this.size; i++) { // перебор линий по X и линий по Y
            let lineX = this.groupX.children[i].geometry
            let lineY = this.groupY.children[i].geometry
            let posX = lineX.attributes.position.array
            let posY = lineY.attributes.position.array
            for (let j = 0; j < posX.length; j += 3) { // перебор групп вершин каждой линии по 3 (x, y, z)
                const vertexX = new THREE.Vector3().fromArray(posX, j)
                const vertexY = new THREE.Vector3().fromArray(posY, j)
                // vertexX.z = Math.sin((j / 3) * 0.1 + performance.now() * 0.001) * 10
                vertexX.z = 100 * perlin(vertexX.x / 100, vertexX.y / 100, time / 100)
                vertexX.toArray(posX, j)
                vertexY.z = 100 * perlin(vertexY.x / 100, vertexY.y / 100, time / 100)
                vertexY.toArray(posY, j)
            }
            lineX.attributes.position.needsUpdate = true;
            lineY.attributes.position.needsUpdate = true;
        }
    }
}




