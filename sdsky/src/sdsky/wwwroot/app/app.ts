namespace sdsky {
    var canvas = new CanvasManager(<HTMLCanvasElement>document.querySelector("canvas"));
    let gameLoop = new TimedGameLoop();

    canvas.textBaseLine = "top";

    gameLoop.onRender.connect(() => {
        canvas.clear();

        canvas.fillRect(0, 0, canvas.width, canvas.height, "yellow");
        canvas.fillText(gameLoop.totalRenderTime.toFixed(2), 0, 0, "red");

        canvas.transform(float3x2.translation(150, 100));
        canvas.rotate(new Date().getTime() / 1000);
        canvas.drawLine(-30, -30, 30, 30, "red", 10);
    });
}