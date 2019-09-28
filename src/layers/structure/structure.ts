import { Layer } from '../layer';
import { VisibleTile } from '../../canvas/canvas';
import { tileWidth, tileHeight, HexDir } from '../../hex/hexGeo';
import { structureTypes, StructureDesc } from './structure-types';

import * as styles from './structure.scss';

//////////////////////
//
// The structure layer
//
//////////////////////

type Tile = VisibleTile & TileWithStructure;


export interface StructureDef {
    type: StructureDesc;
    _element: HTMLImageElement;
}
export interface TileWithStructure {
    structure: StructureDef;
}

export class StructureLayer extends Layer {
    enter(tile: Tile): void {
        if (tile.structure) {
            console.log('ENTER', tile.structure )
            const img = document.createElement('img');
            img.width = tileWidth;
            img.height = tileHeight;
            img.classList.add(styles.tile);

            tile.structure._element = img;
            tile.canvas._element.appendChild(img);

            this.update(tile);
        }
    }
    update(tile: Tile): void {
        const type = structureTypes[tile.structure.type.index];
        const element = tile.structure._element;
        const rotation = tile.structure.type.rotation;
        element.src = type.image;
        element.style.transform = `rotate(${rotation * 60 + 180}deg)`;

    }
    exit(tile: Tile): void {
        if (tile.structure) {
            tile.structure._element.remove();
            tile.structure._element = null;
        }
    }
}
