//rails
import * as locomotive from './assets/locomotive.png';
import * as wagon from './assets/wagon.png';

export interface VahicleType {
    image: string;
}

export const vehicleTypes: VahicleType[] = [
    {
        image: locomotive,
    },
    {
        image: wagon,
    },
];
