import { Repository } from 'typeorm';
import { Task } from '../models/Task';
import { AppDataSource } from '../config/database';
import NodeCache from 'node-cache';

export class TaskService {
    private taskRepository: Repository<Task>;
    private cache: NodeCache;

    constructor() {
        this.taskRepository = AppDataSource.getRepository(Task);
        this.cache = new NodeCache({ stdTTL: 300 }); 
    }

    async createTask(taskData: Partial<Task>): Promise<Task> {
        const task = this.taskRepository.create(taskData);
        await this.taskRepository.save(task);
        this.clearCache();
        return task;
    }

    async getAllTasks(page: number = 1, limit: number = 10, filters?: any): Promise<{ tasks: Task[], total: number }> {
        const cacheKey = `tasks_${page}_${limit}_${JSON.stringify(filters)}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            return cached as { tasks: Task[], total: number };
        }

        const queryBuilder = this.taskRepository.createQueryBuilder('task');

        if (filters) {
            if (filters.status) {
                queryBuilder.andWhere('task.status = :status', { status: filters.status });
            }
            if (filters.priority) {
                queryBuilder.andWhere('task.priority = :priority', { priority: filters.priority });
            }
        }

        const [tasks, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const result = { tasks, total };
        this.cache.set(cacheKey, result);
        return result;
    }

    async getTaskById(id: number): Promise<Task | null> {
        const cacheKey = `task_${id}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            return cached as Task;
        }

        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['dependencies']
        });

        if (task) {
            this.cache.set(cacheKey, task);
        }
        return task;
    }

    async updateTask(id: number, taskData: Partial<Task>): Promise<Task | null> {
        await this.taskRepository.update(id, taskData);
        this.clearCache();
        return this.getTaskById(id);
    }

    async deleteTask(id: number): Promise<boolean> {
        const result = await this.taskRepository.delete(id);
        this.clearCache();
        return result.affected ? result.affected > 0 : false;
    }

    async addDependency(taskId: number, dependencyId: number): Promise<boolean> {
        const task = await this.getTaskById(taskId);
        const dependency = await this.getTaskById(dependencyId);

        if (!task || !dependency) {
            throw new Error('Task or dependency not found');
        }

        // Kiểm tra circular dependency
        if (await this.wouldCreateCircularDependency(taskId, dependencyId)) {
            throw new Error('Adding this dependency would create a circular reference');
        }

        if (!task.dependencies) {
            task.dependencies = [];
        }
        task.dependencies.push(dependency);
        await this.taskRepository.save(task);
        this.clearCache();
        return true;
    }

    async removeDependency(taskId: number, dependencyId: number): Promise<boolean> {
        const task = await this.getTaskById(taskId);
        if (!task || !task.dependencies) {
            return false;
        }

        task.dependencies = task.dependencies.filter(dep => dep.id !== dependencyId);
        await this.taskRepository.save(task);
        this.clearCache();
        return true;
    }

    async getAllDependencies(taskId: number): Promise<{ direct: Task[], indirect: Task[] }> {
        const task = await this.getTaskById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        const direct = task.dependencies || [];
        const indirect: Task[] = [];
        const visited = new Set<number>();

        for (const dep of direct) {
            await this.findIndirectDependencies(dep.id, indirect, visited);
        }

        return { direct, indirect };
    }

    private async findIndirectDependencies(taskId: number, result: Task[], visited: Set<number>) {
        if (visited.has(taskId)) {
            return;
        }

        visited.add(taskId);
        const task = await this.getTaskById(taskId);
        if (task && task.dependencies) {
            for (const dep of task.dependencies) {
                if (!visited.has(dep.id)) {
                    result.push(dep);
                    await this.findIndirectDependencies(dep.id, result, visited);
                }
            }
        }
    }

    private async wouldCreateCircularDependency(taskId: number, dependencyId: number): Promise<boolean> {
        const visited = new Set<number>();
        return this.checkCircularDependency(dependencyId, taskId, visited);
    }

    private async checkCircularDependency(currentId: number, targetId: number, visited: Set<number>): Promise<boolean> {
        if (currentId === targetId) {
            return true;
        }

        if (visited.has(currentId)) {
            return false;
        }

        visited.add(currentId);
        const current = await this.getTaskById(currentId);
        
        if (current && current.dependencies) {
            for (const dep of current.dependencies) {
                if (await this.checkCircularDependency(dep.id, targetId, visited)) {
                    return true;
                }
            }
        }

        return false;
    }

    private clearCache(): void {
        this.cache.flushAll();
    }
} 