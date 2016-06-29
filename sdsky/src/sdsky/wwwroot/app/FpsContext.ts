namespace sdsky {
    const RefreshFpsInterval = 1;
    export class FpsContext {
        fps = 0;
        private lastRecordTime = 0;
        private framesSinceLastRecord = 0;

        update(currentTime: number) {
            let interval = currentTime - this.lastRecordTime;
            if (interval > RefreshFpsInterval) {
                this.fps = this.framesSinceLastRecord / interval;
                this.lastRecordTime = currentTime;
                this.framesSinceLastRecord = 1;
            } else {
                this.framesSinceLastRecord += 1;
            }
        }
    }
}