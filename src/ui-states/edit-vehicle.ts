import { UiState } from './shared';
import { toMap, ViewCoord, MapCoord, HexDir } from '../hex/hexGeo';
import { VisibleTile, Canvas } from '../canvas/canvas';
import { StructureLayer, TileWithStructure } from '../layers/structure/structure';
import { VehicleDef, getInitialVehiclePosition } from '../vehicles/vehicle';

type Tile = VisibleTile & TileWithStructure;

interface VehicleCursor {
    tile: Tile;
    position: MapCoord;
}
export class EditVehicle extends UiState {
    cursor: VehicleCursor;

    constructor(private canvas: Canvas, private layer: StructureLayer) {
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
        const position = toMap(w);
        this.resetHover();

        const tile = this.canvas.getSafeVisibleTile(position);
        if (tile) {
            tile.canvas.containerElement.style.opacity = '.5';
            this.cursor = { tile, position }
        }
    }

    click(): void {
        if (this.cursor) {
            const v: VehicleDef = getInitialVehiclePosition(
                this.cursor.position,
                this.cursor.tile,
                'R'
            );
            if (v) {
                
            }    


        }
    }
}
