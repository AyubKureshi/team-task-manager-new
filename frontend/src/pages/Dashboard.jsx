import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ListTodo,
  LogOut,
  Loader,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get("/tasks");
        setTasks(response.data);
      } catch (err) {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Calculate Dashboard Statistics
  const today = new Date();
  const stats = tasks.reduce(
    (acc, task) => {
      acc.total++;
      if (task.status === "Completed") acc.completed++;
      if (task.status === "In Progress") acc.inProgress++;
      if (task.status === "Pending") acc.pending++;

      // Check if overdue
      const dueDate = new Date(task.dueDate);
      if (dueDate < today && task.status !== "Completed") {
        acc.overdue++;
      }
      return acc;
    },
    { total: 0, completed: 0, inProgress: 0, pending: 0, overdue: 0 },
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name} ({user?.role})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-sm text-red-600 transition bg-red-100 rounded-md hover:bg-red-200 font-medium"
        >
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      </header>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          count={stats.total}
          icon={<ListTodo size={24} className="text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Pending"
          count={stats.pending}
          icon={<Clock size={24} className="text-yellow-600" />}
          color="bg-yellow-100"
        />
        <StatCard
          title="Completed"
          count={stats.completed}
          icon={<CheckCircle size={24} className="text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Overdue"
          count={stats.overdue}
          icon={<AlertCircle size={24} className="text-red-600" />}
          color="bg-red-100"
        />
      </div>

      {/* Task List Preview */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Recent Tasks
        </h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">
            No tasks found. Create a project and assign tasks to see them here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-3 font-medium text-gray-600">Task Title</th>
                  <th className="p-3 font-medium text-gray-600">Project</th>
                  <th className="p-3 font-medium text-gray-600">Due Date</th>
                  <th className="p-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-800">{task.title}</td>
                    <td className="p-3 text-gray-600">
                      {task.project?.name || "N/A"}
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Sub-component for Stats Cards
const StatCard = ({ title, count, icon, color }) => (
  <div className="flex items-center p-6 bg-white rounded-lg shadow-sm">
    <div className={`p-4 rounded-full ${color} mr-4`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
    </div>
  </div>
);

export default Dashboard;
