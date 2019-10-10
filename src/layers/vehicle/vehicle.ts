import { Layer } from '../layer';
import { VisibleTile } from '../../canvas/canvas';
import { tileWidth, tileHeight, MapCoord, HexDir, opposite } from '../../hex/hexGeo';

import * as styles from './vehicle.scss';
import { vehicleTypes } from './vehicle-types';

//////////////////////
//
// The vehicle layer
//
//////////////////////

type Tile = VisibleTile & TileWithVehicle & VisibleTileWithVehicle;

export interface VehicleDef {
    typeIndex: number;
    placement: VehiclePlacement;
}

export interface VehiclePlacement {
    position: MapCoord;
    toDir: HexDir;
    fromDir: HexDir;
}

export function getVehicleTransform(placement: VehiclePlacement): string {
    const f = opposite(placement.fromDir) * 60;
    const t = placement.toDir * 60;

    const a = (f + t) * 0.5;
    return Math.abs(f - t) < 180 ? `rotate(${-a}deg)` : `rotate(${180 - a}deg)`;
}

export interface TileWithVehicle {
    vehicle?: VehicleDef;
}
export interface VisibleTileWithVehicle {
    canvas: {
        _vehicleElement: HTMLImageElement;
    };
}

export class VehicleLayer extends Layer {
    enter(tile: Tile): void {
        if (tile.canvas && tile.vehicle) {
            const img = document.createElement('img');
            img.width = tileWidth;
            img.height = tileHeight;
            img.classList.add(styles.tile);

            tile.canvas._vehicleElement = img;
            tile.canvas.containerElement.appendChild(img);

            this.update(tile);
        }
    }
    update(tile: Tile): void {
        if (tile.vehicle && tile.canvas) {
            const type = vehicleTypes[tile.vehicle.typeIndex];
            const element = tile.canvas._vehicleElement;
            element.src = type.image;
            element.style.transform = getVehicleTransform(tile.vehicle.placement);
        }
    }
    exit(tile: Tile): void {
        if (tile.vehicle && tile.canvas) {
            tile.canvas._vehicleElement.remove();
            delete tile.canvas._vehicleElement;
        }
    }
}
