import * as styles from './canvas.scss';
import { toView, ViewCoord, tileWidth, tileHeight, toMap, MapCoord, MapArea, forachAreaCoord } from '../hex/hexGeo';
import { TileMap } from '../hex/tileMap';
import { UiState } from '../ui-states/shared';
import { Layer } from '../layers/layer';

export interface VisibleTile {
    canvas?: {
        containerElement: HTMLElement;
        renderPhase: RnderPhase;
    };
}

interface ScreenCoord {
    sx: number;
    sy: number;
}
export type RnderPhase = 1 | 2;

export class Canvas {
    private containerElement: HTMLElement;
    private canvasElement: HTMLElement;

    private rect: {
        width: number;
        height: number;
        top: number;
        left: number;
    };

    private lastHoveredPosition: ViewCoord = null;

    private uiState: UiState = null;
    private panBase: { mousePos: ScreenCoord; offset: ScreenCoord } = null;
    public keysPressed = new Set();

    private viewOffset: ScreenCoord = { sx: 0, sy: 0 };
    private zoom = 1;

    private renderPhase: RnderPhase = 1;
    private previousMapArea: MapArea = null;

    private lastMousePos: ScreenCoord = null;

    constructor(private map: TileMap<VisibleTile>, private layers: Layer[]) {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.canvas);
        this.containerElement = document.createElement('div');
        this.containerElement.classList.add(styles.container);
        this.containerElement.appendChild(this.canvasElement);

