

import * as emptyTile from '../assets/tiles/empty.png';
import { tileWidth, tileHeight } from '../hex/hexGeo';


export class Terrain {

    static render(): HTMLElement {
        const img = document.createElement('img');
        img.src = emptyTile;
        img.width = tileWidth;
        img.height = tileHeight;
        return img;
    }
}