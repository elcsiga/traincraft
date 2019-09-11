
const _ = 0;
const R = 1;

const normalize = r => {
    while (r < 0) r += 6;
    while (r > 0) r -= 6;
    return r;
}
const tiles = [
    {
        connections: [_, _, _, _, _, _],
        shape: 'empty',
        rotations: 1,
        next: p => null
    },
    {
        connections: [R, _, _, R, _, _],
        shape: 'straight',
        rotations: 3,
        next: p => p == 0 ? 3 : 0
    },
    {
        connections: [R, _, R, _, _, _],
        shape: 'curved',
        rotations: 6,
        next: p => p === 0 ? 2 : 0
    },
    {
        connections: [R, _, R, R, _, _],
        shape: 'switchRight',
        rotation: 6,
        next: p => p === 0 ? 3 : 0
    },
    {
        connections: [R, _, R, _, _, R],
        shape: 'switchLeft',
        rotations: 6,
        next: p => p === 2 ? 0 : 2
    },
    {
        connections: [R, _, R, R, _, R],
        shape: 'cross',
        rotations: 6,
        next: p => { switch(p) {
            case 0: return 3;
            case 3: return 0;
            case 1: return 4;
            case 4: return 1;           
        }};
    },
    {
        connections: [R, _, _, _, _, _],
        shape: 'end',
        rotations: 6,
        next: p => null
    },
];
