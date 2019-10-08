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
type Tile = VisibleTile & TileWithTerrain & VisibleTileWithTerrain;

export interface TerrainDef {
    type: TerrainType;
}

export interface TileWithTerrain {
    terrain?: TerrainDef;
}
export interface VisibleTileWithTerrain {
    canvas: {
        terrainElement: HTMLImageElement;
    };
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
        if (tile.terrain && tile.canvas) {
            const img = document.createElement('img');
            img.width = tileWidth;
            img.height = tileHeight;
            tile.canvas.terrainElement = img;
            tile.canvas.containerElement.appendChild(img);

            this.update(tile);
        }
    }
    update(tile: Tile): void {
        if (tile.terrain && tile.canvas) {
            tile.canvas.terrainElement.src = this.getBackgroundImage(tile);
        }
    }
    exit(tile: Tile): void {
        if (tile.terrain && tile.canvas) {
            tile.canvas.terrainElement.remove();
            delete tile.canvas.terrainElement;
        }
    }
}
