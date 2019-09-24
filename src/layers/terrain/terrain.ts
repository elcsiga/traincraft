import * as emptyTile from './assets/empty.png';
import * as waterTile from './assets/water.png';
import { tileWidth, tileHeight } from '../../hex/hexGeo';
import { Layer } from '../shared';
import { Tile } from '../../hex/hexmap';

export interface TerrainDef {
    type: 'empty' | 'water';
    _element ?: HTMLImageElement;
}

export class Terrain extends Layer {
    getBackgroundImage(tile: Tile) {
        switch (tile.terrain.type) {
            case 'empty': return emptyTile;
            case 'water': return waterTile;
        }
    }
    render(tile: Tile) {
        const img = document.createElement('img');
        img.width = tileWidth;
        img.height = tileHeight;
        tile.terrain._element = img;
        tile.element.appendChild(img);

        this.update(tile);
    }
    update(tile: Tile) {
        tile.terrain._element.src = this.getBackgroundImage(tile);
    }

}
