import { UiState } from './shared';
import { ViewCoord, toMap, HexDir, getDir, shift, opposite, tileWidth, tileHeight } from '../hex/hexGeo';
import { VisibleTile, Canvas } from '../canvas/canvas';
import { TileWithStructure, StructureLayer, VisibleTileWithStructure } from '../layers/structure/structure';
import {
    toConnections,
    setConnection,
    toStructureDef,
    StructureDef,
    structureTypes,
} from '../layers/structure/structure-types';

import * as styles from './edit-structure.scss';

type Tile = VisibleTile & TileWithStructure & VisibleTileWithStructure;

interface RailCursor {
    tile1: Tile;
    tile2: Tile;
    overlay1: HTMLElement;
    overlay2: HTMLElement;
    dir: HexDir;
}
export class EditStructure extends UiState {
    private cursor: RailCursor = null;

    constructor(private canvas: Canvas, private layer: StructureLayer, private connection: string) {
        super();
    }

    resetHover(): void {
        if (this.cursor) {
            if (this.cursor.overlay1) this.cursor.overlay1.remove();
            if (this.cursor.overlay2) this.cursor.overlay2.remove();
        }
    }

    enable(): void {
        // enabled
    }

    disable(): void {
        // disabled
    }

    getOverlayImage(def: StructureDef): HTMLElement {
        const img = document.createElement('img');
        img.width = tileWidth;
        img.height = tileHeight;
        img.classList.add(styles.structireCursor);

        const type = structureTypes[def.index];
        const rotation = def.rotation;
        img.src = type.image;
        img.style.transform = `rotate(${rotation * 60 + 180}deg)`;

        return img;
    }

    hover(w: ViewCoord): void {
        const m = toMap(w);
        this.resetHover();
        const tile1 = this.canvas.getSafeVisibleTile(m) as Tile;
        if (tile1) {
            const dir: HexDir = getDir(m, w);
            const tile2 = this.canvas.getSafeVisibleTile(shift(m, dir)) as Tile;
            if (tile2) {
                const connection = this.canvas.isKeyPressed('Control') ? '_' : this.connection;

                const newDef1 = this.getNewDef(tile1, dir, connection);
                const newDef2 = this.getNewDef(tile2, opposite(dir), connection);

                if (newDef1 !== false && newDef2 !== false) {

                    const overlay1 = newDef1 ? this.getOverlayImage(newDef1) : null;
                    const overlay2 = newDef2 ? this.getOverlayImage(newDef2) : null;

                    if (overlay1)
                        tile1.canvas.containerElement.appendChild(overlay1);
                    if (overlay2)
                        tile2.canvas.containerElement.appendChild(overlay2);

                    this.cursor = { tile1, tile2, dir, overlay1, overlay2 };
                }
            }
        }
    }

    private getNewDef(tile: Tile, dir: HexDir, connetcion: string): StructureDef | false {
        const connections = toConnections(tile.structure);
        const newConnections = setConnection(connections, connetcion, dir);
        return toStructureDef(newConnections);
    }

    private applyDef(tile: Tile, newDewsc: StructureDef): void {
        if (!tile.structure && newDewsc) {
            tile.structure = newDewsc;
            this.layer.enter(tile); // TODO refactor: dot definitely visible here
        } else if (tile.structure && newDewsc) {
            tile.structure = newDewsc;
            this.layer.update(tile);
        } else if (tile.structure && !newDewsc) {
            this.layer.exit(tile);
            delete tile.structure;
        }
    }

    click(w: ViewCoord): void {
        if (this.cursor) {
            const connection = this.canvas.isKeyPressed('Control') ? '_' : this.connection;

            const newDef1 = this.getNewDef(this.cursor.tile1, this.cursor.dir, connection);
            const newDef2 = this.getNewDef(this.cursor.tile2, opposite(this.cursor.dir), connection);

            if (newDef1 !== false && newDef2 !== false) {
                this.applyDef(this.cursor.tile1, newDef1);
                this.applyDef(this.cursor.tile2, newDef2);
            }
        }
    }
}
