import { PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer, Object3D } from 'three';

import * as styles from './ThreeRenderer.scss';
import { Canvas, ScreenCoord, VisibleTile, RenderPhase } from '../canvas';
import { MapCoord, toView } from '../../hex/hexGeo';
import { Renderer } from '../Renderer';

const materials = [
    
]

export class ThreeRenderer extends Renderer {
    private containerElement: HTMLElement;

    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;

    private canvas: Canvas;

    constructor() {
        super();
        this.containerElement = document.createElement('div');
        this.containerElement.classList.add(styles.container);
    }

    getContainerElement(): HTMLElement {
        return this.containerElement;
    }

    init(canvas: Canvas) {
        this.canvas = canvas;

        this.setup();
        this.animate();
    }

    updateTransform(offset: ScreenCoord, zoom: number): void {

    }
    createNewTileContainer(tile: VisibleTile, renderPhase: RenderPhase): void {
        const tilecontainer = new Object3D();

        this.scene.add(tilecontainer);
        tile.canvas = {
            container: tilecontainer,
            renderPhase: renderPhase
        };
    }

    removeTileContainer(tile: VisibleTile): void {
        this.scene.remove(tile.canvas.container);
    }
    setTileTransform(tile: VisibleTile, m: MapCoord): void {
        if (tile.canvas) {
            const w = toView(m);
            const p = tile.canvas.container.position;
            p.x = w.wx / 300; //TODO
            p.y = w.wy / 300; //TODO
        }
    }

    setup(): void {
        const width = this.containerElement.clientWidth;
        const height = this.containerElement.clientHeight;

        this.camera = new PerspectiveCamera(70, 1, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new Scene();

        // this.geometry = new BoxGeometry(0.2, 0.2, 0.2);
        // this.material = new MeshNormalMaterial();

        // this.mesh = new Mesh(this.geometry, this.material);
        // this.scene.add(this.mesh);

        this.renderer = new WebGLRenderer({ antialias: true });
        this.resize();
        this.containerElement.appendChild(this.renderer.domElement);
    };

    resize(): void {
        const width = this.containerElement.clientWidth;
        const height = this.containerElement.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate(): void {
        requestAnimationFrame(() => this.animate());
    //    this.mesh.rotation.x += 0.01;
    //    this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    };

    release(): void {
        this.containerElement.remove();
    }




}
