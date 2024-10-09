const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

/**
 * POST /projects/create
 * @summary Creates a new project
 * @param {express.Request} req - The request object containing project details in the body.
 * @param {express.Response} res - The response object to send the project creation confirmation.
 * @returns {void}
 * @throws {400} If the project data is invalid or incomplete.
 * @throws {500} If there is a server error during project creation.
 */
router.post('/create', projectController.createProject);
router.get('/', projectController.getProject);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
