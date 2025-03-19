import { Task, TaskStatus } from '../models/Task';
import { LessThan, MoreThan } from 'typeorm';
import { AppDataSource } from '../config/database';
import * as nodemailer from 'nodemailer';
import * as cron from 'node-cron';

export class NotificationService {
    private taskRepository = AppDataSource.getRepository(Task);
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    constructor() {
        // check upcoming tasks at 9:00
        cron.schedule('0 9 * * *', () => {
            this.checkUpcomingTasks();
        });

        // check overdue tasks every hour
        cron.schedule('0 * * * *', () => {
            this.checkOverdueTasks();
        });
    }

    private async checkUpcomingTasks() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const upcomingTasks = await this.taskRepository.find({
            where: {
                dueDate: LessThan(tomorrow),
                status: TaskStatus.TODO
            }
        });

        for (const task of upcomingTasks) {
            await this.sendNotification(
                'Task sắp đến hạn',
                `Task "${task.title}" sẽ đến hạn vào ${task.dueDate}`
            );
        }
    }

    private async checkOverdueTasks() {
        const now = new Date();

        const overdueTasks = await this.taskRepository.find({
            where: {
                dueDate: LessThan(now),
                status: TaskStatus.TODO
            }
        });

        for (const task of overdueTasks) {
            await this.sendNotification(
                'Task quá hạn',
                `Task "${task.title}" đã quá hạn từ ${task.dueDate}`
            );
        }
    }

    private async sendNotification(subject: string, content: string) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: process.env.NOTIFICATION_EMAIL,
                subject,
                text: content
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }
} 