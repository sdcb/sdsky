namespace sdsky {
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
}
