import * as styles from './canvas.scss';
import { toView, MapCoord, ViewCoord, toMap, tileWidth, tileHeight, getDir, HexDir, shift } from '../hex/hexGeo';
import { HexMap, Tile } from '../hex/hexmap';
import { Terrain } from '../layers/terrain';

export class Canvas {
    canvasElement: HTMLElement;
    hoveredElement: Tile;
    hoveredNeighbourElement: Tile;

    width: number;
    height: number;

    constructor(public map: HexMap) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.container);

        this.canvasElement.addEventListener('mousemove', e => {

            const cx = this.width / 2 - tileWidth / 2;
            const cy = this.height / 2 - tileHeight / 2;

            const w: ViewCoord = {
                wx: e.x - this.width / 2,
                wy: this.height / 2 - e.y
            };

            this.hover(w);
        });
    }

    render(): void {
        this.width = this.canvasElement.offsetWidth;
        this.height = this.canvasElement.offsetHeight;

        const mapSize = this.map.size;

        const cx = this.width / 2 - tileWidth / 2;
        const cy = this.height / 2 - tileHeight / 2;

        for (let x = -mapSize; x <= mapSize; x++) {
            for (let y = -mapSize; y <= mapSize; y++) {
                const m = {x, y};
                const w = toView( m );
                const tile = this.map.getTile(m);

                const div = document.createElement('div');
                div.classList.add(styles.tile);

                const tx = cx + w.wx;
                const ty = cy - w.wy;
                div.style.transform = `translate(${tx}px, ${ty}px) rotate(0deg)`;

                div.appendChild(Terrain.render());

                this.canvasElement.appendChild(div);
                tile.element = div;
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


            const neighbourDir: HexDir = getDir(m, w);
            if (neighbourDir) {
                const neighBourTile = this.map.getSafeTile( shift(m, neighbourDir) );
                if (neighBourTile) {
                    neighBourTile.element.style.opacity = '.7';
                    this.hoveredNeighbourElement = neighBourTile;

                    tile.element.style.opacity = '.7';
                    this.hoveredElement = tile;
                }
            } else {
                tile.element.style.opacity = '.5';
                this.hoveredElement = tile;
            }
        }
    }
}
