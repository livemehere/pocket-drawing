import { ChangeEventHandler, FC, useEffect, useState } from "react";

interface Props {
  min: number;
  max: number;
  initialValue?: number;
  onChange: (size: number) => void;
  direction?: "horizontal" | "vertical";
  step?: number;
}

export const InputRange: FC<Props> = ({
  min = 0,
  max = 10,
  onChange,
  step,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue ?? min);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = Number(e.target.value);
    setValue(value);
    onChange(value);
  };

  useEffect(() => {
    onChange(initialValue ?? min);
  }, [onChange, initialValue, min]);

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
