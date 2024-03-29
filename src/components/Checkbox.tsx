import { FC } from "react";
import CheckIcon from "../assets/icons/check.png";

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}
export const Checkbox: FC<Props> = ({ value, onChange, className }) => {
  return (
    <div
      className={`select-none flex justify-center items-center w-[24px] h-[24px] bg-white/10 rounded cursor-pointer ${className}`}
      onClick={() => onChange(!value)}
    >
      {value && <img src={CheckIcon} alt="check" className={"w-4"} />}
    </div>
  );
};
