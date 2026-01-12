import { Plus } from "../icons/Plus";
import { TaskItem } from "./TaskItem";
import { useState } from "react";

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onTaskToggle?: (taskId: number) => void;
  onAddTask?: (text: string) => void;
  className?: string;
}

export function TaskSection({
  title,
  tasks,
  onTaskToggle,
  onAddTask,
  className = "",
}: TaskSectionProps) {
  const [newTaskText, setNewTaskText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() && onAddTask) {
      onAddTask(newTaskText.trim());
      setNewTaskText("");
    }
  };

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-bold text-black mb-4">{title}</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="flex-shrink-0 text-black hover:opacity-70"
            aria-label="Aggiungi task"
          >
            <Plus />
          </button>
          <input
            type="text"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            placeholder="Add new task"
            className="flex-1 text-sm border-none outline-none bg-transparent text-black placeholder-gray-400"
          />
        </div>
      </form>

      <div>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            id={task.id}
            text={task.description}
            completed={task.completed}
            onToggle={onTaskToggle}
          />
        ))}
      </div>
    </div>
  );
}
