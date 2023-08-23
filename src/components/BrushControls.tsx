import { InputRange } from "./InputRange.tsx";
import { FC } from "react";
import { Checkbox } from "./Checkbox.tsx";

interface Props {
  onChangeSize: (size: number) => void;
  onChangeBlur: (blur: number) => void;
  setScrollRevert: (scrollRevert: boolean) => void;
  brushSize: number;
  blurSize: number;
  scrollRevert: boolean;
  minBrushSize: number;
  maxBrushSize: number;
  showHelp?: boolean;
}

export const BrushControls: FC<Props> = ({
  brushSize,
  blurSize,
  onChangeBlur,
  onChangeSize,
  scrollRevert,
  setScrollRevert,
  minBrushSize,
  maxBrushSize,
  showHelp,
}) => {
  return (
    <>
      <div
        className={
          "-rotate-90 flex gap-1 fixed left-[40px] top-[700px] shadow-md origin-left justify-center items-center shadow-black/50 bg-[#121212]"
        }
      >
        <InputRange
          value={blurSize}
          onChange={onChangeBlur}
          min={0}
          max={50}
          step={1}
        />
        <Checkbox
          value={scrollRevert}
          onChange={setScrollRevert}
          className={"rotate-90"}
        />
        <InputRange
          value={brushSize}
          onChange={onChangeSize}
          min={minBrushSize}
          max={maxBrushSize}
        />
      </div>
      {showHelp && (
        <div className={"fixed top-[450px] left-[80px]"}>
          <div
            className={
              "bg-black/80 text-white px-2 py-1 rounded shadow-xl text-xs mb-7"
            }
          >
            Scroll (Brush size)
          </div>
          <div
            className={
              "bg-black/80 text-white px-2 py-1 rounded shadow-xl text-xs mb-7"
            }
          >
            Scroll reverse
          </div>
          <div
            className={
              "bg-black/80 text-white px-2 py-1 rounded shadow-xl text-xs"
            }
          >
            Alt + Scroll (Blur size)
          </div>
        </div>
      )}
    </>
  );
};
