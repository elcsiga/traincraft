export interface MapCoord {
    x: number;
    y: number;
}
export interface ViewCoord {
    wx: number;
    wy: number;
}

type Shift = Number; // 0-5
export function shift(m: MapCoord, s: Shift): MapCoord {
    switch (s) {
        case 0: return { x: m.x - 1, y: m.y };
        case 1: return { x: m.x, y: m.y - 1 };
        case 2: return { x: m.x + 1, y: m.y - 1 };
        case 3: return { x: m.x + 1, y: m.y };
        case 4: return { x: m.x, y: m.y + 1 };
        case 5: return { x: m.x - 1, y: m.y + 1 };
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

    let x, y;
    switch (y3i % 3) {
        case 0:
            y = y3i / 3;
            x = Math.round(x2 / 2 - y / 2);
            break;
        case -1:
        case 2:
            y = Math.floor(y3i / 3) + 1;
            x = Math.round(x2 / 2 - y / 2);
            break;
        case -2:
        case 1:
            const x1 = x2 / 2;
            const x1i = Math.floor(x1);
            let dx = (x1-x1i) * 2;
            if (dx > 1) dx -= 2;
            dx = Math.abs(x2);
            const dy = y3-y3i;
            if (x2 > 0) {
                const a = dy / dx;
                console.log('a', a>1);
            }

            //y = Math.floor(y3i / 3) + 1;
            //x = Math.round(x2 / 2 - y / 2);

            break;

    }

    //return {x: 0, y: 0};
    return x !== undefined && x !== undefined ? { x, y } : null;
}