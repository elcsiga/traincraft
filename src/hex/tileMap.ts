import { MapCoord } from './hexGeo';
import { VisibleTile } from '../canvas/canvas';

export class TileMap<T> {
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

    create(f: (m: MapCoord) => T): void {
        const arrayLength = this.size * 2 + 1;
        for (let x = 0; x < arrayLength; x++) {
            for (let y = 0; y < arrayLength; y++) {
                this.map[x][y] = f({
                    x: x - this.size,
                    y: y - this.size,
                });
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

    load(): boolean {
        try {
            const m = JSON.parse(localStorage.getItem('MAP'));
            if (m) {
                this.map = m;
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    save(): void {
        const clone: any[][] = [];
        const arrayLength = this.size * 2 + 1;
        for (let x = 0; x < arrayLength; x++) {
            clone[x] = [];
            for (let y = 0; y < arrayLength; y++) {
                if (this.map[x][y]) {
                    const { canvas, ...withoutCanvas } = this.map[x][y] as VisibleTile;
                    clone[x][y] = withoutCanvas;
                } else {
                    clone[x][y] = null;
                }
            }
        }
        localStorage.setItem('MAP', JSON.stringify(clone));
    }
}
