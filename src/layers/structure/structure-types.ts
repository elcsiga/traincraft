//rails
import * as straightRail from './assets/rail/straight.png';
import * as curvedRail from './assets/rail/curved.png';
import * as endRail from './assets/rail/end.png';
import * as switchRightRail from './assets/rail/switchRight.png';
import * as switchLeftRail from './assets/rail/switchLeft.png';
import * as crossRail from './assets/rail/cross.png';

//roads
import * as straightRoad from './assets/road/straight.png';
import * as curvedRoad from './assets/road/curved.png';
import * as endRoad from './assets/road/end.png';
import * as junctionRoad from './assets/road/junction.png';

import * as roadRailCross1 from './assets/road/rail-cross-1.png';
import * as roadRailCross2 from './assets/road/rail-cross-2.png';

import { HexDir } from '../../hex/hexGeo';

export interface StructureType {
    image: string;
    connections: string;
    rotations: number;
    next: (a: number) => number;
}

export interface StructureDesc {
    index: number;
    rotation: HexDir;
}

export const structureTypes: StructureType[] = [
    {
        image: straightRail,
        connections: 'R__R__',
        rotations: 3,
        next: p => (p == 0 ? 3 : 0),
    },
    {
        image: curvedRail,
        connections: 'R_R___',
        rotations: 6,
        next: p => (p === 0 ? 2 : 0),
    },
    {
        image: endRail,
        connections: 'R_____',
        rotations: 6,
        next: () => null,
    },
    {
        image: switchRightRail,
        connections: 'R_RR__',
        rotations: 6,
        next: p => (p === 0 ? 3 : 0),
    },
    {
        image: switchLeftRail,
        connections: 'R_R__R',
        rotations: 6,
        next: p => (p === 2 ? 0 : 2),
    },
    {
        image: crossRail,
        connections: 'R_RR_R',
        rotations: 6,
        next: p => {
            switch (p) {
                case 0:
                    return 3;
                case 3:
                    return 0;
                case 1:
                    return 4;
                case 4:
                    return 1;
            }
        },
    },
    {
        image: straightRoad,
        connections: 'S__S__',
        rotations: 3,
        next: () => null,
    },
    {
        image: curvedRoad,
        connections: 'S_S___',
        rotations: 6,
        next: () => null,
    },
    {
        image: endRoad,
        connections: 'S_____',
        rotations: 6,
        next: () => null,
    },
    {
        image: junctionRoad,
        connections: 'S_S_S_',
        rotations: 6,
        next: () => null,
    },
    {
        image: roadRailCross1,
        connections: 'S_RS_R',
        rotations: 6,
        next: p => {
            switch (p) {
                case 0:
                    return 3;
                case 3:
                    return 0;
                case 1:
                    return 4;
                case 4:
                    return 1;
            }
        },
    },
    {
        image: roadRailCross2,
        connections: '_SR_SR',
        rotations: 6,
        next: p => {
            switch (p) {
                case 0:
                    return 3;
                case 3:
                    return 0;
                case 1:
                    return 4;
                case 4:
                    return 1;
            }
        },
    },
    {
        image: straightRail,
        connections: 'RS_R__',
        rotations: 6,
        next: p => (p == 0 ? 3 : 0),
    },
    {
        image: straightRail,
        connections: 'R_SR__',
        rotations: 6,
        next: p => (p == 0 ? 3 : 0),
    },
];

export function toStructureDesc(connections: string): StructureDesc | false {
    if (connections === '______') {
        return null;
    }
    for (let typeIndex = 0; typeIndex < structureTypes.length; typeIndex++) {
        const type = structureTypes[typeIndex];
        let c: string = type.connections;
        for (let rotation = 0; rotation < type.rotations; rotation++) {
            if (c === connections) {
                return { index: typeIndex, rotation };
            }
            c = c.substr(1) + c[0]; //shift the connections by one slot
        }
    }
    return false; //no match
}

export function toConnections(desc: StructureDesc): string {
    if (desc) {
        const type = structureTypes[desc.index];
        const c3x = type.connections + type.connections;
        return c3x.substring(desc.rotation, desc.rotation + 6);
    } else {
        return '______';
    }
}

export function setConnection(connections: string, connection: string, dir: HexDir): string {
    return connections.substr(0, dir) + connection + connections.substr(dir + 1);
}
