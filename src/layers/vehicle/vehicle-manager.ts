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

    getNextPlacement(placement: VehiclePlacement): PlacementWithTile {
        const position = shift(placement.position, placement.toDir);
        const tile = this.map.getSafeTile(position);
        if (tile) {
            const fromDir = opposite(placement.toDir);
            const normalizedFromDir = normalize(fromDir + tile.structure.rotation);

            const normalizedToDir = structureTypes[tile.structure.index].next(normalizedFromDir);
            if (normalizedToDir !== null) {
                const toDir = normalize(normalizedToDir - tile.structure.rotation);
                const placement: VehiclePlacement = { position, toDir, fromDir };
                return { placement, tile };
            }
        }
        return null;
    }

    step(tilesWithVehicle: Tile): Tile {
        const nextPlacementWithTile = this.getNextPlacement(tilesWithVehicle.vehicle.placement);
        if (nextPlacementWithTile && !nextPlacementWithTile.tile.vehicle) {
            const nextTile = nextPlacementWithTile.tile;
            const vehicle = tilesWithVehicle.vehicle;

            this.layer.exit(tilesWithVehicle);
            delete tilesWithVehicle.vehicle;

            vehicle.placement = nextPlacementWithTile.placement;

            nextTile.vehicle = vehicle;
            this.layer.enter(nextTile);

            return nextTile;
        } else return null;
    }

    stepAll(): void {
        this.tilesWithVehicles.forEach((v, i) => {
            const newTile = this.step(v);
            if (newTile) {
                this.tilesWithVehicles[i] = newTile;
            }
        });
    }
}
