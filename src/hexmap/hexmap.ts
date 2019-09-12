import { toView, MapCoord, ViewCoord, toMap } from '../common/geo';

export interface TileData {
    type: number;
    element: HTMLElement;
}

export class HexMap {
    private map: TileData[][] = [];

    constructor(public size = 2) {
        const arrayLength = this.size * 2 + 1;
        for (let x = 0; x < arrayLength ; x++) {
            this.map[x] = [];
            for (let y = 0; y < arrayLength; y++) {
                this.map[x][y] = {
                    type: 0,
                    element: null,
                };
            }
        }
    }

    getTile(m: MapCoord): TileData {
        return this.map[m.x + this.size][m.y + this.size];
    }

    getSafeTile(m: MapCoord): TileData {
        if (m.x >= -this.size && m.y <= this.size &&
            m.y <= this.size && m.y <= this.size) {
            return this.getTile(m);
        }
        return null;
    }
}
