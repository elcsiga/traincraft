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
    const wx = m.x * tileWidth + m.y * tileWidth * .5 ;
    const wy = m.y * tileHeight * .75;
    return { wx, wy };
};