import { ViewCoord } from "../hex/hexGeo";

export abstract class UiState {
    abstract hover(w: ViewCoord): void;
    abstract click(w: ViewCoord): void;
    abstract release(): void;
}