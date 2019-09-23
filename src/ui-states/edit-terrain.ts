import { UiState } from './shared';
import { Tile, HexMap } from '../hex/hexmap';
import { toMap, ViewCoord } from '../hex/hexGeo';

export class EditTerrain extends UiState {
    hoveredElement: Tile;

    constructor(private map: HexMap) {
        super();
    }

    resetHover(): void {
        if (this.hoveredElement) {
            this.hoveredElement.element.style.opacity = '1';
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
            tile.element.style.opacity = '.5';
            this.hoveredElement = tile;
        }
    }

    click(w: ViewCoord): void {
        // TODO
    }
}
