import { MapCoord, HexDir } from "../hex/hexGeo";
import { TileWithStructure } from "../layers/structure/structure";
import { toConnections } from "../layers/structure/structure-types";

export interface VehicleDef {
    position: MapCoord;
    toDir: HexDir;
    fromDir: HexDir;
    tile: TileWithStructure;
}

export function getInitialVehiclePosition(
    position: MapCoord,
    tile: TileWithStructure,
    connection: string
): VehicleDef {
    if (tile.structure) {
        const connections = toConnections(tile.structure);
        const fromDir: HexDir = connections.indexOf(connection);
        if (fromDir < 0)
            return null; // no connections
        const toDir: HexDir = connections.indexOf(connection, fromDir + 1);
        if (toDir < 0)
            return null; // less than 2 connections
        if (connections.indexOf(connection, toDir + 1) >= 0)
            return null; // more than 2 connections
        return { position, fromDir, toDir, tile };
    }
}