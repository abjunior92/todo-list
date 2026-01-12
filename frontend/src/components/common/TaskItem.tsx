import { Checkbox } from "../icons/Checkbox";

interface TaskItemProps {
  id: number;
  text: string;
  completed?: boolean;
  onToggle?: (id: number) => void;
}

export function TaskItem({
  id,
  text,
  completed = false,
  onToggle,
}: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => onToggle?.(id)}
        className="flex-shrink-0"
        aria-label={completed ? "Segna come non completato" : "Segna come completato"}
      >
        <Checkbox checked={completed} />
      </button>
      <span
        className={`flex-1 text-sm ${
          completed ? "line-through text-gray-400" : "text-black"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
