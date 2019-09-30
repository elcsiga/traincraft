import { UiState } from './shared';
import { ViewCoord, toMap, HexDir, getDir, shift, opposite } from '../hex/hexGeo';
import { VisibleTile, Canvas } from '../canvas/canvas';
import {
    TileWithStructure,
    StructureLayer,
    StructureDef,
} from '../layers/structure/structure';
import { toConnections, setConnection, toStructureDesc, StructureDesc } from '../layers/structure/structure-types';


type Tile = VisibleTile & TileWithStructure;

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
                this.cursor.tile1.canvas._element.style.opacity = '1';
            }
            if (this.cursor.tile2.canvas) {
                this.cursor.tile2.canvas._element.style.opacity = '1';
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
                tile1.canvas._element.style.opacity = '.7';
                tile2.canvas._element.style.opacity = '.7';

                this.cursor = { tile1, tile2, dir };
            }
        }
    }

    private getNewDesc(tile: Tile, dir: HexDir, connetcion: string): StructureDesc | false {
        const desc = tile.structure ? tile.structure.type : null
        const connections = toConnections(desc);
        const newConnections = setConnection(connections, connetcion, dir);
        return toStructureDesc(newConnections);
    }

    private applyDesc(tile: Tile, newDewsc: StructureDesc) {

        console.log()
        if (!tile.structure && newDewsc) {
            tile.structure = {
                type: newDewsc,
                _element: null
            }
            this.layer.enter(tile); // TODO refactor: dot definitely visible here
        }
        else if (tile.structure && newDewsc) {
            tile.structure.type = newDewsc;
            this.layer.update(tile);
        }
        else if (tile.structure && !newDewsc) {
            this.layer.exit(tile);
            tile.structure = null;
        }
    }

    click(e: MouseEvent): void {
        if (this.cursor) {

            const connection = e.ctrlKey ? '_' : this.connection;

            const newDesc1 = this.getNewDesc(this.cursor.tile1, this.cursor.dir, connection);
            const newDesc2 = this.getNewDesc(this.cursor.tile2, opposite(this.cursor.dir), connection);

            if (newDesc1 !== false && newDesc2 !== false) {
                this.applyDesc(this.cursor.tile1, newDesc1);
                this.applyDesc(this.cursor.tile2, newDesc2);
            }
        }
    }
}
