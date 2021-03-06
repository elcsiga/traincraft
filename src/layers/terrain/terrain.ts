import * as emptyTile from './assets/empty.png';
import * as waterTile from './assets/water.png';
import { tileWidth, tileHeight } from '../../hex/hexGeo';
import { Layer } from '../layer';
import { VisibleTile } from '../../canvas/canvas';
import { Object3D, BoxGeometry, MeshNormalMaterial, Mesh } from 'three';

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
        terrain: Object3D;
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

0
            const geometry = new BoxGeometry(0.2, 0.2, 0.2);
            const material = new MeshNormalMaterial();

            const mesh = new Mesh(geometry, material);
            tile.canvas.terrain = mesh;
            tile.canvas.container.add(mesh);

            this.update(tile);
        }
    }
    update(tile: Tile): void {
        if (tile.terrain && tile.canvas) {
            //tile.canvas.terrain
        }
    }
    exit(tile: Tile): void {
        if (tile.terrain && tile.canvas) {
            tile.canvas.container.remove(tile.canvas.terrain);
            delete tile.canvas.terrain;
        }
    }
}
