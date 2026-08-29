import { SinkNode } from '@openhps/core';
import { ExampleDataFrame } from '../data';

/**
 * Example Sink Node
 *
 * ## Expected Behavior
 * The sink node has an internal counter that increments on every frame it receives
 */
export class ExampleSink extends SinkNode<ExampleDataFrame> {
    private _counter: number = 0;

    /**
     * Push function triggered whenever a frame is received at the sink
     * @param {ExampleDataFrame} frame Data frame that is received
     */
    public onPush(frame: ExampleDataFrame): Promise<void> {
        return new Promise((resolve) => {
            this.logger('debug', frame);
            this._counter++;
            resolve();
        });
    }

    public get count(): number {
        return this._counter;
    }
}
