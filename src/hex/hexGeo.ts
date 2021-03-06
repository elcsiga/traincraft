export interface MapCoord {
    x: number;
    y: number;
}
export interface ViewCoord {
    wx: number;
    wy: number;
}

export interface MapArea {
    tl: MapCoord;
    br: MapCoord;
}

export type HexDir = number; // 0..5

export const Shifts: MapCoord[] = [
    { x: 1, y: 0 }, // 1 - right
    { x: 0, y: 1 }, // 2
    { x: -1, y: 1 }, // 3
    { x: -1, y: 0 }, // 4
    { x: 0, y: -1 }, // 5
    { x: 1, y: -1 }, // 6
];

export function shift(m: MapCoord, dir: HexDir): MapCoord {
    const d = Shifts[dir];

    return {
        x: m.x + d.x,
        y: m.y + d.y,
    };
}

export function normalize(d: HexDir): HexDir {
    return d < 0 ? d + 6 : d >= 6 ? d - 6 : d;
}

export function opposite(d: HexDir): HexDir {
    return normalize(d - 3);
}

export const M3 = Math.sqrt(3) / 2;
export const tileHeight = 100;
export const tileWidth = tileHeight * M3;

export const toView: (m: MapCoord) => ViewCoord = m => {
    const wx = m.x * tileWidth + m.y * tileWidth * 0.5;
    const wy = m.y * tileHeight * 0.75;
    return { wx, wy };
};

export const toMap: (w: ViewCoord) => MapCoord = w => {
    const y3 = w.wy / (tileHeight * 0.25); // creating 3 horizotal zones
    const y3i = Math.floor(y3);
    let y = Math.floor((y3i + 1) / 3); // y from the 0. and 2. zone is trivial
    const x1 = w.wx / tileWidth;
    switch (y3i % 3) {
        case -2:
        case 1:
            // the 1. horizontal zone of the sloped sides...
            const dy = 1 - (y3 - y3i); //
            const x1i = y % 2 != 0 ? Math.floor(x1) + 0.5 : Math.round(x1);
            const dx = Math.abs((x1 - x1i) * 2);
            if (dx > dy) {
                y++; // over the sloped edges: belongs to the upper tile
            }
    }
    const x = Math.round(x1 - y / 2);
    return { x, y };
};

export const getDir: (m: MapCoord, w: ViewCoord) => HexDir = (m, w) => {
    const center = toView(m);
    const dx = w.wx - center.wx;
    const dy = w.wy - center.wy;

    const a = (Math.atan2(dy, dx) * 180) / Math.PI;
    const d = Math.round(a / 60);
    return normalize(d);
};

export function forEachAreaCoord(area: MapArea, f: (p: MapCoord) => void): void {
    for (let y = area.br.y; y <= area.tl.y; y++) {
        const tlOffset = Math.floor((area.tl.y - y) / 2);
        const brOffset = Math.floor((y - area.br.y) / 2);
        for (let x = area.tl.x + tlOffset; x <= area.br.x - brOffset; x++) {
            f({ x, y });
        }
    }
}

export function distance(f: MapCoord): number {
    const e = f.x * f.y;
    if (e >= 0) {
        return Math.abs(f.x + f.y);
    } else {
        return Math.max(Math.abs(f.x), Math.abs(f.y));
    }
}
