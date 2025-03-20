import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import taskRoutes from './routes/taskRoutes';

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api', taskRoutes);


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;


AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.log("Database connection error:", error));
