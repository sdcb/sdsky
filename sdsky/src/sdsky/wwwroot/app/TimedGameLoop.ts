namespace sdsky {
    export class TimedGameLoop extends SimpleGameLoop {
        private _totalRenderTime = 0;
        private _lastFrameTime = new Date();
        public onRunningSlow = new PromiseEventVoid();

        get totalRenderTime() {
            return this._totalRenderTime;
        }

        get lastFrameTime() {
            return this._lastFrameTime;
        }

        render() {
            let thisFrameTime = new Date();
            let frameTime = (thisFrameTime.getTime() - this._lastFrameTime.getTime()) / 1000;
            if (frameTime > 0.25) {
                this.onRunningSlow.fire();
            }
            this._lastFrameTime = thisFrameTime;
            this._totalRenderTime += frameTime;
            super.render();
        }
    }
}