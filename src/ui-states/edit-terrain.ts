import { UiState } from './shared';
import { toMap, ViewCoord } from '../hex/hexGeo';
import { TerrainType, TerrainLayer, TileWithTerrain, VisibleTileWithTerrain } from '../layers/terrain/terrain';
import { VisibleTile, Canvas } from '../canvas/canvas';
import { TileWithStructure } from '../layers/structure/structure';

type Tile = VisibleTile & TileWithTerrain & VisibleTileWithTerrain & TileWithStructure;

export class EditTerrain extends UiState {
    cursorTile: Tile;

    constructor(private canvas: Canvas, private layer: TerrainLayer, private type: TerrainType) {
        super();
    }

    resetHover(): void {
        if (this.cursorTile && this.cursorTile.canvas) {
            this.cursorTile.canvas.containerElement.style.opacity = '1';
            this.cursorTile = null;
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

        const tile = this.canvas.getSafeVisibleTile(m) as Tile;
        if (tile && !tile.structure) {
            tile.canvas.containerElement.style.opacity = '.5';
            this.cursorTile = tile as Tile;
        }
    }

    click(): void {
        if (this.cursorTile && this.cursorTile.terrain) {
            this.cursorTile.terrain.type = this.type;
            this.layer.update(this.cursorTile);
        }
    }
}
