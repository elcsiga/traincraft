

import * as emptyTile from '../assets/tiles/empty.png';
import { tileWidth, tileHeight } from '../hex/hexGeo';
import { Layer } from './shared';
import { Tile } from '../hex/hexmap';


export class Terrain extends Layer{

    render(tile:Tile): HTMLElement {
        const img = document.createElement('img');
        img.src = emptyTile;
        img.width = tileWidth;
        img.height = tileHeight;
        return img;
    }
}