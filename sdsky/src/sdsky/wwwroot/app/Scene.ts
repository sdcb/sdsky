namespace sdsky {
    export class Scene {
        private canvas: CanvasManager;
        private loop = new TimedGameLoop();
        private renderers = Array<RendererBase>();

        getCanvas() {
            return this.canvas;
        }

        update(time: number) {
            for (let renderer of this.renderers) {
                renderer.update(time);
            }
        }

        render(time: number) {
            this.canvas.clear();
            for (let renderer of this.renderers) {
                renderer.render(time);
            }
        }

        addRenderer(renderer: RendererBase) {
            this.renderers.push(renderer);
            this.sortRenderers();
            renderer.onSetOrder.connect(() => this.sortRenderers());
        }

        private sortRenderers() {
            this.renderers.sort((a, b) => b.order - a.order);
        }

        constructor(canvasElement: HTMLCanvasElement) {
            this.canvas = new CanvasManager(<HTMLCanvasElement>document.querySelector("canvas"));
            this.loop.onRender.connect(time => this.render(time));
            this.loop.onUpdate.connect(time => this.update(time));
        }
    }
}
