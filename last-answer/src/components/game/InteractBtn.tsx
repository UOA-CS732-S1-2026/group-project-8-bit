interface ButtonProps {
  title: string;
  content: string;
  className?: string;
  onPress: () => void;
}
export default function InteractBtn({
  title,
  content,
  className,
  onPress,
}: ButtonProps) {
  const actionBtnClass =
    "w-full min-h-[5.5rem] bg-[length:100%_100%] bg-no-repeat bg-center px-4 py-3 m-[0.1px] flex flex-col justify-center items-center text-center transform transition-transform duration-150 ease-out hover:scale-105 active:scale-95";
  const backgroundImage = "url('/panels/interact-panel.png')";
  return (
    <div className={`${className}`}>
      <button
        className={actionBtnClass}
        style={{ backgroundImage }}
        onClick={onPress}
      >
        <div className="w-full truncate text-2xl text-stone-300">{title}</div>
        <div className="line-clamp-2 h-10 w-full overflow-hidden text-sm leading-5 text-amber-200/80">
          {content}
        </div>
      </button>
    </div>
  );
}
