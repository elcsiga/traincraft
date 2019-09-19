import * as styles from './canvas.scss';
import { toView, MapCoord, ViewCoord, toMap, tileWidth, tileHeight, getDir, HexDir, shift } from '../hex/hexGeo';
import { HexMap } from '../hex/hexmap';
import { UiState } from '../ui-states/shared';
import { Layer } from '../layers/shared';

export class Canvas {
    containerElement: HTMLElement;
    canvasElement: HTMLElement;

    width: number;
    height: number;

    uiState: UiState = null;
    lastHoveredPosition: ViewCoord = null;

    panStartPos: ViewCoord = null;
    viewOffset: ViewCoord = {wx: 0, wy: 0};

    constructor(private map: HexMap, private layers: Layer[]) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.canvas);
        this.containerElement = document.createElement('div');
        this.containerElement.classList.add(styles.container);
        this.containerElement.appendChild(this.canvasElement);

    containerElement: HTMLElement;
        this.containerElement.addEventListener('mousemove', this.handleMouseMove);
        this.containerElement.addEventListener('mousedown', this.handleMouseDown);
        this.containerElement.addEventListener('mouseup', this.handleMouseUp);
        this.containerElement.addEventListener('click', this.handleClick);
        this.containerElement.addEventListener('mouseleave', this.handleMouseLeave);
    }

    getElement() { return this.containerElement; }

    release() {
        this.uiState.release();

        this.containerElement.removeEventListener('mousemove', this.handleMouseMove);
        this.containerElement.removeEventListener('mousedown', this.handleMouseDown);
        this.containerElement.removeEventListener('mouseup', this.handleMouseUp);
        this.containerElement.removeEventListener('click', this.handleClick);
        this.containerElement.removeEventListener('mouseleave', this.handleMouseLeave);

        this.containerElement.remove();
    }

    private handleMouseMove = (e: MouseEvent) => {  
        if (this.panStartPos) {
            const w = {
                wx: e.x - this.width / 2,
                wy: this.height / 2 - e.y
            };
            this.viewOffset = {
                wx: w.wx - this.panStartPos.wx,
                wy: w.wy - this.panStartPos.wy,
            }
            this.updateTransform();
        } else {
            const w = this.getViewCoord(e);  
            this.lastHoveredPosition = w;
            this.uiState.hover(w);            
        }  

    }

    private handleMouseDown = (e: MouseEvent) => {
        console.log(e);
        if (e.button === 1) {
            this.uiState.resetHover();
            this.lastHoveredPosition = null;
            this.panStartPos = this.getViewCoord(e);
        }
    }
    
    private handleMouseUp = (e: MouseEvent) => {
        if (e.button === 1) {
            this.panStartPos = null;

            const w = this.getViewCoord(e);
            this.lastHoveredPosition = w;
            this.uiState.hover(w);
        }
    }

    private handleClick = (e: MouseEvent) => {
        if (e.button === 0) {
            const w = this.getViewCoord(e);
            this.uiState.click(w);
        }
    }

    private handleMouseLeave = (e: MouseEvent) => {
        this.uiState.resetHover();
        this.panStartPos = null;
    }

    private getViewCoord(e: MouseEvent) {
        return {
            wx: e.x - this.width / 2 - this.viewOffset.wx,
            wy: this.height / 2 - e.y - this.viewOffset.wy
        };
    }

    private updateTransform() {
        const tx = this.viewOffset.wx;
        const ty = - this.viewOffset.wy;
        this.canvasElement.style.transform = `translate(${tx}px, ${ty}px) rotate(0deg)`;
    }

    render(): void {
        this.width = this.containerElement.offsetWidth;
        this.height = this.containerElement.offsetHeight;

        const mapSize = this.map.size;

        const cx = this.width / 2 - tileWidth / 2;
        const cy = this.height / 2 - tileHeight / 2;

        for (let x = -mapSize; x <= mapSize; x++) {
            for (let y = -mapSize; y <= mapSize; y++) {
                const m = { x, y };
                const w = toView(m);
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
