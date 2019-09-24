import * as styles from './canvas.scss';
import { toView, ViewCoord, tileWidth, tileHeight } from '../hex/hexGeo';
import { HexMap } from '../hex/hexmap';
import { UiState } from '../ui-states/shared';
import { Layer } from '../layers/layer';

interface EventPos {
    clientX: number;
    clientY: number;
}
interface ScreenCoord {
    sx: number;
    sy: number;
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

    panBase: { eventPos: EventPos; offset: ScreenCoord } = null;

    viewOffset: ScreenCoord = { sx: 0, sy: 0 };
    zoom = 1;

    lastMousePos: EventPos = null;

    constructor(private map: HexMap, private layers: Layer[]) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.canvas);
        this.containerElement = document.createElement('div');
        this.containerElement.classList.add(styles.container);
        this.containerElement.appendChild(this.canvasElement);

        this.eventHandlers.forEach(e => this.containerElement.addEventListener(e.key, e.handler));
    }

    init(): void {
        this.updateContainer();
    }
    getElement(): HTMLElement {
        return this.containerElement;
    }

    release(): void {
        this.uiState.release();

        this.eventHandlers.forEach(e => this.containerElement.removeEventListener(e.key, e.handler));
        document.removeEventListener('resize', this.handleResize);

        this.containerElement.remove();
    }

    eventHandlers: { key: string; handler: EventListener }[] = [
        {
            key: 'mousemove',
            handler: (e: MouseEvent) => {
                if (this.panBase) {
                    const from = this.toScreen(this.panBase.eventPos);
                    const to = this.toScreen(e);

                    this.viewOffset = {
                        sx: this.panBase.offset.sx + to.sx - from.sx,
                        sy: this.panBase.offset.sy + to.sy - from.sy,
                    };
                    this.updateTransform();
                } else {
                    const w = this.getViewCoord(e);
                    this.lastHoveredPosition = w;
                    this.uiState.hover(w);
                }
                this.lastMousePos = e;
            },
        },
        {
            key: 'mousedown',
            handler: (e: MouseEvent) => {
                if (e.button === 1) {
                    this.uiState.resetHover();
                    this.lastHoveredPosition = null;
                    this.panBase = {
                        eventPos: e,
                        offset: this.viewOffset,
                    };
                }
                this.lastMousePos = e;
            },
        },
        {
            key: 'mouseup',
            handler: (e: MouseEvent) => {
                if (e.button === 1) {
                    this.panBase = null;

                    const w = this.getViewCoord(e);
                    this.lastHoveredPosition = w;
                    this.uiState.hover(w);
                }
                this.lastMousePos = e;
            },
        },
        {
            key: 'click',
            handler: (e: MouseEvent) => {
                if (e.button === 0) {
                    const w = this.getViewCoord(e);
                    this.uiState.click(w);
                }
            },
        },
        {
            key: 'mouseleave',
            handler: () => {
                this.uiState.resetHover();
                this.panBase = null;
                this.lastMousePos = null;
            },
        },
        {
            key: 'wheel',
            handler: (e: WheelEvent) => {
                this.zoom = Math.max(0.3, Math.min(3, this.zoom * (e.deltaY < 0 ? 1.2 : 0.8)));
                this.updateTransform();
            },
        },
    ];

    private handleResize: () => void = () => {
        this.updateContainer();
    };

    /////////////

    private toScreen(e: EventPos): ScreenCoord {
        return {
            sx: e.clientX - this.left - this.width / 2,
            sy: this.height / 2 + this.top - e.clientY,
        };
    }

    private screenToView(s: ScreenCoord): ViewCoord {
        return {
            wx: (s.sx - this.viewOffset.sx) / this.zoom,
            wy: (s.sy - this.viewOffset.sy) / this.zoom,
        };
    }

    private getViewCoord(e: EventPos): ViewCoord {
        return this.screenToView(this.toScreen(e));
    }

    private updateContainer(): void {
        this.width = this.containerElement.offsetWidth;
        this.height = this.containerElement.offsetHeight;
        const rect = this.containerElement.getBoundingClientRect();
        this.top = rect.top;
        this.left = rect.left;
        this.updateTransform();
    }

    private updateTransform(): void {
        const tx = this.viewOffset.sx;
        const ty = -this.viewOffset.sy;
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

                this.canvasElement.appendChild(div);
                tile.element = div;

                this.layers.forEach(layer => {
                    layer.enter(tile);
                });
            }
        }
    }

    setUiState(state: UiState): void {
        if (this.uiState) {
            this.uiState.release();
        }
        this.uiState = state;
        if (this.lastHoveredPosition) {
            state.hover(this.lastHoveredPosition);
        }
    }
}
