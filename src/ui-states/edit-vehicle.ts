import { UiState } from './shared';
import { toMap, ViewCoord, MapCoord, HexDir } from '../hex/hexGeo';
import { TerrainType, TerrainLayer, TileWithTerrain, VisibleTileWithTerrain } from '../layers/terrain/terrain';
import { VisibleTile, Canvas } from '../canvas/canvas';
import { Vehicle } from '../vehicles/vehicle';

type Tile = VisibleTile;

interface VehicleCursor {
    tile: Tile;
    coord: MapCoord;
    dir: HexDir;
}
export class EditVehicle extends UiState {
    cursor: VehicleCursor;

    constructor(private canvas: Canvas, private layer: TerrainLayer, private type: TerrainType) {
        super();
    }

    resetHover(): void {
        if (this.cursor) {
            this.cursor.tile.canvas.containerElement.style.opacity = '1';
        }
    }

    enable(): void {
        // enabled
    }

    disable(): void {
        // disabled
    }

    hover(w: ViewCoord): void {
        const coord = toMap(w);
        this.resetHover();

        const tile = this.canvas.getSafeVisibleTile(coord);
        if (tile) {
            tile.canvas.containerElement.style.opacity = '.5';
            const dir: HexDir = 1;
            this.cursor = {
                tile, coord, dir
            }
        }
    }

    click(): void {
        if (this.cursor) {
            const vehicle = new Vehicle( );



        }
    }
}
