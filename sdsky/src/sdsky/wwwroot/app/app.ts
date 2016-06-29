namespace sdsky {
    var canvas = new CanvasManager(<HTMLCanvasElement>document.querySelector("canvas"));
    let loop = new TimedGameLoop();

    canvas.textBaseLine = "top";
    canvas.font = "14pt Consolas";

    let brush = canvas.createRadialGradient();
    brush.addColorStop(0, "white");
    brush.addColorStop(1, "black");

    var fps = new FpsContext();

    loop.onRender.connect(() => {
        canvas.clear();

        fps.update(loop.totalRenderTime);

        canvas.fillText(`FPS: ${fps.fps.toFixed(0)}`, 0, 0, "blue");

        canvas.transform(float3x2.scale(50, 50).translation(100, 100));
        canvas.fillCircle(0, 0, 1, brush);
    });

    canvas.resizeTo(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", ev => {
        canvas.resizeTo(window.innerWidth, window.innerHeight);
    });
}