import * as styles from './canvas.scss';
import * as emptyTile from '../assets/tiles/empty.png';
import { toView, MapCoord, ViewCoord, toMap } from '../common/geo';

export interface TileData {
    type: number;
    element: HTMLElement;
}

export class Canvas {
    canvasElement: HTMLElement;
    hoveredElement: TileData;

    map: TileData[][] = [];
    mapSize = 6;

    getSafeTile(m: MapCoord): TileData {
        if (m.x >= 0 && m.y >= 0 && m.x < this.mapSize && m.y < this.mapSize) {
            return this.map[m.x][m.y];
        }
        return null;
    }
    constructor() {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.container);

        for (let x = 0; x < this.mapSize; x++) {
            this.map[x] = [];
            for (let y = 0; y < this.mapSize; y++) {
                this.map[x][y] = {
                    type: 0,
                    element: null,
                };
            }
        }

        this.canvasElement.addEventListener('mousemove', e => {
            const w: ViewCoord = { wx:e.x, wy: e.y };
            this.hover( toMap(w));
            console.log (w, toMap(w));
        });
    }

    render(): void {
        for (let x = 0; x < this.mapSize; x++) {
            for (let y = 0; y < this.mapSize; y++) {
                const tile = this.map[x][y];
                const img = document.createElement('img');
                const w = toView({ x, y });
                img.src = emptyTile;
                img.classList.add(styles.tile);
                img.style.transform = `translate(${w.wx}px, ${w.wy}px) rotate(0deg)`;
                this.canvasElement.appendChild(img);
                tile.element = img;
            }
        }
    }

    hover(m: MapCoord) {
        if (this.hoveredElement) {
            this.hoveredElement.element.style.opacity = '1';
        }
        const tile = this.getSafeTile(m);
        if (tile) {
            tile.element.style.opacity = '.7';
            this.hoveredElement = tile;
        }
    }
}
