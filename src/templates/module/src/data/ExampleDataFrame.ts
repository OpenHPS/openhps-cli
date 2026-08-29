import { SerializableMember, DataFrame, SerializableObject } from '@openhps/core';

/**
 * Example data frame that adds a non trivial domain string attribute
 */
@SerializableObject()
export class ExampleDataFrame extends DataFrame {
    @SerializableMember()
    public domain: string;
}
