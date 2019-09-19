import { Layer } from "./shared";
import { Tile } from "../hex/hexmap";

//////////////////////
//
// The structure layer
//
//////////////////////

export interface StructureType {
    name: string,
    connections: string,
    rotations: number,
    next: (a:number) => number
}

export interface StructureDef {
    typeIndex: number,
    rotation: number
}

const structureTypes: StructureType[] = [
    {
        name: 'empty',
        connections: '______',
        rotations: 1,
        next: p => null
    },
    {
        name: 'straight',
        connections: 'R__R__',
        rotations: 3,
        next: p => p == 0 ? 3 : 0
    },
    {
        name: 'curved',
        connections: 'R_R___',
        rotations: 6,
        next: p => p === 0 ? 2 : 0
    },
    {
        connections: 'R_____',
        name: 'end',
        rotations: 6,
        next: p => null
    },
    {
        name: 'switchRight',
        connections: 'R_RR__',
        rotations: 6,
        next: p => p === 0 ? 3 : 0
    },
    {
        name: 'switchLeft',
        connections: 'R_R__R',
        rotations: 6,
        next: p => p === 2 ? 0 : 2
    },
    {
        name: 'cross',
        connections: 'R_RR_R',
        rotations: 6,
        next: p => { switch(p) {
            case 0: return 3;
            case 3: return 0;
            case 1: return 4;
            case 4: return 1;
        }}
    }
];

export function toTileDef(connections: string) : StructureDef {
    for (let typeIndex = 0; typeIndex < structureTypes.length; typeIndex++) {
        const type = structureTypes[typeIndex];
        let c: string = type.connections;
        for (let rotation = 0; rotation < type.rotations; rotation++) {
            if (c === connections) {
                return { typeIndex, rotation };
            }
            c = c.substr(1) + c[0]; //shift the connections by one slot
        }
    }
    return null;
}

export function toConnections(tileDef: StructureDef) : string {
    const type = structureTypes[tileDef.typeIndex];
    const c3x = type.connections + type.connections;
    return c3x.substring(tileDef.rotation, tileDef.rotation + 6);
}

export function render(
    previousDefdef: StructureDef,
    newDef: StructureDef) {
    if (newDef === previousDefdef) {
        return;
    }

}

export class StructureLayer extends Layer{

    render(tile: Tile): HTMLElement {
        return null;
    }
}