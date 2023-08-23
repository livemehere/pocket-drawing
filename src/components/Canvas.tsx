import { useEffect, useRef, useState } from "react";
import { Mode, PaintingApp } from "../module/PaintingApp.ts";
import { Palette } from "./Palette.tsx";
import { BrushControls } from "./BrushControls.tsx";
import { SaveIcon } from "../graphic/SaveIcon.tsx";

const modeList: { mode: Mode; iconPath: string }[] = [
  {
    mode: "brush",
    iconPath: "/icons/pen.png",
  },
  {
    mode: "rect",
    iconPath: "/icons/rectangle.png",
  },
  {
    mode: "circle",
    iconPath: "/icons/circle.png",
  },
  {
    mode: "line",
    iconPath: "/icons/line.png",
  },
  {
    mode: "eraser",
    iconPath: "/icons/eraser.png",
  },
];

const MIN_BRUSH_SIZE = 5;
const MAX_BRUSH_SIZE = 200;

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintAppRef = useRef<PaintingApp>();
  const [mode, setMode] = useState<Mode>("brush");
  const [scrollRevert, setScrollRevert] = useState(false);
  const [brushSize, setBrushSize] = useState(MIN_BRUSH_SIZE);
  const [blurSize, setBlurSize] = useState(0);
  const [color, setColor] = useState("#fff");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintAppRef.current = new PaintingApp({ canvas });
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", (e) => {
      const delta = scrollRevert ? -e.deltaY : e.deltaY;
      if (e.altKey) {
        if (!paintAppRef.current) return;
        let nextSize = paintAppRef.current.blur + delta / 100;
        if (nextSize < 0) nextSize = 0;
        if (nextSize > 50) nextSize = 50;
        onChangeBlur(nextSize);
      } else {
        if (!paintAppRef.current) return;
        let nextSize = paintAppRef.current.size + delta / 100;
        if (nextSize < 1) nextSize = 1;
        if (nextSize > MAX_BRUSH_SIZE) nextSize = MAX_BRUSH_SIZE;
        onChangeSize(nextSize);
      }
    });

    return () => {
      window.removeEventListener("wheel", () => {});
    };
  }, [scrollRevert]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (key === "q") setMode("brush");
      if (key === "w") setMode("rect");
      if (key === "e") setMode("circle");
      if (key === "r") setMode("line");
      if (key === "t") setMode("eraser");
    }
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  useEffect(() => {
    if (!paintAppRef.current) return;
    paintAppRef.current.size = brushSize;
    paintAppRef.current.blur = blurSize;
    paintAppRef.current.mode = mode;
    paintAppRef.current.color = color;
  }, [brushSize, blurSize, mode, color]);

  const onChangeColor = (color: string) => {
    if (!paintAppRef.current) return;
    setColor(color);
  };

  const onChangeMode = (mode: Mode) => {
    if (!paintAppRef.current) return;
    setMode(mode);
  };

  const onChangeSize = (size: number) => {
    if (!paintAppRef.current) return;
    setBrushSize(size);
  };

  const onChangeBlur = (blur: number) => {
    if (!paintAppRef.current) return;
    setBlurSize(blur);
  };

  return (
    <div>
      <div
        className={
          "fixed top-5 left-[20px] bg-white px-2 py-3 rounded-xl flex flex-col gap-2 shadow-xl shadow-black/50"
        }
      >
        {modeList.map(({ mode: m, iconPath }) => (
          <button
            key={m}
            style={{
              backgroundColor: m === mode ? "#FFD700" : "transparent",
            }}
            className={`bg-black/5 p-1 rounded hover:bg-black/10 ${
              m === mode ? "animate-bounce" : ""
            }`}
            onClick={() => {
              setMode(m);
              onChangeMode(m);
            }}
          >
            <img src={iconPath} alt={mode} className={"w-4"} />
          </button>
        ))}
        <button onClick={() => paintAppRef.current?.save()}>
          <SaveIcon />
        </button>
      </div>
      <BrushControls
        minBrushSize={MIN_BRUSH_SIZE}
        maxBrushSize={MAX_BRUSH_SIZE}
        blurSize={blurSize}
        onChangeBlur={onChangeBlur}
        brushSize={brushSize}
        onChangeSize={onChangeSize}
        scrollRevert={scrollRevert}
        setScrollRevert={setScrollRevert}
      />
      <canvas ref={canvasRef}></canvas>
      <Palette onChange={onChangeColor} color={color} />
    </div>
  );
};
