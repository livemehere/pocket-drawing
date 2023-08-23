interface Props {
  canvas: HTMLCanvasElement;
}

export class PaintingApp {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width!: number;
  height!: number;
  dpr!: number;
  mouse: {
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    pressed: boolean;
  };
  size: number;
  color: string;
  blur: number;

  constructor({ canvas }: Props) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;

    this.mouse = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      pressed: false,
    };
    this.size = 5;
    this.color = "#fff";
    this.blur = 0;

    this.resize();
    this.animate();
    window.addEventListener("resize", this.resize.bind(this));
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = window.devicePixelRatio > 1 ? 2 : 1;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
  }

  draw() {
    if (!this.mouse.pressed) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.filter = `blur(${this.blur}px)`;
    this.ctx.lineWidth = this.size;
    this.ctx.globalCompositeOperation = "source-over";

    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.moveTo(this.mouse.lastX, this.mouse.lastY);
    this.ctx.lineTo(this.mouse.x, this.mouse.y);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();

    this.mouse.lastX = this.mouse.x;
    this.mouse.lastY = this.mouse.y;
  }

  mouseDown(e: MouseEvent) {
    this.mouse.pressed = true;
    this._setLastMousePos(e);
  }
  mouseMove(e: MouseEvent) {
    this._setMousePos(e);
  }
  mouseUp() {
    this.mouse.pressed = false;
  }

  _setLastMousePos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.lastX = e.clientX - rect.left;
    this.mouse.lastY = e.clientY - rect.top;
  }

  _setMousePos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.draw();
  }
}
