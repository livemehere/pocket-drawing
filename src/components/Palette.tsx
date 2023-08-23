import { FC, useEffect } from "react";
import { ShortCutHelp } from "./ShortCutHelp.tsx";

interface Props {
  onChange: (color: string) => void;
  color: string;
  showHelp?: boolean;
}

const COLORS = [
  "#fff",
  "red",
  "#F9F871",
  "#FF6F91",
  "#845EC2",
  "#FF9671",
  "#FFC75F",
  "#2C73D2",
  "#000",
];

export const Palette: FC<Props> = ({ color, onChange, showHelp }) => {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key.match(/[1-9]/)) {
        onChange(COLORS[Number(e.key) - 1]);
      }
    }
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onChange]);

  return (
    <div className={"fixed bottom-10 left-0 right-0 flex justify-center"}>
      <div
        className={"inline-flex gap-2 bg-black/20 py-2 px-3 rounded shadow-xl"}
      >
        {COLORS.map((c, i) => (
          <ShortCutHelp key={c} content={`${i + 1}`} show={showHelp}>
            <button
              className={`w-6 h-6 cursor-pointer rounded hover:-translate-y-1 hover:scale-110 transition`}
              style={{
                backgroundColor: c,
                outline: c === color ? "2px solid #FFD700" : "none",
              }}
              onClick={() => onChange(c)}
            />
          </ShortCutHelp>
        ))}
      </div>
    </div>
  );
};
