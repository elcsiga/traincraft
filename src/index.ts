import * as styles from './index.scss';
import { Canvas } from './canvas/canvas';
import { HexMap } from './hex/hexmap';
import { EditTerrain } from './ui-states/edit-terrain';
import { UiState } from './ui-states/shared';
import { BuildRail } from './ui-states/build-rail';
import { Layer } from './layers/shared';
import { Terrain } from './layers/terrain';
import { StructureLayer } from './layers/structure';

const map = new HexMap(2);

const laywers: Layer[] = [
    new Terrain(),
    new StructureLayer()
];
const canvas = new Canvas(map, laywers);

canvas.setUiState( new EditTerrain(map) );

const demoCanvas = document.createElement('div');
demoCanvas.classList.add(styles.demoCanvas);
demoCanvas.appendChild(canvas.getElement());

document.body.appendChild(demoCanvas);
canvas.init();
canvas.render();

document.addEventListener('keypress', e => {
    if (e.key == '1')
        canvas.setUiState( new EditTerrain(map) );
    if (e.key == '2')
        canvas.setUiState( new BuildRail(map) );
})