import { FC, useEffect, useState } from "react";

interface Props {
  onChange: (color: string) => void;
}

const COLORS = [
  "#000",
  "#fff",
  "red",
  "#FF6F91",
  "#FF9671",
  "#FFC75F",
  "#2C73D2",
];

export const Palette: FC<Props> = ({ onChange }) => {
  const [selected, setSelected] = useState(COLORS[0]);

  const onClick = (color: string) => {
    setSelected(color);
    onChange(color);
  };

  useEffect(() => {
    onChange(COLORS[0]);
  }, [onChange]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      //     1,2,3,4,5,6,7,8,9 set COLORS[index] to selected
      if (e.key.match(/[1-9]/)) {
        onClick(COLORS[Number(e.key) - 1]);
      }
    }
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div className={"fixed bottom-10 left-0 right-0 flex justify-center"}>
      <div
        className={"inline-flex gap-2 bg-white/10 py-2 px-3 rounded shadow-xl"}
      >
        {COLORS.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 cursor-pointer rounded hover:-translate-y-1 hover:scale-110 transition`}
            style={{
              backgroundColor: color,
              outline: color === selected ? "2px solid #FFD700" : "none",
            }}
            onClick={() => onClick(color)}
          />
        ))}
      </div>
    </div>
  );
};
