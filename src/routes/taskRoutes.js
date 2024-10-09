const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * POST /tasks/create
 * @summary Creates a new task
 * @param {express.Request} req - The request object containing task details in the body.
 * @param {express.Response} res - The response object to send the task creation confirmation.
 * @returns {void}
 * @throws {400} If the task data is invalid or incomplete.
 * @throws {500} If there is a server error during task creation.
 */
router.post('/create', taskController.createTask);

/**
 * GET /tasks/:id
 * @summary Retrieves a task by its ID
 * @param {express.Request} req - The request object with `id` as a URL parameter.
 * @param {express.Response} res - The response object to send the requested task details.
 * @returns {void}
 * @throws {404} If the task is not found.
 * @throws {500} If there is a server error during task retrieval.
 */
router.get('/:id', taskController.getTask);

/**
 * PATCH /tasks/:id
 * @summary Updates a task by its ID
 * @param {express.Request} req - The request object containing updated task details in the body and `id` as a URL parameter.
 * @param {express.Response} res - The response object to send the update confirmation or updated task details.
 * @returns {void}
 * @throws {400} If the update data is invalid or incomplete.
 * @throws {404} If the task to be updated is not found.
 * @throws {500} If there is a server error during task update.
 */
router.patch('/:id', taskController.updateTask);

/**
 * DELETE /tasks/:id
 * @summary Deletes a task by its ID
 * @param {express.Request} req - The request object with `id` as a URL parameter.
 * @param {express.Response} res - The response object to send the deletion confirmation.
 * @returns {void}
 * @throws {404} If the task to be deleted is not found.
 * @throws {500} If there is a server error during task deletion.
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
