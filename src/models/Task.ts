import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";

export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed"
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true, type: 'text' })
    description!: string;

    @Column({ type: 'datetime' })
    dueDate!: Date;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM
    })
    priority!: TaskPriority;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO
    })
    status!: TaskStatus;

    @ManyToMany(() => Task, task => task.dependentTasks)
    @JoinTable({
        name: "task_dependencies",
        joinColumn: {
            name: "task_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "dependency_id",
            referencedColumnName: "id"
        }
    })
    dependencies!: Task[];

    @ManyToMany(() => Task, task => task.dependencies)
    dependentTasks!: Task[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 