import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router();
const taskController = new TaskController();

// CRUD operations
router.post('/tasks', taskController.createTask.bind(taskController));
router.get('/tasks', taskController.getAllTasks.bind(taskController));
router.get('/tasks/:id', taskController.getTaskById.bind(taskController));
router.put('/tasks/:id', taskController.updateTask.bind(taskController));
router.delete('/tasks/:id', taskController.deleteTask.bind(taskController));

// Dependencies management
router.post('/tasks/:id/dependencies', taskController.addDependency.bind(taskController));
router.delete('/tasks/:id/dependencies/:dependencyId', taskController.removeDependency.bind(taskController));
router.get('/tasks/:id/dependencies', taskController.getAllDependencies.bind(taskController));

export default router; 