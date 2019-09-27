import { MapCoord } from './hexGeo';

export class HexMap<T> {
    private map: T[][] = [];

    constructor(public size = 2) {
        const arrayLength = this.size * 2 + 1;
        for (let x = 0; x < arrayLength; x++) {
            this.map[x] = [];
            for (let y = 0; y < arrayLength; y++) {
                this.map[x][y] = null;
            }
        }
    }

    create(f: (x: number, y: number) => T): void {
        const arrayLength = this.size * 2 + 1;
        for (let x = 0; x < arrayLength; x++) {
            for (let y = 0; y < arrayLength; y++) {
                this.map[x][y] = f(x, y);
            }
        }
    }

    getTile(m: MapCoord): T {
        return this.map[m.x + this.size][m.y + this.size];
    }

    getSafeTile(m: MapCoord): T {
        if (m && m.x >= -this.size && m.x <= this.size && m.y <= this.size && m.y <= this.size) {
            return this.getTile(m);
        }
        return null;
    }
}
