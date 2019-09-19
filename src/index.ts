import './index.scss';
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

document.body.appendChild(canvas.canvasElement);
canvas.render();

document.addEventListener('keypress', e => {
    if (e.key == '1')
        canvas.setUiState( new EditTerrain(map) );
    if (e.key == '2')
        canvas.setUiState( new BuildRail(map) );
})