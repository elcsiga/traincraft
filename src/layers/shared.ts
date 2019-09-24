import { Tile } from '../hex/hexmap';

export abstract class Layer {
    abstract render(tile: Tile): void;
}
