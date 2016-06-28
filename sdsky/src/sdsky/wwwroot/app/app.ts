namespace sdsky {
    export class SimpleGameLoop {
        public onRender = new PromiseEventVoid();
        private keepsRendering = true;

        start() {
            this.keepsRendering = true;
            this.decideNextRender();
        }

        stop() {
            this.keepsRendering = false;
        }

        render() {
            this.onRender.fire();
            this.decideNextRender();
        }

        decideNextRender() {
            if (this.keepsRendering) {
                requestAnimationFrame(() => this.render());
            }
        }

        constructor() {
            this.start();
        }
    }

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

    var canvas = new CanvasManager(<HTMLCanvasElement>document.querySelector("canvas"));
    let gameLoop = new TimedGameLoop();
    gameLoop.onRender.connect(() => {
        canvas.clear();

        canvas.fillRect(0, 0, canvas.width, canvas.height, "yellow");
        canvas.fillText(gameLoop.totalRenderTime.toFixed(2), 0, 20, "red");

        canvas.transform(float3x2.translation(150, 100));
        canvas.rotate(new Date().getTime() / 1000);
        canvas.drawLine(-30, -30, 30, 30, "red", 10);
    });
}