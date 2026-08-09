import { GraphBuilder, IMUBrowserSource } from '@openhps/core/dist/web/openhps-core.es';

export default GraphBuilder.create().from(new IMUBrowserSource()).to('imu');
