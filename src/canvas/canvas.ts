import * as styles from './canvas.scss';
import * as emptyTile from '../assets/tiles/empty.png';
import { toView } from '../common/geo';

export interface TileData {
    type: number;
    element: HTMLElement;
}

export class Canvas {
    canvasElement: HTMLElement;

    map: TileData[][] = [];
    mapSize = 6;

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
    }

    render(): void {
        for (let x = 0; x < this.mapSize; x++) {
            for (let y = 0; y < this.mapSize; y++) {
                const tile = this.map[x][y];
                const img = document.createElement('img');
                const w = toView({ x, y });
                img.src = emptyTile;
                img.classList.add(styles.tile);
                img.style.transform = `translate(${w.wx}px, ${w.wy}px) rotate(90deg)`;
                this.canvasElement.appendChild(img);
                tile.element = img;
            }
        }
    }
}
