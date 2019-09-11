import { Canvas } from './canvas/canvas';
import './index.scss';

const canves = new Canvas();

document.body.appendChild(canves.canvasElement);
canves.render();
