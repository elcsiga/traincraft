export interface MapCoord {
    x: number;
    y: number;
}
export interface ViewCoord {
    wx: number;
    wy: number;
}

export const M3 = Math.sqrt(3) / 2;
export const tileHeight = 60;
export const tileWidth = tileHeight * M3;

export const toView: (m: MapCoord) => ViewCoord = m => {
    const wx = m.x * tileWidth + m.y * tileWidth * .5 - tileWidth/2;
    const wy = m.y * tileHeight * .75 - tileHeight / 2;
    return { wx, wy };
};

export const toMap: (w: ViewCoord) => MapCoord = w => {
    const dy = (w.wy + (tileHeight / 2)) / (tileHeight * .75);
    const dx = (w.wx + (tileWidth / 2) - dy * tileWidth / 2) / tileWidth ;

    const x = Math.floor(dx);
    const y = Math.floor(dy);
    return { x, y };
};