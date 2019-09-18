import * as styles from './canvas.scss';
import * as emptyTile from '../assets/tiles/empty.png';
import { toView, MapCoord, ViewCoord, toMap, tileWidth, tileHeight, getDir, HexDir, shift } from '../hex/hexGeo';
import { HexMap, TileData } from '../hex/hexmap';

export class Canvas {
    canvasElement: HTMLElement;
    hoveredElement: TileData;
    hoveredNeighbourElement: TileData;

    width: number;
    height: number;

    constructor(public map: HexMap) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.container);

        this.canvasElement.addEventListener('mousemove', e => {
            const w: ViewCoord = {
                wx: e.x - this.canvasElement.offsetWidth / 2,
                wy: e.y - this.canvasElement.offsetHeight / 2
            };
            this.hover(w);
        });
    }

    render(): void {
        this.width = this.canvasElement.offsetWidth;
        this.height = this.canvasElement.offsetHeight;

        const mapSize = this.map.size;
        for (let x = -mapSize; x <= mapSize; x++) {
            for (let y = -mapSize; y <= mapSize; y++) {
                const m = {x, y};
                const tile = this.map.getTile(m);
                const img = document.createElement('img');
                const w = toView( m );
                img.src = emptyTile;
                img.width = tileWidth;
                img.height = tileHeight;

                img.classList.add(styles.tile);

                const tx = w.wx + this.width / 2; // - tileWidth / 2;
                const ty = w.wy + this.height / 2; // - tileHeight / 2;

                img.style.transform = `translate(${tx}px, ${ty}px) rotate(0deg)`;
                this.canvasElement.appendChild(img);
                tile.element = img;
            }
        }
    }

    hover(w: ViewCoord) {
        const m = toMap(w);
        if (this.hoveredElement) {
            this.hoveredElement.element.style.opacity = '1';
        }
        if (this.hoveredNeighbourElement) {
            this.hoveredNeighbourElement.element.style.opacity = '1';
        }
        const tile = this.map.getSafeTile(m);
        if (tile) {
            tile.element.style.opacity = '.7';
            this.hoveredElement = tile;

            const neighbourDir: HexDir = getDir(m, w);
            if (neighbourDir) {
                const neighBourTile = this.map.getSafeTile( shift(m, neighbourDir) );
                if (neighBourTile) {
                    neighBourTile.element.style.opacity = '.5';
                    this.hoveredNeighbourElement = tile;
                }
            }
        }
    }
}
