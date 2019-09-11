import { Canvas } from './canvas/canvas';
import './index.scss';

const canves = new Canvas();

document.body.appendChild(canves.canvasElement);
canves.render();

canves.hover( {x:2, y:3} );
