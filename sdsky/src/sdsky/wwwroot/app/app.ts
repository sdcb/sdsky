namespace sdsky {
    export class Vector2 {
        constructor(
            public x: number,
            public y: number) {
        }
    }

    export class StarTrack {
        items = Array<Vector2>();

        add(x: number, y: number) {
            let p = new Vector2(x, y);
            if (this.items.length < this.maxPoints) {
                this.items.push(p);
            } else {
                this.items.shift();
                this.items.push(p);
            }
        }

        constructor(private maxPoints = 1000) {
        }
    }

    export class Star {
        r: number;
        track = new StarTrack();

        constructor(
            public m: number,
            public p: Vector2,
            public v: Vector2) {
            this.r = Math.log(this.m);
        }
    }

    const G = 100;
    export class StarSystem {
        stars = Array<Star>();

        update() {
            for (let i = 0; i < this.times; ++i) {
                this.updateInternal();
            }
            for (let star of this.stars) {
                star.track.add(star.p.x, star.p.y);
            }
        }

        updateInternal() {
            let t = this.updateInterval;

            for (let s1 of this.stars) {
                // star velocity
                // F = G * m1 * m2 / r^2
                // F has a direction: 
                let Fdx = 0;
                let Fdy = 0;

                let Gm1 = G;     // G*s1.m
                let ttm = t * t; // t*t/s1.m

                for (let s2 of this.stars) {
                    if (s1 === s2) continue;

                    let rx = s2.p.x - s1.p.x;
                    let ry = s2.p.y - s1.p.y;
                    let rr = rx * rx + ry * ry;
                    let r = Math.sqrt(rr);

                    let f = Gm1 * s2.m / rr;
                    let fdx = f * rx / r;
                    let fdy = f * ry / r;

                    Fdx += fdx;
                    Fdy += fdy;
                }

                // Ft = ma	-> a = Ft/m
                // v  = at	-> v = Ftt/m
                let dvx = Fdx * ttm;
                let dvy = Fdy * ttm;
                s1.v.x += dvx;
                s1.v.y += dvy;
            }

            for (let star of this.stars) {
                star.p.x += star.v.x * t;
                star.p.y += star.v.y * t;
            }
        }

        clear() {
            this.stars = [];
        }

        add(m: number, px: number, py: number, vx: number, vy: number) {
            this.stars.push(new Star(m, new Vector2(px, py), new Vector2(vx, vy)));
        }

        constructor(
            private updateInterval: number,
            public times = 1) {
        }
    }

    export class StarRenderer extends RendererBase {
        ss = new StarSystem(0.03, 20);
        starBrush = this.canvas.createRadialGradient(
            { offset: 0, color: "white" },
            { offset: 1, color: "black" });

        update(time: number) {
            this.ss.update();
        }

        render(time: number) {
            this.drawLines();
            this.drawStars();
        }

        drawLines() {
            let centerTransform = float3x2.translation(this.canvas.width() / 2, this.canvas.height() / 2);

            this.canvas.setTransform(centerTransform);
            for (let star of this.ss.stars) {
                let first = star.track.items[0];

                this.canvas.beginPath();
                this.canvas.moveTo(first.x, first.y);
                for (let p of star.track.items) {
                    if (p !== first) {
                        this.canvas.lineTo(p.x, p.y);
                    }
                }
                this.canvas.stroke("gray", 0.5);
            }
        }

        drawStars() {
            let centerTransform = float3x2.translation(this.canvas.width() / 2, this.canvas.height() / 2);

            for (let star of this.ss.stars) {
                this.canvas.setTransform(float3x2
                    .scale(star.r, star.r)
                    .multiply(centerTransform.translation(star.p.x, star.p.y)));
                this.canvas.fillCircle(0, 0, 1, this.starBrush);
            }
        }

        initThree() {
            this.ss.clear();
            this.ss.add(5000, 0, -200,
                6, +0);
            this.ss.add(5000, -173.20508075688772935274463415059, 100,
                -3, -5.1961524227066318805823390245176);
            this.ss.add(5000, 173.20508075688772935274463415059, 100,
                -3, 5.1961524227066318805823390245176);
        }

        initTwins() {
            // 双子星
            this.ss.clear();
            this.ss.add(2000, 0, -200, 3, 0);
            this.ss.add(2000, 0, 200, -3, 0);
            //this.ss.add(10, 0, -300, -3, 0);
            //this.ss.add(10, 0, -100, -2, 0);
            //this.ss.add(10, 0, 300, 3, 0);
            //this.ss.add(10, 0, 100, 2, 0);
        }

        initTwins2() {
            this.ss.clear();
            this.ss.add(1000, 0, -250, -3, 0);
            this.ss.add(1000, 0, -200, 7, 0);

            this.ss.add(1000, 0, 250, 3, 0);
            this.ss.add(1000, 0, 200, -7, 0);
        }

        initFours() {
            // 四星系统
            this.ss.clear();
            this.ss.add(1000, 0, -250, 2.5, 0);
            this.ss.add(1000, 0, 250, -2.5, 0);
            this.ss.add(1000, -250, 0, 0, -2.5);
            this.ss.add(1000, 250, 0, 0, 2.5);
            this.ss.add(10, 0, -300, -4, 0);
            this.ss.add(10, 300, 0, 0, -4);
            this.ss.add(10, 0, 300, 4, 0);
            this.ss.add(10, -300, 0, 0, 4);
        }

        constructor(canvas: CanvasManager) {
            super(canvas);
            this.initTwins2();
            let keyMap = <{ [key: string]: () => void }>{
                "1": () => this.initTwins2(), 
                "2": () => this.initTwins(), 
                "3": () => this.initThree(), 
                "4": () => this.initFours(), 
                "+": () => this.ss.times += 5, 
                "-": () => this.ss.times -= 5
            };
            addEventListener("keydown", ev => {
                let work = keyMap[ev.key];
                if (work) {
                    work();
                }
            });
        }
    }

    let scene = new Scene(<HTMLCanvasElement>document.querySelector("canvas"));
    scene.addRenderer(new FpsRenderer(scene.getCanvas()));
    scene.addRenderer(new AlignToWindowUtil(scene.getCanvas()));
    //scene.addRenderer(new ClockRenderer(scene.getCanvas()));
    scene.addRenderer(new StarRenderer(scene.getCanvas()));
}