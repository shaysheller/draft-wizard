export const FilledButton = (props: {
  text: string;
  textSize?: string;
  color?: string;
  border?: string;
  onClick?: () => void;
}) => {
  const textSize = props.textSize ? props.textSize : "text-md";
  const backgroundColor = props.color ? props.color : "bg-violet-500";
  const borderColor = props.border ? props.border : "border-violet-500";
  const onClick = props.onClick ? props.onClick : undefined;

  return (
    <button
      className={`${textSize} h-fit rounded-md border hover:cursor-pointer  ${borderColor} ${backgroundColor} px-4 py-2 font-bold text-white transition duration-150 ease-in hover:opacity-90`}
      onClick={onClick}
    >
      {props.text.toUpperCase()}
    </button>
  );
};

export const UnfilledButton = (props: {
  text: string;
  textSize?: string;
  onClick?: () => void;
}) => {
  const onClick = props.onClick ? props.onClick : undefined;
  const textSize = props.textSize ? props.textSize : "text-md";

  return (
    <button
      className={`${textSize} h-fit rounded-md border border-violet-500 bg-white px-4 py-2 font-bold text-violet-500 transition duration-150 ease-in hover:cursor-pointer hover:opacity-90`}
      onClick={onClick}
    >
      {props.text.toUpperCase()}
    </button>
  );
};
