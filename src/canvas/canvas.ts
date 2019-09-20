import * as styles from './canvas.scss';
import { toView, MapCoord, ViewCoord, toMap, tileWidth, tileHeight, getDir, HexDir, shift } from '../hex/hexGeo';
import { HexMap } from '../hex/hexmap';
import { UiState } from '../ui-states/shared';
import { Layer } from '../layers/shared';

interface EventPos {
    clientX: number;
    clientY: number;
}
interface ScreenCoord {
    sx: number,
    sy: number
}
export class Canvas {
    containerElement: HTMLElement;
    canvasElement: HTMLElement;

    width: number;
    height: number;
    top: number;
    left: number;

    uiState: UiState = null;
    lastHoveredPosition: ViewCoord = null;


    panBase: {eventPos: EventPos, offset: ScreenCoord} = null;

    viewOffset: ScreenCoord = {sx: 0, sy: 0};
    zoom: number = 1;

    lastMousePos: EventPos = null;

    constructor(private map: HexMap, private layers: Layer[]) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.canvas);
        this.containerElement = document.createElement('div');
        this.containerElement.classList.add(styles.container);
        this.containerElement.appendChild(this.canvasElement);

        this.containerElement.addEventListener('mousemove', this.handleMouseMove);
        this.containerElement.addEventListener('mousedown', this.handleMouseDown);
        this.containerElement.addEventListener('mouseup', this.handleMouseUp);
        this.containerElement.addEventListener('click', this.handleClick);
        this.containerElement.addEventListener('mouseleave', this.handleMouseLeave);
        this.containerElement.addEventListener('wheel', this.handleWheel);
        document.addEventListener('resize', this.handleResize);
    }

    init() {
        this.updateContainer();
    }
    getElement() { return this.containerElement; }

    release() {
        this.uiState.release();


        this.containerElement.removeEventListener('mousemove', this.handleMouseMove);
        this.containerElement.removeEventListener('mousedown', this.handleMouseDown);
        this.containerElement.removeEventListener('mouseup', this.handleMouseUp);
        this.containerElement.removeEventListener('click', this.handleClick);
        this.containerElement.removeEventListener('mouseleave', this.handleMouseLeave);
        this.containerElement.removeEventListener('wheel', this.handleWheel);
        document.removeEventListener('resize', this.handleResize);

        this.containerElement.remove();
    }

    private handleMouseMove = (e: MouseEvent) => {

        if (this.panBase) {
            const from = this.toScreen(this.panBase.eventPos);
            const to = this.toScreen(e);

            this.viewOffset = {
                sx: this.panBase.offset.sx + to.sx - from.sx,
                sy: this.panBase.offset.sy + to.sy - from.sy
            }
            this.updateTransform();
        } else {
            const w = this.getViewCoord(e);
            this.lastHoveredPosition = w;
            this.uiState.hover(w);
        }
        this.lastMousePos = e;
    }

    private handleMouseDown = (e: MouseEvent) => {
        if (e.button === 1) {
            this.uiState.resetHover();
            this.lastHoveredPosition = null;
            this.panBase = {
                eventPos: e,
                offset: this.viewOffset
            }
        }
        this.lastMousePos = e;
    }

    private handleMouseUp = (e: MouseEvent) => {
        if (e.button === 1) {
            this.panBase = null;

            const w = this.getViewCoord(e);
            this.lastHoveredPosition = w;
            this.uiState.hover(w);
        }
        this.lastMousePos = e;
    }

    private handleClick = (e: MouseEvent) => {
        if (e.button === 0) {
            const w = this.getViewCoord(e);
            this.uiState.click(w);
        }
    }

    private handleMouseLeave = (e: MouseEvent) => {
        this.uiState.resetHover();
        this.panBase = null;
        this.lastMousePos = null;
    }

    private handleWheel = (e: WheelEvent) => {
        this.zoom = Math.max(.3, Math.min(3, this.zoom * (e.deltaY < 0 ? 1.2 : 0.8)));
        this.updateTransform();
    }

    private handleResize = (e: WheelEvent) => {
        this.updateContainer();
    }

    /////////////

    private toScreen(e:EventPos): ScreenCoord {
        return {
            sx: e.clientX - this.left - this.width / 2,
            sy: this.height / 2 + this.top - e.clientY
        };
    }

    private screenToView(s: ScreenCoord): ViewCoord {
        return {
            wx: (s.sx - this.viewOffset.sx) / this.zoom,
            wy: (s.sy - this.viewOffset.sy) / this.zoom
        };
    }


    private getViewCoord(e: EventPos) {
        return this.screenToView( this.toScreen(e) );
    }

    private updateContainer() {
        this.width = this.containerElement.offsetWidth;
        this.height = this.containerElement.offsetHeight;
        const rect = this.containerElement.getBoundingClientRect();
        this.top = rect.top;
        this.left = rect.left;
        this.updateTransform();
    }

    private updateTransform() {
        const tx = this.viewOffset.sx;
        const ty = - this.viewOffset.sy;
        const z = this.zoom;
        this.canvasElement.style.transform = `translate(${tx}px, ${ty}px) scale(${z}, ${z})`;
    }

    render(): void {
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
