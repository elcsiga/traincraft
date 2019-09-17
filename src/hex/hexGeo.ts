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
export const tileHeight = 60;
export const tileWidth = tileHeight * M3;

export const toView: (m: MapCoord) => ViewCoord = m => {
    const wx = m.x * tileWidth + m.y * tileWidth * .5 - tileWidth / 2;
    const wy = m.y * tileHeight * .75 - tileHeight / 2;
    return { wx, wy };
};

export const toMap: (w: ViewCoord) => MapCoord = w => {
    const dy = (w.wy + (tileHeight / 2)) / (tileHeight * .75);
    const dx = (w.wx + (tileWidth / 2) - dy * tileWidth / 2) / tileWidth;

    const x = Math.round(dx);
    const y = Math.round(dy);
    return { x, y };
};

export function cursor(w: ViewCoord) {
    const y3 = w.wy / (tileHeight * .25);
    const x2 = w.wx / (tileWidth * .5);
    const y3i = Math.floor(y3);
    const m: MapCoord = {x: 0, y: 0};
    switch (y3i % 6) {
        case 0:
        case 1:
            m.x = Math.floor((w.wx + (tileWidth / 2) - y3i * tileWidth / 6) / tileWidth);

    }



}