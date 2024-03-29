interface Props {
  canvas: HTMLCanvasElement;
}

export type Mode = "brush" | "eraser" | "circle" | "rect" | "line";
export type HistoryChangeDetail = ImageData[];

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
  mode: Mode;
  circleTemp: {
    cx: number;
    cy: number;
    r: number;
  } | null;

  rectTemp: {
    x: number;
    y: number;
    w: number;
    h: number;
  } | null;

  lineTemp: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null;

  pencilOnly: boolean;
  snapshots: ImageData[];
  historySnapshots: ImageData[];

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
    this.mode = "brush";
    this.circleTemp = null;
    this.rectTemp = null;
    this.lineTemp = null;
    this.snapshots = [];
    this.historySnapshots = [];
    this.pencilOnly = false;

    this.setSize();
    this.animate();

    window.addEventListener("resize", this.setSize.bind(this));
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    //   touch event
    this.canvas.addEventListener("touchstart", this.mouseDown.bind(this));
    this.canvas.addEventListener("touchmove", this.mouseMove.bind(this));
    this.canvas.addEventListener("touchend", this.mouseUp.bind(this));
  }

  save() {
    const link = document.createElement("a");
    link.download = "image.png";
    const snapshot = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    this.ctx.save();
    this.ctx.globalCompositeOperation = "lighter";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(36, 36, 36)";
    this.ctx.putImageData(snapshot, 0, 0);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    link.href = this.canvas.toDataURL();
    link.click();
    this.ctx.restore();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(snapshot, 0, 0);
  }

  refresh() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._pushHistorySnapshot();
  }

  setSize() {
    this.pushSnapshot();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = window.devicePixelRatio > 1 ? 2 : 1;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
    this.canvas.style.background = "rgb(36, 36, 36)";
    this.popSnapshot();
  }

  hasHistorySnapshot() {
    return this.historySnapshots.length > 1;
  }

  undo() {
    this._popHistorySnapshot();
  }

  addHistoryEventListener(cb: (e: CustomEvent<HistoryChangeDetail>) => void) {
    this.canvas.addEventListener("historychange", cb as EventListener);
  }

  removeHistoryEventListener(
    cb: (e: CustomEvent<HistoryChangeDetail>) => void,
  ) {
    this.canvas.removeEventListener("historychange", cb as EventListener);
  }

  _emitHistoryChangeEvent() {
    this.canvas.dispatchEvent(
      new CustomEvent<HistoryChangeDetail>("historychange", {
        detail: this.historySnapshots,
      }),
    );
  }

  _pushHistorySnapshot() {
    this.historySnapshots.push(
      this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
    );
    this._emitHistoryChangeEvent();
  }

  _popHistorySnapshot(remove: boolean = true) {
    const snapshot = this.historySnapshots[this.historySnapshots.length - 2];
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!snapshot) return;
    this.ctx.putImageData(snapshot, 0, 0);
    if (remove) {
      this.historySnapshots.pop();
    }
    this._emitHistoryChangeEvent();
  }

  pushSnapshot() {
    this.snapshots.push(
      this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
    );
  }

  popSnapshot(remove: boolean = true) {
    if (this.snapshots.length === 0) return;
    const snapshot = this.snapshots[this.snapshots.length - 1];
    this.ctx.putImageData(snapshot, 0, 0);
    if (remove) {
      this.snapshots.pop();
    }
  }

  mouseDown(e: MouseEvent | TouchEvent) {
    this.mouse.pressed = true;
    this._setLastMousePos(e);
    this._setMousePos(e);
  }
  mouseMove(e: MouseEvent | TouchEvent) {
    this._setMousePos(e);
  }
  mouseUp() {
    this.mouse.pressed = false;
    this._pushHistorySnapshot();
  }

  _setLastMousePos(e: MouseEvent | TouchEvent) {
    const rect = this.canvas.getBoundingClientRect();
    if (e instanceof TouchEvent) {
      if (this.pencilOnly && e.touches[0].touchType !== "stylus") return;
      this.mouse.lastX = e.touches[0].clientX - rect.left;
      this.mouse.lastY = e.touches[0].clientY - rect.top;
    } else {
      this.mouse.lastX = e.clientX - rect.left;
      this.mouse.lastY = e.clientY - rect.top;
    }
  }

  _setMousePos(e: MouseEvent | TouchEvent) {
    const rect = this.canvas.getBoundingClientRect();
    if (e instanceof TouchEvent) {
      if (this.pencilOnly && e.touches[0].touchType !== "stylus") return;
      this.mouse.x = e.touches[0].clientX - rect.left;
      this.mouse.y = e.touches[0].clientY - rect.top;
    } else {
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    switch (this.mode) {
      case "brush":
        this.drawBrush();
        break;
      case "eraser":
        this.drawErase();
        break;
      case "circle":
        this.drawCircle();
        break;
      case "rect":
        this.drawRect();
        break;
      case "line":
        this.drawLine();

        break;
      default:
        break;
    }
  }

  setOption() {
    this.ctx.lineWidth = this.size;
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = this.blur;
  }

  drawBrush() {
    if (!this.mouse.pressed) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.setOption();
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.moveTo(this.mouse.lastX, this.mouse.lastY);
    this.ctx.lineTo(this.mouse.x, this.mouse.y);
    this.ctx.stroke();
    this.ctx.restore();
    this.mouse.lastX = this.mouse.x;
    this.mouse.lastY = this.mouse.y;
  }

  drawErase() {
    if (!this.mouse.pressed) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.setOption();
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.arc(this.mouse.x, this.mouse.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  drawCircle() {
    if (this.mouse.pressed && !this.circleTemp) {
      this.pushSnapshot();
      this.circleTemp = {
        cx: this.mouse.x,
        cy: this.mouse.y,
        r: Math.sqrt(
          Math.pow(this.mouse.x - this.mouse.lastX, 2) +
            Math.pow(this.mouse.y - this.mouse.lastY, 2),
        ),
      };
    }

    if (this.mouse.pressed && this.circleTemp) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.popSnapshot(false);
      this.ctx.save();
      this.ctx.beginPath();
      this.setOption();
      this.circleTemp.r = Math.sqrt(
        Math.pow(this.mouse.x - this.circleTemp.cx, 2) +
          Math.pow(this.mouse.y - this.circleTemp.cy, 2),
      );
      this.ctx.arc(
        this.circleTemp.cx,
        this.circleTemp.cy,
        this.circleTemp.r,
        0,
        Math.PI * 2,
      );
      this.ctx.stroke();
      this.ctx.restore();
    }

    if (!this.mouse.pressed && this.circleTemp) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.popSnapshot();

      this.ctx.save();
      this.ctx.beginPath();
      this.setOption();
      this.ctx.arc(
        this.circleTemp.cx,
        this.circleTemp.cy,
        this.circleTemp.r,
        0,
        Math.PI * 2,
      );
      this.ctx.stroke();
      this.ctx.restore();
      this.circleTemp = null;
    }
  }

  drawRect() {
    if (this.mouse.pressed && !this.rectTemp) {
      this.pushSnapshot();
      this.rectTemp = {
        x: this.mouse.x,
        y: this.mouse.y,
        w: this.mouse.x - this.mouse.lastX,
        h: this.mouse.y - this.mouse.lastY,
      };
    }

    if (this.mouse.pressed && this.rectTemp) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.popSnapshot(false);
      this.ctx.save();
      this.ctx.beginPath();
      this.setOption();
      this.rectTemp.w = this.mouse.x - this.rectTemp.x;
      this.rectTemp.h = this.mouse.y - this.rectTemp.y;
      this.ctx.rect(
        this.rectTemp.x,
        this.rectTemp.y,
        this.rectTemp.w,
        this.rectTemp.h,
      );
      this.ctx.stroke();
      this.ctx.restore();
    }

    if (!this.mouse.pressed && this.rectTemp) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.popSnapshot();

      this.ctx.save();
      this.ctx.beginPath();
      this.setOption();
      this.ctx.rect(
        this.rectTemp.x,
        this.rectTemp.y,
        this.rectTemp.w,
        this.rectTemp.h,
      );
      this.ctx.stroke();
      this.ctx.restore();
      this.rectTemp = null;
    }
  }

  drawLine() {
    if (this.mouse.pressed && !this.lineTemp) {
      this.pushSnapshot();
      this.lineTemp = {
        x1: this.mouse.x,
        y1: this.mouse.y,
        x2: this.mouse.x,
        y2: this.mouse.y,
      };
    }

    if (this.mouse.pressed && this.lineTemp) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.popSnapshot(false);
      this.ctx.save();
      this.ctx.beginPath();
      this.setOption();
      this.lineTemp.x2 = this.mouse.x;
      this.lineTemp.y2 = this.mouse.y;
      this.ctx.moveTo(this.lineTemp.x1, this.lineTemp.y1);
      this.ctx.lineTo(this.lineTemp.x2, this.lineTemp.y2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    if (!this.mouse.pressed && this.lineTemp) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.popSnapshot();

      this.ctx.save();
      this.ctx.beginPath();
      this.setOption();
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.moveTo(this.lineTemp.x1, this.lineTemp.y1);
      this.ctx.lineTo(this.lineTemp.x2, this.lineTemp.y2);
      this.ctx.stroke();
      this.ctx.restore();
      this.lineTemp = null;
    }
  }
}
