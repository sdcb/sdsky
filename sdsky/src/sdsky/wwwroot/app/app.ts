namespace sdsky {
    let scene = new Scene(<HTMLCanvasElement>document.querySelector("canvas"));
    scene.addRenderer(new FpsRenderer(scene.getCanvas()));
    scene.addRenderer(new AlignToWindowUtil(scene.getCanvas()));
    scene.addRenderer(new ClockRenderer(scene.getCanvas()));
}