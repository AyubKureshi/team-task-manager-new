import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { CheckSquare, Calendar, User, LayoutList } from "lucide-react";

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    project: "",
    assignedTo: "",
  });

  const fetchData = async () => {
    const [taskRes, projRes, userRes] = await Promise.all([
      API.get("/tasks"),
      API.get("/projects"),
      user.role === "Admin" ? API.get("/users") : Promise.resolve({ data: [] }),
    ]);
    setTasks(taskRes.data);
    setProjects(projRes.data);
    if (user.role === "Admin") setUsers(userRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", newTask);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        project: "",
        assignedTo: "",
      });
      fetchData();
    } catch (err) {
      alert("Error creating task");
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Task Management
        </h1>
      </div>

      {user?.role === "Admin" && (
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h2 className="flex items-center mb-5 text-lg font-semibold text-gray-800">
            <CheckSquare className="mr-2 text-green-600" size={20} /> Assign New
            Task
          </h2>
          <form
            onSubmit={handleCreateTask}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Task Title
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Due Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Project
              </label>
              <select
                required
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={newTask.project}
                onChange={(e) =>
                  setNewTask({ ...newTask, project: e.target.value })
                }
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Assign To
              </label>
              <select
                required
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
              >
                <option value="">Select Team Member</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 md:col-span-2 lg:col-span-2">
              <label className="text-xs font-medium text-gray-600">
                Description
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>

            <div className="flex items-end lg:col-span-3">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                Assign Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-medium text-gray-700">Current Tasks</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex flex-col p-6 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold text-gray-900">
                    {task.title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    {task.project?.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  {user.role === "Admin" && (
                    <span className="flex items-center">
                      <User size={14} className="mr-1" />{" "}
                      {task.assignedTo?.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-48">
                <select
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors
                    ${
                      task.status === "Completed"
                        ? "bg-green-50 text-green-700 border-green-200 focus:ring-green-500"
                        : task.status === "In Progress"
                          ? "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500"
                          : "bg-yellow-50 text-yellow-800 border-yellow-200 focus:ring-yellow-500"
                    }`}
                  value={task.status}
                  onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No tasks available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
