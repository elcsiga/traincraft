import { Canvas, ScreenCoord, VisibleTile, RenderPhase } from "./canvas";
import { MapCoord } from "../hex/hexGeo";

export abstract class Renderer {
    abstract getContainerElement(): HTMLElement;
    abstract init(canvas: Canvas): void;
    abstract updateTransform(offset: ScreenCoord, zoom: number): void;
    abstract createNewTileContainer(tile: VisibleTile, renderPhase: RenderPhase): void;
    abstract removeTileContainer(tile: VisibleTile): void;
    abstract setTileTransform(tile: VisibleTile, m: MapCoord): void;

    abstract resize(): void;
    abstract release(): void;

}