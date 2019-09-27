import { Layer } from '../layer';
import { VisibleTile } from '../../canvas/canvas';
import { tileWidth, tileHeight, HexDir } from '../../hex/hexGeo';

import * as straightTile from './assets/straight.png';
import * as curvedTile from './assets/curved.png';
import * as endTile from './assets/end.png';
import * as switchRightTile from './assets/switchRight.png';
import * as switchLeftTile from './assets/switchLeft.png';
import * as crossTile from './assets/cross.png';

//////////////////////
//
// The structure layer
//
//////////////////////

type Tile = VisibleTile & TileWithStructure;

export interface StructureType {
    image: string;
    connections: string;
    rotations: number;
    next: (a: number) => number;
}

export interface StructureDef {
    typeIndex: number;
    rotation: number;
    _element: HTMLImageElement;
}
export interface TileWithStructure {
    structure: StructureDef;
}
const structureTypes: StructureType[] = [
    {
        image: straightTile,
        connections: 'R__R__',
        rotations: 3,
        next: p => (p == 0 ? 3 : 0),
    },
    {
        image: curvedTile,
        connections: 'R_R___',
        rotations: 6,
        next: p => (p === 0 ? 2 : 0),
    },
    {
        image: endTile,
        connections: 'R_____',
        rotations: 6,
        next: () => null,
    },
    {
        image: switchRightTile,
        connections: 'R_RR__',
        rotations: 6,
        next: p => (p === 0 ? 3 : 0),
    },
    {
        image: switchLeftTile,
        connections: 'R_R__R',
        rotations: 6,
        next: p => (p === 2 ? 0 : 2),
    },
    {
        image: crossTile,
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
];

export function toStructureDef(connections: string): StructureDef | false {
    if (connections === '______') {
        return null;
    }
    for (let typeIndex = 0; typeIndex < structureTypes.length; typeIndex++) {
        const type = structureTypes[typeIndex];
        let c: string = type.connections;
        for (let rotation = 0; rotation < type.rotations; rotation++) {
            if (c === connections) {
                return { typeIndex, rotation, _element: null };
            }
            c = c.substr(1) + c[0]; //shift the connections by one slot
        }
    }
    return false; //no match
}

export function toConnections(tileDef: StructureDef): string {
    if (tileDef) {
        const type = structureTypes[tileDef.typeIndex];
        const c3x = type.connections + type.connections;
        return c3x.substring(tileDef.rotation, tileDef.rotation + 6);
    } else {
        return '______';
    }
}

export function setConnection(connections: string, connection: string, dir: HexDir): string {
    return connections.substr(0, dir) + connection + connections.substr(dir + 1);
}

export class StructureLayer extends Layer {
    enter(tile: Tile): void {
        if (tile.structure) {
            const img = document.createElement('img');
            img.width = tileWidth;
            img.height = tileHeight;
            tile.structure._element = img;
            tile.canvas._element.appendChild(img);

            this.update(tile);
        }
    }
    update(tile: Tile): void {
        const type = structureTypes[tile.structure.typeIndex];
        const element = tile.structure._element;
        const rotation = tile.structure.rotation;
        element.src = type.image;
        element.style.transform = `rotate(${rotation * 60}deg)`;
    }
    exit(tile: Tile): void {
        if (tile.structure) {
            tile.structure._element.remove();
            tile.structure._element = null;
        }
    }
}
