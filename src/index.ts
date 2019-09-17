import './index.scss';
import { Canvas } from './canvas/canvas';
import { HexMap } from './hex/hexmap';

const map = new HexMap(5);
const canves = new Canvas(map);

document.body.appendChild(canves.canvasElement);
canves.render();

canves.hover( {x:2, y:3} );
