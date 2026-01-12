import { useState } from "react";
import { Sidebar } from "../components/common/Sidebar";
import { TaskSection } from "../components/common/TaskSection";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type Section = "upcoming" | "today" | "calendar";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("upcoming");

  // Task data - solo frontend, nessuna logica backend
  const [todayTasks, setTodayTasks] = useState<Task[]>([
    { id: "1", text: "Database create for company", completed: false },
    { id: "2", text: "Website templates", completed: false },
    { id: "3", text: "Meet work teem", completed: false },
  ]);

  const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([
    { id: "4", text: "Work teem", completed: false },
    { id: "5", text: "Job interview", completed: false },
  ]);

  const [thisWeekTasks, setThisWeekTasks] = useState<Task[]>([
    { id: "6", text: "Research content ideas", completed: false },
    { id: "7", text: "Consult accountant", completed: false },
    { id: "8", text: "Print business card", completed: false },
  ]);

  const handleTaskToggle = (
    taskId: string,
    setTaskList: React.Dispatch<React.SetStateAction<Task[]>>
  ) => {
    setTaskList(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = (
    text: string,
    setTaskList: React.Dispatch<React.SetStateAction<Task[]>>
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTaskList(prev => [...prev, newTask]);
  };

  const renderMainContent = () => {
    if (activeSection === "upcoming") {
      return (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black inline-block mr-2">
              Upcoming
            </h1>
            <span className="inline-block bg-gray-200 text-black text-xs font-medium px-2 py-1 rounded-full">
              18
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today Section - Larger */}
            <div className="lg:col-span-2">
              <TaskSection
                title="Today"
                tasks={todayTasks}
                onTaskToggle={id => handleTaskToggle(id, setTodayTasks)}
                onAddTask={text => handleAddTask(text, setTodayTasks)}
              />
            </div>

            {/* Tomorrow Section */}
            <TaskSection
              title="Tomorrow"
              tasks={tomorrowTasks}
              onTaskToggle={id => handleTaskToggle(id, setTomorrowTasks)}
              onAddTask={text => handleAddTask(text, setTomorrowTasks)}
            />

            {/* This Week Section */}
            <TaskSection
              title="This Week"
              tasks={thisWeekTasks}
              onTaskToggle={id => handleTaskToggle(id, setThisWeekTasks)}
              onAddTask={text => handleAddTask(text, setThisWeekTasks)}
            />
          </div>
        </>
      );
    }

    if (activeSection === "today") {
      return (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black inline-block mr-2">
              Today
            </h1>
            <span className="inline-block bg-gray-200 text-black text-xs font-medium px-2 py-1 rounded-full">
              {todayTasks.length}
            </span>
          </div>
          <TaskSection
            title="Today"
            tasks={todayTasks}
            onTaskToggle={id => handleTaskToggle(id, setTodayTasks)}
            onAddTask={text => handleAddTask(text, setTodayTasks)}
          />
        </>
      );
    }

    if (activeSection === "calendar") {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">Calendar view - Coming soon</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-3rem)]">
        {/* Sidebar */}
        <aside className="flex-shrink-0">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
