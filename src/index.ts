import * as styles from './index.scss';
import { Canvas, VisibleTile } from './canvas/canvas';
import { TileMap } from './hex/tileMap';
import { EditTerrain } from './ui-states/edit-terrain';
import { EditStructure } from './ui-states/edit-structure';
import { Layer } from './layers/layer';
import { TerrainLayer, TileWithTerrain } from './layers/terrain/terrain';
import { StructureLayer, TileWithStructure } from './layers/structure/structure';
import { distance } from './hex/hexGeo';
import { EditVehicle } from './ui-states/edit-vehicle';
import { VehicleLayer } from './layers/vehicle/vehicle';
import { VehicleMaanager, Tile as VehicleManagerTile } from './layers/vehicle/vehicle-manager';

const MAP_SIZE = 10;
type TrainCraftTile = VisibleTile & TileWithTerrain & TileWithStructure;
const map = new TileMap<TrainCraftTile>(MAP_SIZE);

map.load() ||
    map.create(m =>
        distance(m) > MAP_SIZE
            ? null
            : {
                  terrain: {
                      type: 'empty',
                  },
              },
    );

const terrainLayer = new TerrainLayer();
const structureLayer = new StructureLayer();
const vehicleLayer = new VehicleLayer();

const laywers: Layer[] = [terrainLayer, structureLayer, vehicleLayer];
const canvas = new Canvas(map, laywers);

const vehicleManager = new VehicleMaanager(map as TileMap<VehicleManagerTile>, vehicleLayer);

const uiStates = [
    new EditTerrain(canvas, terrainLayer, 'empty'),
    new EditTerrain(canvas, terrainLayer, 'water'),
    new EditStructure(canvas, structureLayer, 'R'),
    new EditStructure(canvas, structureLayer, 'S'),
    new EditVehicle(canvas, vehicleLayer, 0, vehicleManager),
    new EditVehicle(canvas, vehicleLayer, 1, vehicleManager),
];
canvas.setUiState(uiStates[2]);

const demoCanvas = document.createElement('div');
demoCanvas.classList.add(styles.demoCanvas);
demoCanvas.appendChild(canvas.getElement());

document.body.appendChild(demoCanvas);
canvas.init();

document.addEventListener('keypress', e => {
    if (e.key == '1') canvas.setUiState(uiStates[0]);
    if (e.key == '2') canvas.setUiState(uiStates[1]);
    if (e.key == '3') canvas.setUiState(uiStates[2]);
    if (e.key == '4') canvas.setUiState(uiStates[3]);

    if (e.key == '5') canvas.setUiState(uiStates[4]);
    if (e.key == '6') canvas.setUiState(uiStates[5]);

    if (e.key == 's') map.save();
    if (e.key == ' ') vehicleManager.stepAll();
});
