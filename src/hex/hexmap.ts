import { MapCoord } from './hexGeo';
import { StructureDef } from '../layers/structure/structure';
import { TerrainDef } from '../layers/terrain/terrain';
import { RnderPhase } from '../canvas/canvas';

export interface Tile {
    struxture: StructureDef;
    terrain: TerrainDef;
    _element: HTMLElement;
    _renderPhase: RnderPhase;
}

export class HexMap {
    private map: Tile[][] = [];

    constructor(public size = 2) {
        const arrayLength = this.size * 2 + 1;
        for (let x = 0; x < arrayLength; x++) {
            this.map[x] = [];
            for (let y = 0; y < arrayLength; y++) {
                this.map[x][y] = {
                    terrain: {
                        type: Math.random() > 0.5 ? 'empty' : 'water',
                        _element: null
                    },
                    struxture: null,
                    _element: null,
                    _renderPhase: null,
                };
            }
        }
    }

    getTile(m: MapCoord): Tile {
        return this.map[m.x + this.size][m.y + this.size];
    }

    getSafeTile(m: MapCoord): Tile {
        if (m && m.x >= -this.size && m.x <= this.size && m.y <= this.size && m.y <= this.size) {
            return this.getTile(m);
        }
        return null;
    }
}
