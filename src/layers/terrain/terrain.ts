import * as emptyTile from './assets/empty.png';
import * as waterTile from './assets/water.png';
import { tileWidth, tileHeight } from '../../hex/hexGeo';
import { Layer } from '../layer';
import { Tile } from '../../hex/hexmap';

export type TerrainType = 'empty' | 'water';
export interface TerrainDef {
    type: TerrainType;
    _element?: HTMLImageElement;
}

export class TerrainLayer extends Layer {
    getBackgroundImage(tile: Tile): string {
        switch (tile.terrain.type) {
            case 'empty':
                return emptyTile;
            case 'water':
                return waterTile;
        }
    }
    enter(tile: Tile): void {
        const img = document.createElement('img');
        img.width = tileWidth;
        img.height = tileHeight;
        tile.terrain._element = img;
        tile._element.appendChild(img);

        this.update(tile);
    }
    update(tile: Tile): void {
        tile.terrain._element.src = this.getBackgroundImage(tile);
    }
    exit(tile: Tile): void {
        tile.terrain._element.remove();
        delete tile.terrain._element;
    }
}
