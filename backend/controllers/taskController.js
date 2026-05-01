const Task = require('../models/Task');

// Create and assign a task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, project, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      project,
      assignedTo
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks (Supports filtering for the Dashboard)
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    // If the user is a Member, only show their assigned tasks. Admins see all.
    const query = req.user.role === 'Admin' ? {} : { assignedTo: req.user._id };
    
    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name email');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task status
// @route   PUT /api/tasks/:id
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can only update their own tasks
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};