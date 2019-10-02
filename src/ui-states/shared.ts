import { ViewCoord } from '../hex/hexGeo';

export abstract class UiState {
    abstract hover(w: ViewCoord, e: MouseEvent): void;
    abstract resetHover(): void;
    abstract click(w: ViewCoord, e: MouseEvent): void;
    abstract enable(): void;
    abstract disable(): void;
}
