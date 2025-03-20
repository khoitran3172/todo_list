import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { Task, TaskStatus, TaskPriority } from '../models/Task';


class AppError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    private handleError(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        return 'An unexpected error occurred';
    }

    async createTask(req: Request, res: Response) {
        try {
            const taskData = req.body;
            const task = await this.taskService.createTask(taskData);
            return res.status(201).json(task);
        } catch (error) {
            return res.status(400).json({ error: this.handleError(error) });
        }
    }

    async getAllTasks(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filters: any = {};

            if (req.query.status && Object.values(TaskStatus).includes(req.query.status as TaskStatus)) {
                filters.status = req.query.status;
            }

            if (req.query.priority && Object.values(TaskPriority).includes(req.query.priority as TaskPriority)) {
                filters.priority = req.query.priority;
            }

            const result = await this.taskService.getAllTasks(page, limit, filters);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: this.handleError(error) });
        }
    }

    async getTaskById(req: Request, res: Response) {
        try {
            const taskId = parseInt(req.params.id);
            const task = await this.taskService.getTaskById(taskId);
            
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.json(task);
        } catch (error) {
            return res.status(400).json({ error: this.handleError(error) });
        }
    }

    async updateTask(req: Request, res: Response) {
        try {
            const taskId = parseInt(req.params.id);
            const taskData = req.body;
            const task = await this.taskService.updateTask(taskId, taskData);

            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.json(task);
        } catch (error) {
            return res.status(400).json({ error: this.handleError(error) });
        }
    }

    async deleteTask(req: Request, res: Response) {
        try {
            const taskId = parseInt(req.params.id);
            const success = await this.taskService.deleteTask(taskId);

            if (!success) {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: this.handleError(error) });
        }
    }

    async addDependency(req: Request, res: Response) {
        try {
            const taskId = parseInt(req.params.id);
            const { dependencyId } = req.body;

            if (!dependencyId) {
                return res.status(400).json({ error: 'dependencyId is required' });
            }

            await this.taskService.addDependency(taskId, dependencyId);
            return res.status(200).json({ message: 'Dependency added successfully' });
        } catch (error) {
            return res.status(400).json({ error: this.handleError(error) });
        }
    }

    async removeDependency(req: Request, res: Response) {
        try {
            const taskId = parseInt(req.params.id);
            const dependencyId = parseInt(req.params.dependencyId);
            const success = await this.taskService.removeDependency(taskId, dependencyId);

            if (!success) {
                return res.status(404).json({ error: 'Task or dependency not found' });
            }

            return res.status(200).json({ message: 'Dependency removed successfully' });
        } catch (error) {
            return res.status(400).json({ error: this.handleError(error) });
        }
    }

    async getAllDependencies(req: Request, res: Response) {
        try {
            const taskId = parseInt(req.params.id);
            const dependencies = await this.taskService.getAllDependencies(taskId);
            return res.json(dependencies);
        } catch (error) {
            return res.status(400).json({ error: this.handleError(error) });
        }
    }
} 