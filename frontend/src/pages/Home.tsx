import { useState, useEffect } from "react";
import { Sidebar } from "../components/common/Sidebar";
import { TaskSection } from "../components/common/TaskSection";
import {
  getTasks,
  createTask,
  updateTask,
  type Task,
  type ApiError,
} from "../lib/api";

type Section = "upcoming" | "today" | "calendar";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("upcoming");
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica tutti i task all'avvio
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks();
      setAllTasks(response.tasks);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || "Errore nel caricamento dei task");
    } finally {
      setLoading(false);
    }
  };

  // Funzioni helper per filtrare i task per data
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getThisWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Domenica
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sabato
    return {
      start: startOfWeek.toISOString().split("T")[0],
      end: endOfWeek.toISOString().split("T")[0],
    };
  };

  const filterTasksByDate = (tasks: Task[], date: string) => {
    return tasks.filter(task => {
      const taskDate = task.scheduledAt.split("T")[0];
      return taskDate === date;
    });
  };

  const filterTasksByWeek = (tasks: Task[]) => {
    const { start, end } = getThisWeekDates();
    return tasks.filter(task => {
      const taskDate = task.scheduledAt.split("T")[0];
      return taskDate >= start && taskDate <= end;
    });
  };

  const todayTasks = filterTasksByDate(allTasks, getTodayDate());
  const tomorrowTasks = filterTasksByDate(allTasks, getTomorrowDate());
  const thisWeekTasks = filterTasksByWeek(allTasks);

  const handleTaskToggle = async (taskId: number) => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await updateTask(taskId, {
        completed: !task.completed,
      });
      setAllTasks(prev =>
        prev.map(t => (t.id === taskId ? updatedTask.task : t))
      );
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || "Errore nell'aggiornamento del task");
    }
  };

  const handleAddTask = async (
    text: string,
    scheduledDate: string // YYYY-MM-DD
  ) => {
    try {
      // Crea un datetime per la data specificata (mezzanotte)
      const scheduledAt = `${scheduledDate}T00:00:00`;
      const newTask = await createTask({
        description: text,
        scheduledAt,
        completed: false,
      });
      setAllTasks(prev => [...prev, newTask.task]);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || "Errore nella creazione del task");
    }
  };

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">Caricamento...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadTasks}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Riprova
          </button>
        </div>
      );
    }

    const totalUpcomingTasks =
      todayTasks.length + tomorrowTasks.length + thisWeekTasks.length;

    if (activeSection === "upcoming") {
      return (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black inline-block mr-2">
              Upcoming
            </h1>
            <span className="inline-block bg-gray-200 text-black text-xs font-medium px-2 py-1 rounded-full">
              {totalUpcomingTasks}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today Section - Larger */}
            <div className="lg:col-span-2">
              <TaskSection
                title="Today"
                tasks={todayTasks}
                onTaskToggle={handleTaskToggle}
                onAddTask={text => handleAddTask(text, getTodayDate())}
              />
            </div>

            {/* Tomorrow Section */}
            <TaskSection
              title="Tomorrow"
              tasks={tomorrowTasks}
              onTaskToggle={handleTaskToggle}
              onAddTask={text => handleAddTask(text, getTomorrowDate())}
            />

            {/* This Week Section */}
            <TaskSection
              title="This Week"
              tasks={thisWeekTasks}
              onTaskToggle={handleTaskToggle}
              onAddTask={text => handleAddTask(text, getTodayDate())}
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
            onTaskToggle={handleTaskToggle}
            onAddTask={text => handleAddTask(text, getTodayDate())}
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
