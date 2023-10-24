import { type RefObject } from "react";

export const Button = (props: {
  filled: boolean;
  text: string;
  textSize?: string;
  onClick: () => void;
}) => {
  let textColor;
  let hoverTextColor;
  let background;
  const hoverBorder = "hover:border-violet-700";
  let hoverText;
  let hoverBackground;
  const border = "border-violet-500";
  const textSize = props.textSize ? props.textSize : "text-md";

  if (props.filled) {
    // if the background is filled
    textColor = "text-white";
    background = "bg-violet-500";
    hoverText = "text-violet-500";
    hoverBackground = "hover:bg-violet-700";
    hoverTextColor = "hover:text-white";
  } else {
    // if the background is white and the border is outlined in color
    textColor = "text-violet-500";
    background = "bg-white";
    hoverText = "text-violet-700";
    hoverBackground = "hover:bg-white";
    hoverTextColor = "hover:text-violet-700";
  }

  return (
    <button
      className={`${textSize} transition duration-150 ease-in ${border} h-fit rounded-md border ${textColor} ${background} ${hoverText} ${hoverBackground} ${hoverTextColor} ${hoverBorder} px-4 py-2 font-bold`}
      onClick={props.onClick}
    >
      {props.text.toUpperCase()}
    </button>
  );
};

{
  /* <Menu.Button className="inline-flex  rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"></Menu.Button> */
}
