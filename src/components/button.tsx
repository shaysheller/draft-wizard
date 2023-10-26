export const FilledButton = (props: {
  text: string;
  textSize?: string;
  onClick: () => void;
}) => {
  const textSize = props.textSize ? props.textSize : "text-md";

  return (
    <button
      className={`${textSize} h-fit rounded-md border border-violet-500 bg-violet-500 px-4 py-2 font-bold text-white transition duration-150 ease-in hover:border-violet-700 hover:bg-violet-700`}
      onClick={props.onClick}
    >
      {props.text.toUpperCase()}
    </button>
  );
};

export const UnfilledButton = (props: {
  text: string;
  textSize?: string;
  onClick: () => void;
}) => {
  const textSize = props.textSize ? props.textSize : "text-md";

  return (
    <button
      className={`${textSize} h-fit rounded-md border border-violet-500 bg-white px-4 py-2 font-bold text-violet-500 transition duration-150 ease-in hover:border-violet-700 hover:bg-white hover:text-violet-700`}
      onClick={props.onClick}
    >
      {props.text.toUpperCase()}
    </button>
  );
};
