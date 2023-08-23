import { useEffect, useRef, useState } from "react";
import { PaintingApp } from "../module/PaintingApp.ts";
import { Palette } from "./Palette.tsx";
import { InputRange } from "./InputRange.tsx";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paintingApp, setPaintingApp] = useState<PaintingApp>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setPaintingApp(new PaintingApp({ canvas }));
  }, []);

  const onChangeColor = (color: string) => {
    if (!paintingApp) return;
    paintingApp.color = color;
  };

  const onChangeSize = (size: number) => {
    if (!paintingApp) return;
    paintingApp.size = size;
  };

  const onChangeBlur = (blur: number) => {
    if (!paintingApp) return;
    paintingApp.blur = blur;
  };

  return (
    <div>
      <div
        className={
          "-rotate-90 flex gap-1 fixed left-[40px] top-[65%] shadow-xl origin-left"
        }
      >
        <InputRange
          onChange={onChangeBlur}
          min={0}
          max={50}
          step={1}
          initialValue={0}
        />
        <InputRange
          onChange={onChangeSize}
          min={6}
          max={200}
          initialValue={6}
        />
      </div>
      <canvas ref={canvasRef}></canvas>
      <Palette onChange={onChangeColor} />
    </div>
  );
};
