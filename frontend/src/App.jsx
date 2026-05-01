import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import { LayoutDashboard, FolderKanban, CheckSquare } from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Icon size={18} className="mr-2" />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-blue-600">
                TeamTask
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <NavLink
                to="/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
              />
              <NavLink to="/projects" icon={FolderKanban} label="Projects" />
              <NavLink to="/tasks" icon={CheckSquare} label="Tasks" />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Layout>
              <Projects />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
