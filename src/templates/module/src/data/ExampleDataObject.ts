import { DataObject, SerializableObject, SerializableMember } from '@openhps/core';

/**
 * Example data object that adds an URI attribute
 */
@SerializableObject()
export class ExampleDataObject extends DataObject {
    @SerializableMember()
    public uri: string;
}
