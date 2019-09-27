import { VisibleTile } from '../canvas/canvas';
import { MapCoord } from '../hex/hexGeo';

export abstract class Layer {
    abstract enter(tile: VisibleTile, m: MapCoord): void;
    abstract update(tile: VisibleTile, m: MapCoord): void;
    abstract exit(tile: VisibleTile, m: MapCoord): void;
}
