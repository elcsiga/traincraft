import * as styles from './canvas.scss';

export class Canvas {
    canvasElement: HTMLElement;
    
    constructor() {
        this.canvasElement = document.createElement('div');
        this.canvasElement.classList.add(styles.container);
    }
}