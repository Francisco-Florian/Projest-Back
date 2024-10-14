const request = require('supertest');
const app = require('../app'); // Importez votre instance d'application Express
const { Project } = require('../models');

// Mock du middleware d'authentification
jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
    req.user = { id: 1 }; // Simule un utilisateur authentifié
    next();
});

describe('Project Controller', () => {
    
    // Tests pour createProject
    describe('POST /api/project/create - createProject', () => {
        it('should create a project successfully', async () => {
            const mockProjectData = {
                projectName: 'New Project',
                deadline: '2024-12-31',
                projectStatus: 'ongoing',
            };

            const createSpy = jest.spyOn(Project, 'create').mockResolvedValue({
                id: 1,
                ...mockProjectData,
                createdBy: 1,
            });

            const response = await request(app)
                .post('/api/project/create')
                .send(mockProjectData)
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Project created successfully');
            expect(response.body.projectId).toBe(1);
            expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
                projectName: 'New Project',
                createdBy: 1,
                deadline: '2024-12-31',
                projectStatus: 'ongoing',
            }));
        });

        it('should return 400 if project with the same name exists', async () => {
            jest.spyOn(Project, 'findOne').mockResolvedValue({ id: 1, projectName: 'Existing Project' });

            const response = await request(app)
                .post('/api/project/create')
                .send({
                    projectName: 'Existing Project',
                    deadline: '2024-12-31',
                    projectStatus: 'ongoing',
                })
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('You already have a project with this name');
        });
    });

    // Tests pour getProject
    describe('GET /api/project/ - getProject', () => {
        it('should return a list of projects for the authenticated user', async () => {
            const mockProjects = [
                { id: 1, projectName: 'Project 1', createdBy: 1 },
                { id: 2, projectName: 'Project 2', createdBy: 1 },
            ];

            jest.spyOn(Project, 'findAll').mockResolvedValue(mockProjects);

            const response = await request(app)
                .get('/api/project/')
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(200);
            expect(response.body.projects).toEqual(expect.arrayContaining(mockProjects));
        });
    });

    // Tests pour updateProject
    describe('PATCH /api/project/:id - updateProject', () => {
        it('should update a project if the user is the owner', async () => {
            const mockProject = {
                id: 1,
                projectName: 'Old Project',
                createdBy: 1,
                update: jest.fn().mockResolvedValue(true),
            };

            jest.spyOn(Project, 'findOne').mockResolvedValue(mockProject);

            const response = await request(app)
                .patch('/api/project/1')
                .send({
                    projectName: 'Updated Project',
                    deadline: '2024-12-31',
                    projectStatus: 'completed',
                })
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Project updated successfully');
            expect(mockProject.update).toHaveBeenCalledWith({
                projectName: 'Updated Project',
                deadline: '2024-12-31',
                projectStatus: 'completed',
            });
        });

        it('should return 404 if the project is not found or user does not have permission', async () => {
            jest.spyOn(Project, 'findOne').mockResolvedValue(null);

            const response = await request(app)
                .patch('/api/project/1')
                .send({
                    projectName: 'Updated Project',
                    deadline: '2024-12-31',
                    projectStatus: 'completed',
                })
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Project not found or you do not have permission to modify it');
        });
    });

    // Tests pour deleteProject
    describe('DELETE /api/project/:id - deleteProject', () => {
        it('should delete a project if the user is the owner', async () => {
            const mockProject = {
                id: 1,
                projectName: 'Project to delete',
                createdBy: 1,
                destroy: jest.fn().mockResolvedValue(true),
            };

            jest.spyOn(Project, 'findOne').mockResolvedValue(mockProject);

            const response = await request(app)
                .delete('/api/project/1')
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Project deleted successfully');
            expect(mockProject.destroy).toHaveBeenCalled();
        });

        it('should return 404 if the project is not found or user does not have permission', async () => {
            jest.spyOn(Project, 'findOne').mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/project/1')
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Project not found or you do not have permission to delete it');
        });
    });
});
