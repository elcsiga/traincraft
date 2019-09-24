import { Tile } from '../hex/hexmap';

export abstract class Layer {
    abstract enter(tile: Tile): void;
    abstract update(tile: Tile): void;
    abstract exit(tile: Tile): void;
}
