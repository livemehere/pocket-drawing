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
}) => {
  return (
    <div
      className={
        "-rotate-90 flex gap-1 fixed left-[40px] top-[65%] shadow-md origin-left justify-center items-center shadow-black/50 bg-[#121212]"
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
  );
};
