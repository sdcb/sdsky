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
}
