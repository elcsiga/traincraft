import { TileMap } from '../../hex/tileMap';
import { TileWithStructure } from '../structure/structure';
import { TileWithVehicle, VehiclePlacement, VehicleLayer, VisibleTileWithVehicle } from './vehicle';
import { shift, opposite, normalize } from '../../hex/hexGeo';
import { structureTypes } from '../structure/structure-types';
import { VisibleTile } from '../../canvas/canvas';

export type Tile = VisibleTile & TileWithStructure & TileWithVehicle & VisibleTileWithVehicle;
interface PlacementWithTile {
    placement: VehiclePlacement;
    tile: Tile;
}

export class VehicleMaanager {
    private tilesWithVehicles: Tile[] = [];

    constructor(private map: TileMap<Tile>, private layer: VehicleLayer) {
        this.init();
    }

    add(tilesWithVehicle: TileWithVehicle): void {
        this.tilesWithVehicles.push(tilesWithVehicle as Tile);
    }
    remove(tilesWithVehicle: TileWithVehicle): void {
        const index = this.tilesWithVehicles.indexOf(tilesWithVehicle as Tile);
        if (index > -1) {
            this.tilesWithVehicles.splice(index, 1);
        }
    }

    init(): void {
        this.tilesWithVehicles = [];
        this.map.forEachSafeTile(tile => {
            if (tile.vehicle) {
                this.tilesWithVehicles.push(tile);
            }
        });
    }

    getNextPlacement(placement: VehiclePlacement, forward: boolean): PlacementWithTile {
        const shiftDir = forward ? placement.toDir : placement.fromDir;
        const lambda = placement.lambda;
        const position = shift(placement.position, shiftDir);
        const tile = this.map.getSafeTile(position);
        if (tile) {
            const shiftFromDir = opposite(shiftDir);
            const normalizedShiftFromDir = normalize(shiftFromDir + tile.structure.rotation);

            const normalizedShiftToDir = structureTypes[tile.structure.index].next(normalizedShiftFromDir);
            if (normalizedShiftToDir !== null) {
                const newShiftDir = normalize(normalizedShiftToDir - tile.structure.rotation);
                const placement: VehiclePlacement = forward
                    ? {
                          position,
                          toDir: newShiftDir,
                          fromDir: shiftFromDir,
                          lambda: lambda - 1,
                      }
                    : {
                          position,
                          toDir: shiftFromDir,
                          fromDir: newShiftDir,
                          lambda: lambda + 1,
                      };
                return { placement, tile };
            }
        }
        return null;
    }

    move(tileWithVehicle: Tile): Tile {
        const vehicle = tileWithVehicle.vehicle;
        const SPEED = -0.17;
        console.log(vehicle.placement);

        vehicle.placement.lambda += SPEED;
        if (vehicle.placement.lambda > 1) {
            return this.step(tileWithVehicle, true);
        }
        if (vehicle.placement.lambda < 0) {
            return this.step(tileWithVehicle, false);
        }
        this.layer.update(tileWithVehicle);
        return tileWithVehicle;
    }

    step(tileWithVehicle: Tile, forward: boolean): Tile {
        const vehicle = tileWithVehicle.vehicle;
        const nextPlacementWithTile = this.getNextPlacement(tileWithVehicle.vehicle.placement, forward);
        if (nextPlacementWithTile && !nextPlacementWithTile.tile.vehicle) {
            const nextTile = nextPlacementWithTile.tile;

            this.layer.exit(tileWithVehicle);
            delete tileWithVehicle.vehicle;

            vehicle.placement = nextPlacementWithTile.placement;

            nextTile.vehicle = vehicle;
            this.layer.enter(nextTile);

            return nextTile;
        } else return null;
    }

    stepAll(): void {
        this.tilesWithVehicles.forEach((v, i) => {
            const newTile = this.move(v);
            if (newTile) {
                this.tilesWithVehicles[i] = newTile;
            }
        });
    }
}
