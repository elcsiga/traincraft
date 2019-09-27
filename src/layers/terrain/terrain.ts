import * as emptyTile from './assets/empty.png';
import * as waterTile from './assets/water.png';
import { tileWidth, tileHeight } from '../../hex/hexGeo';
import { Layer } from '../layer';
import { VisibleTile } from '../../canvas/canvas';

export type TerrainType = 'empty' | 'water';
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
    enter(tile: TileWithTerrain & VisibleTile): void {
        const img = document.createElement('img');
        img.width = tileWidth;
        img.height = tileHeight;
        tile.terrain._element = img;
        tile.canvas._element.appendChild(img);

        this.update(tile);
    }
    update(tile: TileWithTerrain & VisibleTile): void {
        tile.terrain._element.src = this.getBackgroundImage(tile);
    }
    exit(tile: TileWithTerrain & VisibleTile): void {
        tile.terrain._element.remove();
        tile.terrain._element = null;
    }
}
