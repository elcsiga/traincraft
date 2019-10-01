import { UiState } from './shared';
import { ViewCoord, toMap, HexDir, getDir, shift, opposite } from '../hex/hexGeo';
import { VisibleTile, Canvas } from '../canvas/canvas';
import { TileWithStructure, StructureLayer, VisibleTileWithStructure } from '../layers/structure/structure';
import { toConnections, setConnection, toStructureDef, StructureDef } from '../layers/structure/structure-types';

type Tile = VisibleTile & TileWithStructure  & VisibleTileWithStructure;

interface RailCursor {
    tile1: Tile;
    tile2: Tile;
    dir: HexDir;
}
export class EditStructure extends UiState {
    private cursor: RailCursor = null;

    constructor(private canvas: Canvas, private layer: StructureLayer, private connection: string) {
        super();
    }

    resetHover(): void {
        if (this.cursor) {
            if (this.cursor.tile1.canvas) {
                this.cursor.tile1.canvas.containerElement.style.opacity = '1';
            }
            if (this.cursor.tile2.canvas) {
                this.cursor.tile2.canvas.containerElement.style.opacity = '1';
            }
        }
    }

    enable(): void {
        // enabled
    }

    disable(): void {
        // disabled
    }

    hover(w: ViewCoord): void {
        const m = toMap(w);
        this.resetHover();
        const tile1 = this.canvas.getSafeVisibleTile(m) as Tile;
        if (tile1) {
            const dir: HexDir = getDir(m, w);
            const tile2 = this.canvas.getSafeVisibleTile(shift(m, dir)) as Tile;
            if (tile2) {
                tile1.canvas.containerElement.style.opacity = '.7';
                tile2.canvas.containerElement.style.opacity = '.7';

                this.cursor = { tile1, tile2, dir };
            }
        }
    }

    private getNewDef(tile: Tile, dir: HexDir, connetcion: string): StructureDef | false {
        const connections = toConnections(tile.structure);
        const newConnections = setConnection(connections, connetcion, dir);
        return toStructureDef(newConnections);
    }

    private applyDef(tile: Tile, newDewsc: StructureDef): void {
        console.log();
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

    click(e: MouseEvent): void {
        if (this.cursor) {
            const connection = e.ctrlKey ? '_' : this.connection;

            const newDef1 = this.getNewDef(this.cursor.tile1, this.cursor.dir, connection);
            const newDef2 = this.getNewDef(this.cursor.tile2, opposite(this.cursor.dir), connection);

            if (newDef1 !== false && newDef2 !== false) {
                this.applyDef(this.cursor.tile1, newDef1);
                this.applyDef(this.cursor.tile2, newDef2);
            }
        }
    }
}
