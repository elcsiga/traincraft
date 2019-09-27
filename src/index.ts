import * as styles from './index.scss';
import { Canvas, VisibleTile } from './canvas/canvas';
import { HexMap } from './hex/hexmap';
import { EditTerrain } from './ui-states/edit-terrain';
import { BuildRail } from './ui-states/build-rail';
import { Layer } from './layers/layer';
import { TerrainLayer, TileWithTerrain } from './layers/terrain/terrain';
import { StructureLayer, TileWithStructure } from './layers/structure/structure';

type TrainCraftTile = VisibleTile & TileWithTerrain & TileWithStructure;
const map = new HexMap<TrainCraftTile>(100);
map.create(() => ({
    terrain: {
        type: Math.random() > 0.5 ? 'empty' : 'water',
        _element: null,
    },
    structure: null,
    canvas: null,
}));

const terrainLayer = new TerrainLayer();
const structureLayer = new StructureLayer();

const laywers: Layer[] = [terrainLayer, structureLayer];
const canvas = new Canvas(map, laywers);

const uiStates = [
    new EditTerrain(map, canvas, terrainLayer, 'empty'),
    new EditTerrain(map, canvas, terrainLayer, 'water'),
    new BuildRail(map, canvas),
];
canvas.setUiState(uiStates[0]);

const demoCanvas = document.createElement('div');
demoCanvas.classList.add(styles.demoCanvas);
demoCanvas.appendChild(canvas.getElement());

document.body.appendChild(demoCanvas);
canvas.init();
canvas.render();

document.addEventListener('keypress', e => {
    if (e.key == '1') canvas.setUiState(uiStates[0]);
    if (e.key == '2') canvas.setUiState(uiStates[1]);
    if (e.key == '3') canvas.setUiState(uiStates[2]);
});
