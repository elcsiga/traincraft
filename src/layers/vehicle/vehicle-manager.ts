import { TileMap } from '../../hex/tileMap';
import { TileWithStructure } from '../structure/structure';
import { TileWithVehicle, VehiclePlacement, VehicleDef, VehicleLayer, VisibleTileWithVehicle } from './vehicle';
import { shift, opposite } from '../../hex/hexGeo';
import { structureTypes } from '../structure/structure-types';
import { VisibleTile } from '../../canvas/canvas';

export type Tile = VisibleTile & TileWithStructure & TileWithVehicle & VisibleTileWithVehicle;
export class VehicleMaanager {
    private vehicles: VehicleDef[] = [];

    constructor(private map: TileMap<Tile>, private layer: VehicleLayer) {}

    add(vehicle: VehicleDef): void {
        this.vehicles.push(vehicle);
    }
    remove(vehicle: VehicleDef): void {
        const index = this.vehicles.indexOf(vehicle);
        if (index > -1) {
            this.vehicles.splice(index, 1);
        }
    }

    getNextPlacement(placement: VehiclePlacement): VehiclePlacement {
        const position = shift(placement.position, placement.toDir);
        const tile = this.map.getSafeTile(position);
        if (tile) {
            const fromDir = opposite(placement.toDir);
            const toDir = structureTypes[tile.structure.index].next(fromDir);
            if (toDir !== null) {
                return { position, toDir, fromDir, tile };
            }
        }
        return null;
    }

    isTileFree(placement: VehiclePlacement): boolean {
        return !placement.tile.vehicle;
    }

    step(vehicle: VehicleDef): boolean {
        const nextPlacement = this.getNextPlacement(vehicle.placement);
        if (nextPlacement && this.isTileFree(nextPlacement)) {
            const currentTile = vehicle.placement.tile as Tile;
            const nextTile = nextPlacement.tile as Tile;

            this.layer.exit(currentTile);
            delete currentTile.vehicle;

            nextPlacement.tile = nextTile;
            vehicle.placement = nextPlacement;

            nextTile.vehicle = vehicle;
            this.layer.enter(nextTile);

            return true;
        } else return false;
    }

    stepAll(): void {
        this.vehicles.forEach(v => this.step(v));
    }
}
