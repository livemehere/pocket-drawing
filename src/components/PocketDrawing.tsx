import { useEffect, useRef, useState } from "react";
import {
  HistoryChangeDetail,
  Mode,
  PaintingApp,
} from "../module/PaintingApp.ts";
import { Palette } from "./Palette.tsx";
import { BrushControls } from "./BrushControls.tsx";
import { SaveIcon } from "../graphic/SaveIcon.tsx";
import { ShortCutHelp } from "./ShortCutHelp.tsx";
import PenIcon from "../assets/icons/pen.png";
import RectangleIcon from "../assets/icons/rectangle.png";
import CircleIcon from "../assets/icons/circle.png";
import LineIcon from "../assets/icons/line.png";
import EraserIcon from "../assets/icons/eraser.png";
import RefreshIcon from "../assets/icons/refresh.png";
import PencilIcon from "../assets/icons/pencil.png";
import UndoIcon from "../assets/icons/undo.png";

const modeList: { mode: Mode; iconPath: string; help: string }[] = [
  {
    mode: "brush",
    iconPath: PenIcon,
    help: "Q",
  },
  {
    mode: "rect",
    iconPath: RectangleIcon,
    help: "W",
  },
  {
    mode: "circle",
    iconPath: CircleIcon,
    help: "E",
  },
  {
    mode: "line",
    iconPath: LineIcon,
    help: "R",
  },
  {
    mode: "eraser",
    iconPath: EraserIcon,
    help: "T",
  },
];

const MIN_BRUSH_SIZE = 5;
const MAX_BRUSH_SIZE = 200;

export const PocketDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintAppRef = useRef<PaintingApp>();
  const [mode, setMode] = useState<Mode>("brush");
  const [scrollRevert, setScrollRevert] = useState(true);
  const [brushSize, setBrushSize] = useState(MIN_BRUSH_SIZE);
  const [blurSize, setBlurSize] = useState(0);
  const [color, setColor] = useState("#fff");

  const [showHelp, setShowHelp] = useState(false);
  const [pencilOnly, setPencilOnly] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

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
      if (key === "f1") setShowHelp((prev) => !prev);
      if (key === "z" && e.metaKey) {
        handleUndo();
      }
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
    paintAppRef.current.pencilOnly = pencilOnly;
  }, [brushSize, blurSize, mode, color, pencilOnly]);

  useEffect(() => {
    const paintApp = paintAppRef.current;
    if (!paintApp) return;
    function handler(e: CustomEvent<HistoryChangeDetail>) {
      setHasHistory(e.detail.length > 0);
    }
    paintAppRef.current?.addHistoryEventListener(handler);
    return () => {
      paintAppRef.current?.removeHistoryEventListener(handler);
    };
  }, []);

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

  const handleUndo = () => {
    if (!paintAppRef.current) return;
    paintAppRef.current.undo();
  };

  return (
    <div>
      <h1
        className={
          "text-2xl text-white font-bold fixed top-[10px] right-[100px]"
        }
      >
        Pocket Drawing
      </h1>
      <div
        onClick={() => setShowHelp((prev) => !prev)}
        className={
          "absolute bg-black/80 text-white px-2 py-1 rounded shadow-xl text-xs top-4 right-4 cursor-pointer"
        }
      >
        F1 Help
      </div>
      <div
        className={
          "fixed top-5 left-[20px] bg-white px-2 py-3 rounded-xl flex flex-col gap-2 shadow-xl shadow-black/50"
        }
      >
        {modeList.map(({ mode: m, iconPath, help }) => (
          <ShortCutHelp
            content={help}
            direction={"right"}
            key={m}
            show={showHelp}
          >
            <button
              style={{
                backgroundColor: m === mode ? "#FFD700" : "transparent",
              }}
              className={`hover:opacity-50 bg-black/5 p-1 rounded hover:bg-black/10 ${
                m === mode ? "animate-bounce" : ""
              }`}
              onClick={() => {
                setMode(m);
                onChangeMode(m);
              }}
            >
              <img src={iconPath} alt={mode} className={"w-4"} />
            </button>
          </ShortCutHelp>
        ))}
        <button
          onClick={() => paintAppRef.current?.save()}
          className={"hover:opacity-50"}
        >
          <SaveIcon />
        </button>
        <button
          onClick={() => paintAppRef.current?.refresh()}
          className={"w-[22px] hover:opacity-50"}
        >
          <img src={RefreshIcon} alt="refresh" />
        </button>
        <button
          onClick={handleUndo}
          className={"w-[22px] hover:bg-amber-50"}
          disabled={!hasHistory}
          style={{
            opacity: hasHistory ? 1 : 0.3,
          }}
        >
          <img src={UndoIcon} alt="refresh" />
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
        showHelp={showHelp}
      />
      <div
        className={
          "hidden sm:block sm:fixed top-[650px] left-[20px] bg-white p-2 rounded-xl flex flex-col gap-2 shadow-xl shadow-black/50"
        }
      >
        <ShortCutHelp
          content={"터치팬만 인식"}
          direction={"right"}
          show={showHelp}
        >
          <button
            onClick={() => setPencilOnly((prev) => !prev)}
            className={"w-[22px] h-[22px] rounded p-1"}
            style={{
              backgroundColor: pencilOnly ? "#DFCCFB" : "transparent",
            }}
          >
            <img src={PencilIcon} alt="pencil" />
          </button>
        </ShortCutHelp>
      </div>
      <canvas ref={canvasRef}></canvas>
      <Palette onChange={onChangeColor} color={color} showHelp={showHelp} />
    </div>
  );
};
