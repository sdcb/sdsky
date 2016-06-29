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

    export abstract class RendererBase {
        private _order = 0;
        onSetOrder = new PromiseEvent<number>();

        get order() {
            return this._order;
        }
        set order(value: number) {
            this._order = value;
            this.onSetOrder.fire(this.order);
        }

        update(time: number) {
        }

        render(time: number) {
        }

        constructor(protected canvas: CanvasManager) {
        }
    }

    export class FpsRenderer extends RendererBase {
        private ctx = new FpsContext();

        update(time: number) {
            this.ctx.update(time);
        }

        render(time: number) {
            this.canvas.fillText(`FPS: ${this.ctx.fps.toFixed(0)}`, 0, 0, "blue");
        }
    }

    let scene = new Scene(<HTMLCanvasElement>document.querySelector("canvas"));
    scene.addRenderer(new FpsRenderer(scene.getCanvas()));
}