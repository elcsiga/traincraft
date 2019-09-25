import { UiState } from './shared';
import { Tile, HexMap } from '../hex/hexmap';
import { toMap, ViewCoord } from '../hex/hexGeo';
import { TerrainType, TerrainLayer } from '../layers/terrain/terrain';

export class EditTerrain extends UiState {
    hoveredElement: Tile;

    constructor(private map: HexMap, private layer: TerrainLayer, private type: TerrainType) {
        super();
    }

    resetHover(): void {
        if (this.hoveredElement) {
            this.hoveredElement._element.style.opacity = '1';
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
            tile._element.style.opacity = '.5';
            this.hoveredElement = tile;
        }
    }

    click(): void {
        if (this.hoveredElement) {
            this.hoveredElement.terrain.type = this.type;
            this.layer.update(this.hoveredElement);
        }
    }
}
