
const _ = 0;
const R = 1;

const tiles = [
    {
        connections: [_, _, _, _, _, _],
        shape: 'empty',
        rotations: 1
    },
    {
        connections: [R, _, _, R, _, _],
        shape: 'straight',
        rotations: 3,
    },
    {
        connections: [R, _, R, _, _, _],
        shape: 'curved',
        rotations: 6
    },
    {
        connections: [R, _, R, R, _, _],
        shape: 'switchRight',
        rotation: 6
    },
    {
        connections: [R, _, R, _, _, R],
        shape: 'switchLeft',
        rotations: 6
    },
    {
        connections: [R, _, R, R, _, R],
        shape: 'cross',
        rotations: 6
    },
    {
        connections: [R, _, _, _, _, _],
        shape: 'end',
        rotations: 6
    },
];
