import { UiState } from './shared';
import { ViewCoord, toMap, HexDir, getDir, shift, opposite } from '../hex/hexGeo';
import { VisibleTile, Canvas } from '../canvas/canvas';
import {
    TileWithStructure,
    toConnections,
    setConnection,
    toStructureDef,
    StructureLayer,
} from '../layers/structure/structure';

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

    click(): void {
        if (this.cursor) {
            const connections = toConnections(this.cursor.tile.structure);
            const neighbourConnections = toConnections(this.cursor.neighbourTile.structure);

            const dir = this.cursor.dir;
            const neighbourDir = opposite(dir);

            const newConnections = setConnection(connections, 'R', dir);
            const newNeighbourConnections = setConnection(neighbourConnections, 'R', neighbourDir);

            const newStructureDef = toStructureDef(newConnections);
            const newNeighBourStructureDef = toStructureDef(newNeighbourConnections);

            if (newStructureDef !== false && newNeighBourStructureDef !== false) {
                // TO BE CONTINUED

                if (!this.cursor.tile.structure && newStructureDef) {
                    this.layer.enter(this.cursor.tile);
                } else if (newStructureDef) {
                    this.layer.update(this.cursor.tile);
                } else if (this.cursor.tile.structure && !newStructureDef) {
                    this.layer.exit(this.cursor.tile);
                }
            }
        }
    }
}
