import { ViewCoord } from '../hex/hexGeo';

export abstract class UiState {
    abstract hover(w: ViewCoord): void;
    abstract resetHover(): void;
    abstract click(e: MouseEvent, w: ViewCoord): void;
    abstract enable(): void;
    abstract disable(): void;
}
