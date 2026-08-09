import { GraphBuilder, ModelBuilder } from '@openhps/core';
import { MQTTServer, MQTTSourceNode } from '@openhps/mqtt';

ModelBuilder.create()
    .addService(
        new MQTTServer({
            port: 1443,
        }),
    )
    .addShape(
        GraphBuilder.create()
            .from(
                new MQTTSourceNode({
                    uid: 'PL9.3.58',
                }),
            )
            .to(),
    )
    .build()
    .then((model) => {});
