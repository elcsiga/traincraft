import { UiState } from './shared';
import { Tile, HexMap } from '../hex/hexmap';
import { ViewCoord, toMap, HexDir, getDir, shift } from '../hex/hexGeo';

export class BuildRail extends UiState {
    hoveredElement: Tile;
    hoveredNeighbourElement: Tile;

    constructor(private map: HexMap) {
        super();
    }

    resetHover(): void {
        if (this.hoveredElement) {
            this.hoveredElement._element.style.opacity = '1';
        }
        if (this.hoveredNeighbourElement) {
            this.hoveredNeighbourElement._element.style.opacity = '1';
        }
    }

    release(): void {
        this.resetHover();
    }

    hover(w: ViewCoord): void {
        const m = toMap(w);
        this.resetHover();
        const tile = this.map.getSafeTile(m);
        if (tile) {
            const neighbourDir: HexDir = getDir(m, w);
            const neighBourTile = this.map.getSafeTile(shift(m, neighbourDir));
            if (neighBourTile) {
                neighBourTile._element.style.opacity = '.7';
                this.hoveredNeighbourElement = neighBourTile;
                tile._element.style.opacity = '.7';
                this.hoveredElement = tile;
            }
        }
    }

    click(): void {
        // TODO
    }
}
