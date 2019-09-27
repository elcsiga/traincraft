import { UiState } from './shared';
import { TileMap } from '../hex/tileMap';
import { toMap, ViewCoord } from '../hex/hexGeo';
import { TerrainType, TerrainLayer, TileWithTerrain } from '../layers/terrain/terrain';
import { VisibleTile, Canvas } from '../canvas/canvas';

type Tile = VisibleTile & TileWithTerrain;
export class EditTerrain extends UiState {
    hoveredElement: Tile;

    constructor(
        private map: TileMap<Tile>,
        private canvas: Canvas,
        private layer: TerrainLayer,
        private type: TerrainType,
    ) {
        super();
    }

    resetHover(): void {
        if (this.hoveredElement && this.hoveredElement.canvas) {
            this.hoveredElement.canvas._element.style.opacity = '1';
        }
    }

    enable(): void {
        // enabled
    }

    disable(): void {
        // disabled
    }

    hover(w: ViewCoord): void {
        const m = toMap(w);
        this.resetHover();

        const tile = this.canvas.getSafeVisibleTile(m);
        if (tile) {
            tile.canvas._element.style.opacity = '.5';
            this.hoveredElement = tile as Tile;
        }
    }

    click(): void {
        if (this.hoveredElement) {
            this.hoveredElement.terrain.type = this.type;
            this.layer.update(this.hoveredElement);
        }
    }
}
