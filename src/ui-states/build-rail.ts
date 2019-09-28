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
    tile: Tile;
    neighbourTile: Tile;
    dir: HexDir;
}
export class BuildRail extends UiState {
    private cursor: RailCursor = null;

    constructor(private canvas: Canvas, private layer: StructureLayer) {
        super();
    }

    resetHover(): void {
        if (this.cursor) {
            if (this.cursor.tile.canvas) {
                this.cursor.tile.canvas._element.style.opacity = '1';
            }
            if (this.cursor.neighbourTile.canvas) {
                this.cursor.neighbourTile.canvas._element.style.opacity = '1';
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
        const tile = this.canvas.getSafeVisibleTile(m) as Tile;
        if (tile) {
            const neighbourDir: HexDir = getDir(m, w);
            const neighBourTile = this.canvas.getSafeVisibleTile(shift(m, neighbourDir)) as Tile;
            if (neighBourTile) {
                neighBourTile.canvas._element.style.opacity = '.7';

                tile.canvas._element.style.opacity = '.7';

                this.cursor = {
                    tile,
                    neighbourTile: neighBourTile,
                    dir: neighbourDir,
                };
            }
        }
    }

    private getNewDesc( tile: Tile, dir: HexDir, connetcion: string): StructureDesc | false {
        const desc = tile.structure ? tile.structure.type : null
        const connections = toConnections(desc);
        const newConnections = setConnection(connections, connetcion, dir);
        return toStructureDesc(newConnections);
    }

    private applyDesc( tile: Tile, newDewsc: StructureDesc ) {
        if (!tile.structure && newDewsc) {
            tile.structure = {
                type: newDewsc,
                _element: null
            }
            this.layer.enter(this.cursor.tile); // TODO refactor: dot definitely visible here
        }
        else if (tile.structure && newDewsc) {
            tile.structure.type = newDewsc;
            this.layer.update(this.cursor.tile);
        }
        else if (tile.structure && !newDewsc) {
            tile.structure = null;
            this.layer.exit(this.cursor.tile);
        }
    }

    click(): void {
        if (this.cursor) {

            const newDesc1 = this.getNewDesc(this.cursor.tile, this.cursor.dir, 'R');
            const newDesc2 = this.getNewDesc(this.cursor.neighbourTile, opposite(this.cursor.dir), 'R');

            if (newDesc1 !== false && newDesc2 !== false) {
                this.applyDesc( this.cursor.tile, newDesc1 );
                this.applyDesc( this.cursor.neighbourTile, newDesc2 );
            }
        }
    }
}
