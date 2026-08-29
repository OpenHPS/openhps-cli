import { DataObjectService } from '@openhps/core';
import { ExampleDataObject } from '../data';

export class ExampleDataService extends DataObjectService<ExampleDataObject> {
    /**
     * Find an example data object by its URI
     * @param {string} uri URI
     * @returns {Promise<ExampleDataObject>} Promise of example data object
     */
    public findByURI(uri: string): Promise<ExampleDataObject> {
        return this.findOne({
            uri,
        });
    }
}
