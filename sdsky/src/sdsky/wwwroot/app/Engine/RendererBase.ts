namespace sdsky {
    export abstract class RendererBase {
        private _order = 0;
        onSetOrder = new PromiseEvent<number>();

        private renderers = Array<RendererBase>();

        get order() {
            return this._order;
        }
        set order(value: number) {
            this._order = value;
            this.onSetOrder.fire(this.order);
        }

        update(time: number) {
            for (let renderer of this.renderers) {
                renderer.update(time);
            }
        }

        render(time: number) {
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

        constructor(protected canvas: CanvasManager) {
        }
    }
}
