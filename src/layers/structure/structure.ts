import { Layer } from '../layer';
import { VisibleTile } from '../../canvas/canvas';
import { tileWidth, tileHeight } from '../../hex/hexGeo';
import { structureTypes, StructureDef } from './structure-types';

import * as styles from './structure.scss';

//////////////////////
//
// The structure layer
//
//////////////////////

type Tile = VisibleTile & TileWithStructure & VisibleTileWithStructure;

export interface TileWithStructure {
    structure?: StructureDef;
}
export interface VisibleTileWithStructure {
    canvas: {
        _structureElement: HTMLImageElement;
    };
}

export class StructureLayer extends Layer {
    enter(tile: Tile): void {
        if (tile.structure) {
            const img = document.createElement('img');
            img.width = tileWidth;
            img.height = tileHeight;
            img.classList.add(styles.tile);

            tile.canvas._structureElement = img;
            tile.canvas.containerElement.appendChild(img);

            this.update(tile);
        }
    }
    update(tile: Tile): void {
        const type = structureTypes[tile.structure.index];
        const element = tile.canvas._structureElement;
        const rotation = tile.structure.rotation;
        element.src = type.image;
        element.style.transform = `rotate(${rotation * 60 + 180}deg)`;
    }
    exit(tile: Tile): void {
        if (tile.structure) {
            tile.canvas._structureElement.remove();
            delete tile.canvas._structureElement;
        }
    }
}
