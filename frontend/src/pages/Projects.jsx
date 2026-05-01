import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FolderPlus, Folder } from "lucide-react";

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    const response = await API.get("/projects");
    setProjects(response.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", { name, description });
      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      alert("Error creating project");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Projects
        </h1>
      </div>

      {user?.role === "Admin" && (
        <div className="p-4 bg-white border border-gray-200 shadow-sm md:p-6 rounded-xl">
          <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800 md:mb-5">
            <FolderPlus className="mr-2 text-blue-600" size={20} /> Create New
            Project
          </h2>
          <form
            onSubmit={handleCreateProject}
            className="flex flex-col gap-3 md:flex-row md:gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                placeholder="Project Name"
                required
                className="w-full px-4 py-2.5 md:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex-2">
              <input
                type="text"
                placeholder="Short Description"
                className="w-full px-4 py-2.5 md:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2.5 md:py-2 md:w-auto text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
        {projects.map((project) => (
          <div
            key={project._id}
            className="flex flex-col p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="flex items-center font-semibold text-gray-900">
                <Folder className="mr-2 text-blue-500" size={18} />{" "}
                {project.name}
              </h3>
            </div>
            <p className="flex-1 mb-4 text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
            <div className="pt-4 mt-auto border-t border-gray-100">
              <p className="flex items-center text-xs font-medium text-gray-500">
                <span className="flex items-center justify-center w-6 h-6 mr-2 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">
                  {project.createdBy?.name?.charAt(0).toUpperCase()}
                </span>
                Led by {project.createdBy?.name}
              </p>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            No projects found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
