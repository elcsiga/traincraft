export interface MapCoord {
    x: number;
    y: number;
}
export interface ViewCoord {
    wx: number;
    wy: number;
}

export type HexDir = number; // 1 - 6

export const Shifts: MapCoord[] = [
    { x: 0, y : 0 }, // 0
    { x: 1, y : 0 }, // 1 - right
    { x: 1, y : -1 }, // 2
    { x: 0, y : -1 }, // 3
    { x: -1, y : 0 }, // 4
    { x: -1, y : 1 }, // 5
    { x: 0, y : 1 }  // 6
]

export function shift(m: MapCoord, dir: HexDir) {
    const d = Shifts[ dir ];
    return {
        x: m.x + d.x,
        y: m.y + d.y
    }
}

export const M3 = Math.sqrt(3) / 2;
export const tileHeight = 100;
export const tileWidth = tileHeight * M3;

export const toView: (m: MapCoord) => ViewCoord = m => {
    const wx = m.x * tileWidth + m.y * tileWidth * .5 - tileWidth / 2;
    const wy = m.y * tileHeight * .75 - tileHeight / 2;
    return { wx, wy };
};

export const toMap2: (w: ViewCoord) => MapCoord = w => {
    const dy = (w.wy + (tileHeight / 2)) / (tileHeight * .75);
    const dx = (w.wx + (tileWidth / 2) - dy * tileWidth / 2) / tileWidth;

    const x = Math.round(dx);
    const y = Math.round(dy);
    return { x, y };
};

export const toMap: (w: ViewCoord) => MapCoord = w => {
    const y3 = w.wy / (tileHeight * .25);
    const x2 = w.wx / (tileWidth * .5);
    const y3i = Math.floor(y3);

    let y = Math.floor(y3i / 3);
    switch (y3i % 3) {
        case 0:
            break;
        case -1:
        case 2:
            y += 1;
            break;
        case -2:
        case 1:
            const x1 = x2 / 2;
            const x1i = Math.floor(x1);
            let dx = (x1-x1i) * 2;
            if (dx > 1) {
                dx = dx - 2;
            }
            dx = Math.abs(dx);
            const dy = y3-y3i;

            console.log( x1, x1i, (x1-x1i) * 2, dx);

            if ( dy / dx > 1) {
                y += 1;
            }
            break;
    }
    const x = Math.round(x2 / 2 - y / 2);
    return { x, y };
}

export const getDir: (m: MapCoord, w: ViewCoord) => HexDir = (m,w) => {
    const center = toView(m);
    const dx = w.wx - center.wx;
    const dy = w.wy - center.wy;

    const r2 = tileHeight / 4; // half radius
    if (dx*dx + dy*dy > r2 * r2) {
        const a = Math.atan2(dy, dx) * 180 / Math.PI;
        return Math.round(a / 60) + 1;
    }
    else {
        return 0;
    }
}