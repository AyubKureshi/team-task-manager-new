const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Only Admins can create projects, but any authenticated user can view them
router.route('/').post(protect, adminOnly, createProject).get(protect, getProjects);

module.exports = router;