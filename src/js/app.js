import * as THREE from 'three';
import imagesLoaded from 'imagesloaded';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';

import imageVertex from './shaders/image-vertex.glsl'
import imageFragment from './shaders/image-fragment.glsl'

import backgroundVertex from './shaders/background-vertex.glsl'
import backgroundFragment from './shaders/background-fragment.glsl'

class Sketch {
    constructor(options) {
        this.time = 0;

        this.loaderScreen = document.querySelector('.loading');

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

        // this.images = [this.images[0]];

        const loadImages = new Promise((resolve) => imagesLoaded(
            document.querySelectorAll('img'), { background: true }, resolve)
        );

        this.currentScroll = 0;


        Promise.all([loadImages]).then(() => {
            this.setupResize();
            this.addImages();
            this.setImagePosition();
            this.setupScroll();
            this.animateRGBEffect();
            this.addBackground();
            this.render();


            this.loaderScreen.remove();

        });

    }

    resize() {
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;

        this.camera.aspect = this.width / this.height;
        this.camera.fov = 2 * Math.atan((this.height / 2) / this.camera.position.z) * (180 / Math.PI);

        this.renderer.setSize(this.width, this.height);

        this.camera.updateProjectionMatrix();

        this.imageStore.forEach((image) => {
            const { top, left, width, height } = image.img.getBoundingClientRect();
            image.mesh.scale.set(width, height);
            image.top = top;
            image.left = left;
            image.width = width;
            image.height = height;
        });

        this.setImagePosition();

    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    setupScroll() {
        this.lenis = new Lenis({ lerp: 0.05 })

        this.lenis.on('scroll', (e) => {
            this.currentScroll += e.velocity;
            this.setImagePosition();
            this.animateRGBEffect();

        })

    }

    animateRGBEffect() {

        this.imageStore.forEach((image) => {

            if (image.top < this.currentScroll + this.height && image.top + image.height > this.currentScroll) {
                gsap.to(image.mesh.material.uniforms.strength, {
                    value: 0,
                    delay: .3,
                    duration: 3,

                })
            }
            else {
                gsap.to(image.mesh.material.uniforms.strength, {
                    value: 1,
                    duration: .4
                })
            }
        });
    }

    addImages() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                image: { value: null },
                strength: { value: 1.0 },
                hoverState: { value: new THREE.Vector3(0, 0, 0) }
            },
            vertexShader: imageVertex,
            fragmentShader: imageFragment,
            wireframe: false
        })

        this.materials = [];

        this.imageStore = this.images.map((img) => {
            const { top, left, width, height } = img.getBoundingClientRect();

            img.style.opacity = 0;

            const geometry = new THREE.PlaneGeometry(1, 1, 20, 2);
            const texture = new THREE.TextureLoader().load(img.src);

            const material = this.material.clone();
            material.uniforms.image.value = texture;
            this.materials.push(material);

            img.addEventListener('mouseenter', () => {
                gsap.to(material.uniforms.hoverState.value, {
                    duration: .6,
                    x: 1,
                    ease: 'power1.inOut',
                })
                gsap.to(material.uniforms.hoverState.value, {
                    duration: .8,
                    y: 1,
                    ease: 'power1.inOut'
                })
                gsap.to(material.uniforms.hoverState.value, {
                    duration: 1,
                    z: 1,
                    ease: 'power1.inOut'
                })

            })

            img.addEventListener('mouseleave', () => {
                gsap.to(material.uniforms.hoverState.value, {
                    duration: .6,
                    x: 0,
                    ease: 'power1.inOut'
                })
                gsap.to(material.uniforms.hoverState.value, {
                    duration: .8,
                    y: 0,
                    ease: 'power1.inOut'
                })
                gsap.to(material.uniforms.hoverState.value, {
                    duration: 1,
                    z: 0,
                    ease: 'power1.inOut'
                })
            })



            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(width, height);

            this.scene.add(mesh);

            return ({
                mesh,
                img,
                top,
                left,
                width,
                height
            });
        })
    }

    setImagePosition() {
        this.imageStore.forEach(image => {
            //Converting coordinates from page (0,0 is in topleft) to three (0,0 is in center)
            image.mesh.position.x = -this.width / 2 + image.left + image.width / 2;
            image.mesh.position.y = this.height / 2 - image.top - image.height / 2 + this.currentScroll;

        })
    }

    addBackground() {
        this.backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                image: { value: null },
                strength: { value: 1.0 },
                hoverState: { value: new THREE.Vector3(0, 0, 0) }
            },
            vertexShader: backgroundVertex,
            fragmentShader: backgroundFragment,
            wireframe: false,

        });
        // Create a full-screen quad geometry
        const quad = new THREE.PlaneGeometry(this.width * 2, this.height * 2, 1, 1);
        // quad.scale(this.height, this.width);
        // Create a quad mesh with the shader material
        const quadMesh = new THREE.Mesh(quad, this.backgroundMaterial);

        quadMesh.position.z = -2;

        this.scene.add(quadMesh);

    }

    render(time) {
        this.time += 0.02;
        this.materials.forEach((material) => material.uniforms.time.value = this.time);

        // this.backgroundMaterial.uniforms.time.value = time;
        // this.customPass.uniforms.scrollSpeed.value = this.lenis.velocity;

        this.lenis.raf(time)
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(this.render.bind(this)); //We use bind(this) so that the context of 'this' doesn't get lost (or something like that)
    }
}


new Sketch({
    dom: document.getElementById('three-container'),
})
