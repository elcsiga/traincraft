import { PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer } from 'three';

import * as styles from './canvas3D.scss';

export class Canvas3D {
    private containerElement: HTMLElement;

    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private geometry: BoxGeometry;
    private material: MeshNormalMaterial;
    private mesh: Mesh;

    constructor() {
        this.containerElement = document.createElement('div');
        this.containerElement.classList.add(styles.container);

        this.init();
        this.animate();
    }

    init(): void {
        this.camera = new PerspectiveCamera(70, 100 / 100, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new Scene();

        this.geometry = new BoxGeometry(0.2, 0.2, 0.2);
        this.material = new MeshNormalMaterial();

        this.mesh = new Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(100, 100);
        this.containerElement.appendChild(this.renderer.domElement);
    }

    animate = (): void => {
        requestAnimationFrame(this.animate);
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    };

    release(): void {
        this.containerElement.remove();
    }

    getElement(): HTMLElement {
        return this.containerElement;
    }
}