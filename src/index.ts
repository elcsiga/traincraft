import './index.scss';
import { Canvas } from './canvas/canvas';
import { HexMap } from './hex/hexmap';

const map = new HexMap(2);
const canves = new Canvas(map);

document.body.appendChild(canves.canvasElement);
canves.render();

