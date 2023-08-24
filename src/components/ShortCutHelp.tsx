import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  content: string;
  show?: boolean;
  direction?: "top" | "bottom" | "left" | "right";
}

export const ShortCutHelp: FC<Props> = ({
  children,
  content,
  direction = "top",
  show,
}) => {
  if (!show) return <>{children}</>;

  return (
    <div className={"relative h-[24px]"}>
      {children}
      <div
        className={
          "absolute bg-black/80 text-white px-2 py-1 rounded shadow-xl text-xs whitespace-nowrap"
        }
        style={{
          top: direction === "bottom" ? "100%" : "unset",
          bottom: direction === "top" ? "100%" : "unset",
          left: direction === "right" ? "100%" : "unset",
          right: direction === "left" ? "100%" : "unset",
          transform: `translateY(${
            direction === "right" || direction === "left" ? "-100%" : "0"
          })`,
        }}
      >
        {content}
      </div>
    </div>
  );
};
