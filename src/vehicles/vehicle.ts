import { MapCoord, HexDir } from "../hex/hexGeo";
import { TileWithStructure } from "../layers/structure/structure";

export interface VehiclePosition {
    coord: MapCoord;
    dir: HexDir;
}
export class Vehicle {
    position: VehiclePosition;
    tile: TileWithStructure;
}