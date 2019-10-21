import * as styles from './DOMRenderer.scss';
import { Canvas, VisibleTile, ScreenCoord, RenderPhase } from "../canvas";
import { MapCoord, toView, tileWidth, tileHeight } from "../../hex/hexGeo";

export class DOMRenderer {
    private canvas: Canvas;
    canvasElement: HTMLElement;

    constructor() {
    }

    init(canvas: Canvas) {
        this.canvas = canvas;
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.canvas);
    }

    getContainerElement(): HTMLElement {
        return this.canvasElement;
    }

    updateTransform(offset: ScreenCoord, zoom: number): void {
        this.canvasElement.style.transform = `translate(${offset.sx}px, ${-offset.sy}px) scale(${zoom}, ${zoom})`;
    }

    createNewTileContainer(tile: VisibleTile, renderPhase: RenderPhase): void {
        const div = document.createElement('div');
        div.classList.add(styles.tile);
        this.canvasElement.appendChild(div);

        tile.canvas = {
            containerElement: div,
            renderPhase: renderPhase,
        };
    }

    removeTileContainer(tile: VisibleTile): void {
        tile.canvas.containerElement.remove();
    }

    setTileTransform(tile: VisibleTile, m: MapCoord): void {
        if (tile.canvas) {
            const w = toView(m);

            const cx = this.canvas.rect.width / 2 - tileWidth / 2;
            const cy = this.canvas.rect.height / 2 - tileHeight / 2;

            const tx = cx + w.wx;
            const ty = cy - w.wy;
            (tile.canvas.containerElement as HTMLElement).style.transform = `translate(${tx}px, ${ty}px) rotate(0deg)`;
        }
    }

    resize() {

    }

    release() {

    }
}