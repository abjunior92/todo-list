import { useState } from "react";
import { useNavigate } from "react-router";
import { logout, ApiError } from "../lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Errore durante il logout:", apiError.message);
      // Anche in caso di errore, reindirizziamo al login
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logout in corso..." : "Logout"}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Benvenuto nella Todo List App</p>
        </div>
      </main>
    </div>
  );
}
