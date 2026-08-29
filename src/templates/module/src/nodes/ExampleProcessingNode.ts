import { DataFrame, ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { ExampleDataFrame } from '../data';

/**
 * Example Processing Node
 *
 * ## Expected Behavior
 * It should take in a normal data frame, process it and output an [[ExampleDataFrame]]
 * that includes a domain. All data objects in the data frame should be [[ExampleDataObject]]s
 * with a URI that is the domain + uid.
 */
export class ExampleProcessingNode extends ProcessingNode<DataFrame, ExampleDataFrame> {
    public domain: string;

    constructor(domain: string, options?: ProcessingNodeOptions) {
        super(options);
        this.domain = domain;
    }

    public process(frame: DataFrame): Promise<ExampleDataFrame> {
        return new Promise((resolve) => {
            frame.getObjects().forEach((object) => {});
            resolve(frame as any);
        });
    }
}
