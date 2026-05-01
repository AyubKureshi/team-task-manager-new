const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, adminOnly, createTask) // Admins assign tasks
  .get(protect, getTasks);              // Get tasks for dashboard tracking

router.route('/:id').put(protect, updateTaskStatus); // Update status

module.exports = router;