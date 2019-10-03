import { UiState } from './shared';
import { toMap, ViewCoord, MapCoord, HexDir } from '../hex/hexGeo';
import { VisibleTile, Canvas } from '../canvas/canvas';
import { TileWithStructure } from '../layers/structure/structure';
import { toConnections } from '../layers/structure/structure-types';
import {
    VehicleDef,
    TileWithVehicle,
    VisibleTileWithVehicle,
    VehicleLayer,
    VehiclePlacement,
} from '../layers/vehicle/vehicle';

type Tile = VisibleTile & TileWithStructure & TileWithVehicle & VisibleTileWithVehicle;

export function getInitialVehiclePlacement(position: MapCoord, tile: Tile, connection: string): VehiclePlacement {
    if (tile.structure) {
        const connections = toConnections(tile.structure);
        const fromDir: HexDir = connections.indexOf(connection);
        if (fromDir < 0) return null; // no connections
        const toDir: HexDir = connections.indexOf(connection, fromDir + 1);
        if (toDir < 0) return null; // less than 2 connections
        if (connections.indexOf(connection, toDir + 1) >= 0) return null; // more than 2 connections
        return { position, fromDir, toDir, tile };
    }
}

interface VehicleCursor {
    tile: Tile;
    placement: VehiclePlacement;
}
export class EditVehicle extends UiState {
    cursor: VehicleCursor;

    constructor(private canvas: Canvas, private layer: VehicleLayer, private typeIndex: number) {
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

        const tile = this.canvas.getSafeVisibleTile(position) as Tile;
        if (tile) {
            const placement: VehiclePlacement = getInitialVehiclePlacement(position, tile, 'R');

            if (placement) {
                this.cursor = { tile, placement };
                tile.canvas.containerElement.style.opacity = '.5';
            }
        }
    }

    private applyDef(tile: Tile, newDewsc: VehicleDef): void {
        if (!tile.vehicle && newDewsc) {
            tile.vehicle = newDewsc;
            this.layer.enter(tile); // TODO refactor: dot definitely visible here
        } else if (tile.vehicle && newDewsc) {
            tile.vehicle = newDewsc;
            this.layer.update(tile);
        } else if (tile.vehicle && !newDewsc) {
            this.layer.exit(tile);
            delete tile.vehicle;
        }
    }

    click(w: ViewCoord, e: MouseEvent): void {
        if (this.cursor) {
            if (!e.ctrlKey && !this.cursor.tile.vehicle) {
                this.applyDef(this.cursor.tile, {
                    typeIndex: this.typeIndex,
                    placement: this.cursor.placement,
                });
            } else if (e.ctrlKey && this.cursor.tile.vehicle) {
                this.applyDef(this.cursor.tile, null);
            }
        }
    }
}
