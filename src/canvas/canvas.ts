import * as styles from './canvas.scss';
import { toView, MapCoord, ViewCoord, toMap, tileWidth, tileHeight, getDir, HexDir, shift } from '../hex/hexGeo';
import { HexMap } from '../hex/hexmap';
import { Terrain } from '../layers/terrain';
import { UiState } from '../ui-states/shared';
import { stat } from 'fs';
import { Layer } from '../layers/shared';

export class Canvas {
    canvasElement: HTMLElement;

    width: number;
    height: number;

    uiState: UiState = null;
    lastHoveredPosition: ViewCoord = null;

    constructor(private map: HexMap, private layers: Layer[]) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.container);

        this.canvasElement.addEventListener('mousemove', e => {
            const w = this.getViewCoord(e);
            this.lastHoveredPosition = w;
            this.uiState.hover(w);
        });
    }

    private getViewCoord(e: MouseEvent) {
        const cx = this.width / 2 - tileWidth / 2;
        const cy = this.height / 2 - tileHeight / 2;

        return {
            wx: e.x - this.width / 2,
            wy: this.height / 2 - e.y
        };
    }

    render(): void {
        this.width = this.canvasElement.offsetWidth;
        this.height = this.canvasElement.offsetHeight;

        const mapSize = this.map.size;

        const cx = this.width / 2 - tileWidth / 2;
        const cy = this.height / 2 - tileHeight / 2;

        for (let x = -mapSize; x <= mapSize; x++) {
            for (let y = -mapSize; y <= mapSize; y++) {
                const m = {x, y};
                const w = toView( m );
                const tile = this.map.getTile(m);

                const div = document.createElement('div');
                div.classList.add(styles.tile);

                const tx = cx + w.wx;
                const ty = cy - w.wy;
                div.style.transform = `translate(${tx}px, ${ty}px) rotate(0deg)`;

                this.layers.forEach(layer => {
                    const e = layer.render(tile);
                    if (e) {
                        div.appendChild(e);
                    }
                });

                this.canvasElement.appendChild(div);
                tile.element = div;
            }
        }
    }

    setUiState(state: UiState) {
        if (this.uiState) {
            this.uiState.release();
        }
        this.uiState = state;
        if (this.lastHoveredPosition) {
            state.hover(this.lastHoveredPosition);
        }
    }
}
