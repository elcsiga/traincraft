import * as styles from './canvas.scss';
import * as emptyTile from '../assets/tiles/empty.png';
import { toView, MapCoord, ViewCoord, toMap, tileWidth, tileHeight } from '../common/geo';
import { HexMap } from '../hexmap/hexmap';

export interface TileData {
    type: number;
    element: HTMLElement;
}

export class Canvas {
    canvasElement: HTMLElement;
    hoveredElement: TileData;

    constructor(public map: HexMap) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.container);

        this.canvasElement.addEventListener('mousemove', e => {
            const w: ViewCoord = {
                wx: e.x - this.canvasElement.offsetWidth / 2,
                wy: e.y - this.canvasElement.offsetHeight / 2
            };
            this.hover(toMap(w));
            console.log(w, toMap(w));
        });
    }

    render(): void {
        const mapSize = this.map.size;
        for (let x = -mapSize; x <= mapSize; x++) {
            for (let y = -mapSize; y <= mapSize; y++) {
                const m = {x, y};
                const tile = this.map.getTile(m);
                const img = document.createElement('img');
                const w = toView( m );
                img.src = emptyTile;
                img.classList.add(styles.tile);

                const tx = w.wx + this.canvasElement.offsetWidth / 2 - tileWidth / 2;
                const ty = w.wy + this.canvasElement.offsetHeight / 2 - tileHeight / 2;

                img.style.transform = `translate(${tx}px, ${ty}px) rotate(0deg)`;
                this.canvasElement.appendChild(img);
                tile.element = img;
            }
        }
    }

    hover(m: MapCoord) {
        if (this.hoveredElement) {
            this.hoveredElement.element.style.opacity = '1';
        }
        const tile = this.map.getSafeTile(m);
        if (tile) {
            tile.element.style.opacity = '.7';
            this.hoveredElement = tile;
        }
    }
}
