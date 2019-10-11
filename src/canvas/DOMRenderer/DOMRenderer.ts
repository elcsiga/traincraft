import * as styles from './DOMRenderer.scss';
import { Canvas, VisibleTile, ScreenCoord } from "../canvas";
import { MapCoord, toView, tileWidth, tileHeight } from "../../hex/hexGeo";

export class DOMRenderer {
    canvasElement: HTMLElement;

    constructor(private canvas: Canvas) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.canvas);
    }

    updateTransform(offset: ScreenCoord, zoom: number): void {
        this.canvasElement.style.transform = `translate(${offset.sx}px, ${-offset.sy}px) scale(${zoom}, ${zoom})`;
    }

    createNewTileContainer(): HTMLElement {
        const div = document.createElement('div');
        div.classList.add(styles.tile);
        this.canvasElement.appendChild(div);
        return div;
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
            tile.canvas.containerElement.style.transform = `translate(${tx}px, ${ty}px) rotate(0deg)`;
        }
    }
}