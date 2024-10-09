const request = require('supertest');
const express = require('express');
const { Project } = require('../models');
const projectController = require('../controllers/projectController');

jest.mock('../models');

const app = express();
app.use(express.json());
app.post('/projects', projectController.createProject);
app.get('/projects', projectController.getProject);
app.patch('/projects/:id', projectController.updateProject);
app.delete('/projects/:id', projectController.deleteProject);

describe('Project Controller', () => {

  // Test pour la fonction createProject
  describe('POST /projects', () => {
    it('should create a project successfully', async () => {
      const mockProject = { id: 1, projectName: 'Test Project' };
      Project.findOne.mockResolvedValue(null); // Simule l'absence de projet avec ce nom
      Project.create.mockResolvedValue(mockProject); // Simule la création du projet

      const res = await request(app)
        .post('/projects')
        .send({ projectName: 'Test Project', createdBy: 'User1', deadline: '2024-12-01', projectStatus: 'Open' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Project created successfully');
      expect(res.body).toHaveProperty('projectId', mockProject.id);
    });

    it('should return 400 if project name already exists', async () => {
      Project.findOne.mockResolvedValue({ id: 1, projectName: 'Test Project' }); // Simule un projet déjà existant

      const res = await request(app)
        .post('/projects')
        .send({ projectName: 'Test Project', createdBy: 'User1', deadline: '2024-12-01', projectStatus: 'Open' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Name is already used');
    });
  });

  // Test pour la fonction getProject
  describe('GET /projects', () => {
    it('should return all projects successfully', async () => {
      const mockProjects = [{ id: 1, projectName: 'Test Project 1' }, { id: 2, projectName: 'Test Project 2' }];
      Project.findAll.mockResolvedValue(mockProjects); // Simule la récupération de plusieurs projets

      const res = await request(app).get('/projects');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Project found');
      expect(res.body.project.length).toBe(2); // Simule que deux projets sont trouvés
    });

    it('should return 404 if no projects found', async () => {
      Project.findAll.mockResolvedValue(null); // Simule l'absence de projets

      const res = await request(app).get('/projects');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Project not found');
    });
  });

  // Test pour la fonction updateProject
  describe('PATCH /projects/:id', () => {
    it('should update a project successfully', async () => {
      const mockProject = { id: 1, projectName: 'Updated Project', update: jest.fn() };
      Project.findByPk.mockResolvedValue(mockProject); // Simule la récupération du projet

      const res = await request(app)
        .patch('/projects/1')
        .send({ projectName: 'Updated Project', deadline: '2024-12-31', projectStatus: 'In Progress' });

      expect(res.statusCode).toEqual(200);
      expect(mockProject.update).toHaveBeenCalledWith({
        projectName: 'Updated Project',
        deadline: '2024-12-31',
        projectStatus: 'In Progress'
      });
      expect(res.body).toHaveProperty('message', 'Project updated successfully');
    });

    it('should return 404 if project not found', async () => {
      Project.findByPk.mockResolvedValue(null); // Simule l'absence du projet

      const res = await request(app)
        .patch('/projects/1')
        .send({ projectName: 'Updated Project', deadline: '2024-12-31', projectStatus: 'In Progress' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Project not found');
    });
  });

  // Test pour la fonction deleteProject
  describe('DELETE /projects/:id', () => {
    it('should delete a project successfully', async () => {
      const mockProject = { id: 1, destroy: jest.fn() };
      Project.findByPk.mockResolvedValue(mockProject); // Simule la récupération du projet

      const res = await request(app).delete('/projects/1');

      expect(res.statusCode).toEqual(200);
      expect(mockProject.destroy).toHaveBeenCalled();
      expect(res.body).toHaveProperty('message', 'Project deleted successfully');
    });

    it('should return 404 if project not found', async () => {
      Project.findByPk.mockResolvedValue(null); // Simule l'absence du projet

      const res = await request(app).delete('/projects/1');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Project not found');
    });
  });
});
