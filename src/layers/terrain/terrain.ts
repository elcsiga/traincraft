import * as emptyTile from './assets/empty.png';
import * as waterTile from './assets/water.png';
import { tileWidth, tileHeight } from '../../hex/hexGeo';
import { Layer } from '../layer';
import { VisibleTile } from '../../canvas/canvas';

//////////////////////
//
// The terrain layer
//
//////////////////////

export type TerrainType = 'empty' | 'water';
type Tile = VisibleTile & TileWithTerrain;

export interface TerrainDef {
    type: TerrainType;
    _element: HTMLImageElement;
}

export interface TileWithTerrain {
    terrain: TerrainDef;
}

export class TerrainLayer extends Layer {
    getBackgroundImage(tile: TileWithTerrain): string {
        switch (tile.terrain.type) {
            case 'empty':
                return emptyTile;
            case 'water':
                return waterTile;
        }
    }
    enter(tile: Tile): void {
        if (tile.terrain) {
            const img = document.createElement('img');
            img.width = tileWidth;
            img.height = tileHeight;
            tile.terrain._element = img;
            tile.canvas._element.appendChild(img);

            this.update(tile);
        }
    }
    update(tile: Tile): void {
        tile.terrain._element.src = this.getBackgroundImage(tile);
    }
    exit(tile: Tile): void {
        if (tile.terrain) {
            tile.terrain._element.remove();
            tile.terrain._element = null;
        }
    }
}
