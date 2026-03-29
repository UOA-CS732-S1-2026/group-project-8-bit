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
  return (
    <div
      className={` bg-[url('/panels/interact-panel.png')] bg-center bg-no-repeat bg-size-[100%_100%] p-3 ${className}`}
    >
      <button
        className={`flex flex-col text-center px-1 text-[10px] font-semibold text-stone-200 sm:text-xs`}
        onClick={onPress}
      >
        <div>{title}</div>
        <div className="h-0.5 bg-amber-100/50"></div>
        <div className="w-full break-word whitespace-normal">{content}</div>
      </button>
    </div>
  );
}
