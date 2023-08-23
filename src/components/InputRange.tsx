import { ChangeEventHandler, FC } from "react";

interface Props {
  min: number;
  max: number;
  onChange: (size: number) => void;
  direction?: "horizontal" | "vertical";
  step?: number;
  value: number;
}

export const InputRange: FC<Props> = ({
  min = 0,
  max = 10,
  onChange,
  step,
  value,
}) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = Number(e.target.value);
    onChange(value);
  };

  return (
    <div
      className={
        "inline-flex p-1.5 bg-[#121212] items-center justify-center rounded"
      }
    >
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className={""}
        step={step ?? 1}
      />
    </div>
  );
};
