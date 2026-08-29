import { DataFrame, SourceNode } from '@openhps/core';

/**
 * Example Source Node
 *
 * ## Expected Behavior
 * The source node
 */
export class ExampleSource extends SourceNode<DataFrame> {
    public onPull(): Promise<DataFrame> {
        return new Promise((resolve) => {});
    }
}
