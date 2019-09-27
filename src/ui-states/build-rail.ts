import { UiState } from './shared';
import { TileMap } from '../hex/tileMap';
import { ViewCoord, toMap, HexDir, getDir, shift } from '../hex/hexGeo';
import { VisibleTile, Canvas } from '../canvas/canvas';
import { TileWithStructure } from '../layers/structure/structure';

export class BuildRail extends UiState {
    hoveredElement: VisibleTile;
    hoveredNeighbourElement: VisibleTile;

    constructor(private map: TileMap<VisibleTile & TileWithStructure>, private canvas: Canvas) {
        super();
    }

    resetHover(): void {
        if (this.hoveredElement && this.hoveredElement.canvas) {
            this.hoveredElement.canvas._element.style.opacity = '1';
        }
        if (this.hoveredNeighbourElement && this.hoveredNeighbourElement.canvas) {
            this.hoveredNeighbourElement.canvas._element.style.opacity = '1';
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
        const tile = this.canvas.getSafeVisibleTile(m);
        if (tile) {
            const neighbourDir: HexDir = getDir(m, w);
            const neighBourTile = this.canvas.getSafeVisibleTile(shift(m, neighbourDir));
            if (neighBourTile) {
                neighBourTile.canvas._element.style.opacity = '.7';
                this.hoveredNeighbourElement = neighBourTile;
                tile.canvas._element.style.opacity = '.7';
                this.hoveredElement = tile;
            }
        }
    }

    click(): void {
        // TODO
    }
}
