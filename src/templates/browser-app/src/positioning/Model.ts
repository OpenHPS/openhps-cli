import core from '@openhps/core/dist/web/openhps-core';

core.ModelBuilder.create()
    .addShape(new core.WorkerNode('imu.js', { poolSize: 4 }))
    .build();
