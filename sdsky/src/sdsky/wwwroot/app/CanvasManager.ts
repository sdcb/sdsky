namespace sdsky {
    type IBrushType = string | CanvasGradient | CanvasPattern;
    type ITextBaseLineType = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";

    export class CanvasManager {
        private ctx: CanvasRenderingContext2D;

        constructor(private canvas: HTMLCanvasElement) {
            this.ctx = canvas.getContext("2d");
        }

        get width() {
            return this.canvas.width;
        }

        get height() {
            return this.canvas.height;
        }

        get font() {
            return this.ctx.font;
        }

        set font(font: string) {
            this.ctx.font = font;
        }

        get textBaseLine() {
            return <ITextBaseLineType>this.ctx.textBaseline;
        }

        set textBaseLine(baseline: ITextBaseLineType) {
            this.ctx.textBaseline = baseline;
        }

        fillRect(x: number, y: number, w: number, h: number, brush: IBrushType) {
            this.ctx.fillStyle = brush;
            this.ctx.fillRect(x, y, w, h);
        }

        strokeRect(x: number, y: number, w: number, h: number, brush: IBrushType, lineWidth?: number) {
            if (lineWidth) this.ctx.lineWidth = lineWidth;
            this.ctx.strokeStyle = brush;
            this.ctx.strokeRect(x, y, w, h);
        }

        fillText(text: string, x: number, y: number, brush: IBrushType, maxWidth?: number): void {
            this.ctx.fillStyle = brush;
            maxWidth && this.ctx.fillText(text, x, y, maxWidth);
            maxWidth || this.ctx.fillText(text, x, y);
        }

        strokeText(text: string, x: number, y: number, brush: IBrushType, maxWidth?: number): void {
            this.ctx.strokeStyle = brush;
            maxWidth && this.ctx.strokeText(text, x, y, maxWidth);
            maxWidth || this.ctx.strokeText(text, x, y);
        }

        line(p1x: number, p1y: number, p2x: number, p2y: number) {
            this.ctx.moveTo(p1x, p1y);
            this.ctx.lineTo(p2x, p2y);
        }

        drawLine(p1x: number, p1y: number, p2x: number, p2y: number, brush?: IBrushType, lineWidth?: number) {
            if (lineWidth) this.ctx.lineWidth = lineWidth;
            if (brush) this.ctx.strokeStyle = brush;
            this.ctx.beginPath();
            this.ctx.moveTo(p1x, p1y);
            this.ctx.lineTo(p2x, p2y);
            this.ctx.stroke();
        }

        fillCircle(x: number, y: number, r: number, brush?: IBrushType) {
            if (brush) this.ctx.fillStyle = brush;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.arc(x, y, r, 0, Math.PI * 2);
            this.ctx.fill();
        }

        circle(x: number, y: number, r: number) {
            this.ctx.moveTo(x, 0);
            this.ctx.arc(x, y, r, 0, Math.PI * 2);
        }

        rotate(angle: number, centerX?: number, centerY?: number) {
            this.ctx.rotate(angle % 360);
            centerX && this.ctx.translate(-centerX, -centerY);
        }

        setIdentity() {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        clear() {
            this.setIdentity();
            this.ctx.clearRect(0, 0, this.width, this.height);
        }

        transform(matrix: float3x2) {
            this.ctx.transform.apply(this.ctx, matrix.get());
        }
    }
}
