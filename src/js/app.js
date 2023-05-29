import * as THREE from 'three';
import imagesLoaded from 'imagesloaded';
import Lenis from '@studio-freight/lenis';

class Sketch {
    constructor(options) {
        this.time = 0;

        this.container = options.dom;
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 10;
        this.camera.fov = 2 * Math.atan((this.height / 2) / this.camera.position.z) * (180 / Math.PI);
        this.camera.updateProjectionMatrix();


        this.container.appendChild(this.renderer.domElement);


        this.images = [...document.querySelectorAll('.shader img')];

        const loadImages = new Promise((resolve) => imagesLoaded(
            document.querySelectorAll('img'), { background: true }, resolve)
        );


        Promise.all([loadImages]).then(() => {
            this.addObjects()
            this.setupResize();


            this.render();

        })

    }

    resize() {
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;

        this.camera.aspect = this.width / this.height;
        this.camera.fov = 2 * Math.atan((this.height / 2) / this.camera.position.z) * (180 / Math.PI);

        this.renderer.setSize(this.width, this.height);

        this.camera.updateProjectionMatrix();

    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    addImages() {

    }

    addObjects() {
        this.geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);

    }

    render(time) {
        this.time += 0.05;
        // this.materials.forEach((material) => material.uniforms.time.value = this.time);

        // this.customPass.uniforms.scrollSpeed.value = this.lenis.velocity;

        // this.lenis.raf(time)
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(this.render.bind(this)); //We use bind(this) so that the context of 'this' doesn't get lost (or something like that)
    }
}


new Sketch({
    dom: document.getElementById('three-container'),
})
