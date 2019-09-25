import * as styles from './index.scss';
import { Canvas } from './canvas/canvas';
import { HexMap } from './hex/hexmap';
import { EditTerrain } from './ui-states/edit-terrain';
import { BuildRail } from './ui-states/build-rail';
import { Layer } from './layers/layer';
import { TerrainLayer } from './layers/terrain/terrain';
import { StructureLayer } from './layers/structure/structure';

const map = new HexMap(100);

const terrainLayer = new TerrainLayer();
const structureLayer = new StructureLayer();

const laywers: Layer[] = [terrainLayer, structureLayer];
const canvas = new Canvas(map, laywers);

canvas.setUiState(new EditTerrain(map, terrainLayer, 'water'));

const demoCanvas = document.createElement('div');
demoCanvas.classList.add(styles.demoCanvas);
demoCanvas.appendChild(canvas.getElement());

document.body.appendChild(demoCanvas);
canvas.init();
canvas.render();

document.addEventListener('keypress', e => {
    if (e.key == '1') canvas.setUiState(new EditTerrain(map, terrainLayer, 'empty'));
    if (e.key == '2') canvas.setUiState(new EditTerrain(map, terrainLayer, 'water'));
    if (e.key == '3') canvas.setUiState(new BuildRail(map));
});