        this.eventHandlers.forEach(e => this.containerElement.addEventListener(e.key, e.handler));
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keyup', this.handleKeys);
        document.addEventListener('keydown', this.handleKeys);
    }

    init(): void {
        this.updateContainer();
    }

    release(): void {
        this.uiState.disable();

        this.eventHandlers.forEach(e => this.containerElement.removeEventListener(e.key, e.handler));
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keyup', this.handleKeys);
        document.removeEventListener('keydown', this.handleKeys);

        this.containerElement.remove();
    }

    getElement(): HTMLElement {
        return this.containerElement;
    }

    getSafeVisibleTile(m: MapCoord): VisibleTile {
        const tile = this.map.getSafeTile(m);
        return tile && tile.canvas ? tile : null;
    }

    // hover

    private hover(e: MouseEvent): void {
        const w = this.screenToView(this.getMousePos(e));
        this.lastHoveredPosition = w;
        this.uiState.hover(w);
    }

    private resetHover(): void {
        this.uiState.resetHover();
        this.lastHoveredPosition = null;
    }

    // area

    getAreaOffset(): ScreenCoord {
        return {
            sx: tileWidth * this.zoom,
            sy: tileHeight * this.zoom,
        };
    }

    getArea(): MapArea {
        const areaOffset = this.getAreaOffset();
        return {
            tl: toMap(
                this.screenToView({
                    sx: -this.rect.width / 2 - areaOffset.sx,
                    sy: this.rect.height / 2 + areaOffset.sy,
                }),
            ),
            br: toMap(
                this.screenToView({
                    sx: this.rect.width / 2 + areaOffset.sx,
                    sy: -this.rect.height / 2 - areaOffset.sy,
                }),
            ),
        };
    }

    eventHandlers: { key: string; handler: EventListener }[] = [
        {
            key: 'mousemove',
            handler: (e: MouseEvent) => {
                if (this.panBase) {
                    const from = this.panBase.mousePos;
                    const to = this.getMousePos(e);

                    const dx = to.sx - from.sx;
                    const dy = to.sy - from.sy;

                    this.viewOffset = {
                        sx: this.panBase.offset.sx + dx,
                        sy: this.panBase.offset.sy + dy,
                    };
                    this.updateTransform();

                    const areaOffset = this.getAreaOffset();
                    if (Math.abs(dx) > areaOffset.sx || Math.abs(dy) > areaOffset.sy) {
                        this.panBase.offset = this.viewOffset;
                        this.panBase.mousePos = this.getMousePos(e);
                        this.render();
                    }
                } else {
                    this.hover(e);
                }
                this.lastMousePos = this.getMousePos(e);
            },
        },
        {
            key: 'mousedown',
            handler: (e: MouseEvent) => {
                if (e.button === 1) {
                    this.resetHover();
                    this.panBase = {
                        mousePos: this.getMousePos(e),
                        offset: this.viewOffset,
                    };
                    this.containerElement.style.cursor = 'all-scroll';
                }
                this.lastMousePos = this.getMousePos(e);
            },
        },
        {
            key: 'mouseup',
            handler: (e: MouseEvent) => {
                if (e.button === 1) {
                    this.panBase = null;
                    this.render();
                    this.hover(e);
                    this.containerElement.style.cursor = 'auto';
                }
                this.lastMousePos = this.getMousePos(e);
            },
        },
        {
            key: 'click',
            handler: (e: MouseEvent) => {
                if (e.button === 0) {
                    const w = this.screenToView(this.getMousePos(e));
                    this.uiState.click(w);
                }
                this.lastMousePos = this.getMousePos(e);
            },
        },
        {
            key: 'mouseleave',
            handler: () => {
                this.uiState.resetHover();
                this.panBase = null;
                this.lastMousePos = null;
                this.containerElement.style.cursor = 'auto';
            },
        },
        {
            key: 'wheel',
            handler: (e: WheelEvent) => {
                if (this.lastMousePos) {
                    const w = this.screenToView(this.lastMousePos);
                    this.zoom = Math.max(0.3, Math.min(2, this.zoom * (e.deltaY < 0 ? 1.2 : 0.8)));
                    const newScreenPos = this.viewToScreen(w);

                    this.viewOffset.sx -= newScreenPos.sx - this.lastMousePos.sx;
                    this.viewOffset.sy -= newScreenPos.sy - this.lastMousePos.sy;

                    this.updateTransform();
                    this.render();
                }
            },
        },
    ];

    private handleResize: () => void = () => {
        console.log('R');
        this.updateContainer();
    };
    private handleKeys: (e: KeyboardEvent) => void = (e) => {
        if (e.type === 'keydown' && !this.keysPressed.has(e.key)) {
            this.keysPressed.add(e.key);
            this.uiState.hover(this.lastHoveredPosition);
        } else if (e.type === 'keyup' && this.keysPressed.has(e.key)) {
            this.keysPressed.delete(e.key);
            this.uiState.hover(this.lastHoveredPosition);
        }

    };

    public isKeyPressed(k: string): boolean {
        return this.keysPressed.has(k);
    }

    /////////////

    private getMousePos(e: MouseEvent): ScreenCoord {
        return {
            sx: e.clientX - this.rect.left - this.rect.width / 2,
            sy: this.rect.height / 2 + this.rect.top - e.clientY,
        };
    }

    private screenToView(s: ScreenCoord): ViewCoord {
        return {
            wx: (s.sx - this.viewOffset.sx) / this.zoom,
            wy: (s.sy - this.viewOffset.sy) / this.zoom,
        };
    }

    private viewToScreen(w: ViewCoord): ScreenCoord {
        return {
            sx: w.wx * this.zoom + this.viewOffset.sx,
            sy: w.wy * this.zoom + this.viewOffset.sy,
        };
    }

    private updateContainer(): void {
        const rect = this.containerElement.getBoundingClientRect();
        this.rect = {
            top: rect.top,
            left: rect.left,
            width: this.containerElement.offsetWidth,
            height: this.containerElement.offsetHeight
        };

        this.updateTransform();
        this.render();
    }

    private updateTransform(): void {
        const tx = this.viewOffset.sx;
        const ty = -this.viewOffset.sy;
        const z = this.zoom;
        this.canvasElement.style.transform = `translate(${tx}px, ${ty}px) scale(${z}, ${z})`;
    }

    render(): void {
        const area = this.getArea();
        forachAreaCoord(this.getArea(), m => {
            const tile = this.map.getSafeTile(m);
            if (tile) {
                if (!tile.canvas) {
                    this.enter(tile, m);
                } else {
                    tile.canvas.renderPhase = this.renderPhase;
                }
            }
        });

        if (this.previousMapArea) {
            forachAreaCoord(this.previousMapArea, m => {
                const tile = this.getSafeVisibleTile(m);
                if (tile && tile.canvas.renderPhase !== this.renderPhase) {
                    this.exit(tile, m);
                }
            });
        }

        this.renderPhase = this.renderPhase === 1 ? 2 : 1;
        this.previousMapArea = area;
    }

    enter(tile: VisibleTile, m: MapCoord): void {
        const w = toView(m);
        const div = document.createElement('div');
        div.classList.add(styles.tile);

        //TODO
        const cx = this.rect.width / 2 - tileWidth / 2;
        const cy = this.rect.height / 2 - tileHeight / 2;

        const tx = cx + w.wx;
        const ty = cy - w.wy;
        div.style.transform = `translate(${tx}px, ${ty}px) rotate(0deg)`;

        this.canvasElement.appendChild(div);
        tile.canvas = {
            containerElement: div,
            renderPhase: this.renderPhase,
        };

        this.layers.forEach(layer => {
            layer.enter(tile, m);
        });
    }

    exit(tile: VisibleTile, m: MapCoord): void {
        this.layers.forEach(layer => {
            layer.exit(tile, m);
        });
        tile.canvas.containerElement.remove();
        delete tile.canvas;
    }

    setUiState(state: UiState): void {
        if (this.uiState) {
            this.uiState.resetHover();
            this.uiState.disable();
        }
        this.uiState = state;
        this.uiState.enable();

        if (this.lastHoveredPosition) {
            state.hover(this.lastHoveredPosition);
        }
    }
}
