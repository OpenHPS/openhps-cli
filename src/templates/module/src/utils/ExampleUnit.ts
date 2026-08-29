import { SerializableObject, Unit } from '@openhps/core';

/**
 *
 * @category Unit
 */
@SerializableObject()
export class ExampleUnit extends Unit {
    public static readonly CELCIUS = new ExampleUnit('celcius', {
        baseName: 'temperature',
        aliases: ['degrees celcius', 'C'],
    });

    public static readonly FAHRENHEIT = new ExampleUnit('fahrenheit', {
        baseName: 'temperature',
        aliases: ['F'],
        definitions: [{ unit: 'celcius', offset: -32, magnitude: 5 / 9 }],
    });

    public static readonly KELVIN = new ExampleUnit('kelvin', {
        baseName: 'temperature',
        aliases: ['K'],
        definitions: [{ unit: 'celcius', offset: -273.15 }],
    });

    public static readonly RANKINE = new ExampleUnit('rankine', {
        baseName: 'temperature',
        aliases: ['R', 'rankine scale'],
        definitions: [{ unit: 'kelvin', magnitude: 1 / 1.8 }],
    });
}
